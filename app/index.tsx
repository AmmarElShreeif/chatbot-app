import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageSquareText, UserPlus, LogIn } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      await supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          router.replace('/(tabs)');
        }
      });
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.background}
      />

      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=200&auto=format&fit=crop',
          }}
          style={styles.logo}
        />
        <Text style={styles.appName}>AI Chat</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to AI Chat</Text>
        <Text style={styles.subtitle}>
          Chat with our AI assistant and get instant responses to your questions
        </Text>

        <View style={styles.featureContainer}>
          <View style={styles.feature}>
            <MessageSquareText size={24} color="#fff" />
            <Text style={styles.featureText}>Smart AI Conversations</Text>
          </View>
          <View style={styles.feature}>
            <UserPlus size={24} color="#fff" />
            <Text style={styles.featureText}>Create Your Account</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => router.push('/auth/login')}
        >
          <LogIn size={20} color="#4c669f" />
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => router.push('/auth/signup')}
        >
          <UserPlus size={20} color="#fff" />
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#fff',
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
  },
  featureContainer: {
    width: '100%',
    marginTop: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  featureText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  button: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#fff',
  },
  loginButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#4c669f',
    marginLeft: 8,
  },
  signupButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  signupButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
});
