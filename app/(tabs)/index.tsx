import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Send, Mic, MicOff } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { useTheme } from '@/context/ThemeContext';
import { getMessages, addMessage } from '@/lib/supabase';
import { MessageType, Message as SupabaseMessage } from '@/types';
import generateAI from '@/utils/openAi';

export default function ChatScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get messages from Supabase
        const supabaseMessages = await getMessages();

        if (supabaseMessages.length > 0) {
          // Convert Supabase messages to our format
          const formattedMessages = supabaseMessages.map(
            (msg: SupabaseMessage) => ({
              id: msg.id,
              text: msg.content,
              isUser: msg.is_user,
              timestamp: new Date(msg.created_at),
            })
          );

          setMessages(formattedMessages);
        } else {
          // If no messages, add a welcome message
          setMessages([
            {
              id: '1',
              text: "Hello! I'm your AI assistant. How can I help you today?",
              isUser: false,
              timestamp: new Date(),
            },
          ]);

          // Save welcome message to Supabase
          await addMessage(
            "Hello! I'm your AI assistant. How can I help you today?",
            false
          );
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to welcome message if there's an error
        setMessages([
          {
            id: '1',
            text: "Hello! I'm your AI assistant. How can I help you today?",
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const startRecording = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }

      // Prepare recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    setIsProcessing(true);

    try {
      await recording.stopAndUnloadAsync();

      // In a real app, you would send the audio file to a speech-to-text service
      // For this demo, we'll simulate processing and add a placeholder message

      setTimeout(() => {
        const userMessage = 'This is a transcribed voice message.';
        sendMessage(userMessage);
        setIsProcessing(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsProcessing(false);
    }

    setRecording(null);
  };

  const sendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    // Add user message to UI
    const userMessage: MessageType = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');

    try {
      // Save user message to Supabase
      await addMessage(text, true);

      // Simulate AI thinking
      setTimeout(async () => {
        const aiResponseText = await generateAI([...messages, userMessage]);

        if (!aiResponseText) {
          setMessages([
            ...messages,
            userMessage,
            {
              id: '1',
              text: 'Hello! Something wrong in api data',
              isUser: false,
              timestamp: new Date(),
            },
          ]);
          return;
        }

        // Add AI message to UI
        const aiMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, aiMessage]);

        await addMessage(aiResponseText, false);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }: { item: MessageType }) => {
    const formattedTime = item.timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View
        style={[
          styles.messageContainer,
          item.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            item.isUser
              ? [
                  styles.userMessageBubble,
                  { backgroundColor: colors.userMessage },
                ]
              : [styles.aiMessageBubble, { backgroundColor: colors.aiMessage }],
          ]}
        >
          <Text
            style={[
              styles.messageText,
              item.isUser
                ? [styles.userMessageText, { color: colors.userMessageText }]
                : [styles.aiMessageText, { color: colors.aiMessageText }],
            ]}
          >
            {item.text}
          </Text>
        </View>
        <Text style={[styles.messageTime, { color: colors.placeholder }]}>
          {formattedTime}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.card, borderTopColor: colors.border },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.background, color: colors.text },
          ]}
          placeholder="Type a message..."
          placeholderTextColor={colors.placeholder}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />

        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.recordButton,
                { backgroundColor: colors.background },
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <MicOff size={22} color={colors.error} />
              ) : (
                <Mic size={22} color={colors.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sendButton,
                !inputText.trim()
                  ? [
                      styles.sendButtonDisabled,
                      { backgroundColor: colors.border },
                    ]
                  : { backgroundColor: colors.primary },
              ]}
              onPress={() => sendMessage()}
              disabled={!inputText.trim()}
            >
              <Send
                size={22}
                color={
                  inputText.trim() ? colors.userMessageText : colors.placeholder
                }
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
  },
  userMessageBubble: {
    borderBottomRightRadius: 4,
  },
  aiMessageBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    fontFamily: 'Inter-Regular',
  },
  aiMessageText: {
    fontFamily: 'Inter-Regular',
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  recordButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {},
  processingContainer: {
    width: 88,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
