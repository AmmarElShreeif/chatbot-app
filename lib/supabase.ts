import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Message, Profile } from '@/types';

// Initialize Supabase client
const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or anonymous key is missing. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Helper functions for messages
export const getMessages = async () => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data as Message[];
};

export const addMessage = async (content: string, isUser: boolean) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    console.error('Error getting user:', userError);
    return null;
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        user_id: userData.user.id,
        content,
        is_user: isUser,
      },
    ])
    .select();

  if (error) {
    console.error('Error adding message:', error);
    return null;
  }

  return data[0] as Message;
};

// Fetch user profile from Supabase
export const getUserProfile = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    console.error('Error getting user:', userError);
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data as Profile;
};

// Update user theme preference in Supabase
export const updateThemePreference = async (
  theme: 'light' | 'dark' | 'system'
) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    console.error('Error getting user:', userError);
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ theme_preference: theme, updated_at: new Date().toISOString() })
    .eq('id', userData.user.id)
    .select();

  if (error) {
    console.error('Error updating theme preference:', error);
    return null;
  }

  return data[0] as Profile;
};
