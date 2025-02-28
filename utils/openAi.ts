import { MessageType } from '@/types';
import OpenAI from 'openai';

const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey,
  dangerouslyAllowBrowser: true,
});

const generateAI = async (messages: MessageType[]) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: messages.map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text,
      })),
    });

    console.log('OpenAI Response:', response.choices[0]?.message?.content);

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error from OpenAI:', error);
    return null;
  }
};

export default generateAI;
