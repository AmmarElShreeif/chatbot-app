import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getUserProfile, updateThemePreference } from '../lib/supabase';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  setTheme: (theme: ThemeType) => Promise<void>;
  colors: {
    background: string;
    card: string;
    text: string;
    border: string;
    primary: string;
    secondary: string;
    accent: string;
    error: string;
    placeholder: string;
    userMessage: string;
    aiMessage: string;
    userMessageText: string;
    aiMessageText: string;
  };
}

const defaultColors = {
  light: {
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#333333',
    border: '#e0e0e0',
    primary: '#4c669f',
    secondary: '#3b5998',
    accent: '#192f6a',
    error: '#d32f2f',
    placeholder: '#999999',
    userMessage: '#4c669f',
    aiMessage: '#ffffff',
    userMessageText: '#ffffff',
    aiMessageText: '#333333',
  },
  dark: {
    background: '#121212',
    card: '#1e1e1e',
    text: '#f5f5f5',
    border: '#2c2c2c',
    primary: '#738bd7',
    secondary: '#5c79d0',
    accent: '#3a5ac9',
    error: '#cf6679',
    placeholder: '#777777',
    userMessage: '#738bd7',
    aiMessage: '#2c2c2c',
    userMessageText: '#ffffff',
    aiMessageText: '#f5f5f5',
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  isDark: false,
  setTheme: async () => {},
  colors: defaultColors.light,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Determine if dark mode is active
  const isDark =
    theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

  // Get colors based on current theme
  const colors = isDark ? defaultColors.dark : defaultColors.light;

  // Load theme preference from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        
        const storedTheme = await SecureStore.getItemAsync('themePreference');

        if (storedTheme) {
          setThemeState(storedTheme as ThemeType);
        } else {
          
          const profile = await getUserProfile();
          if (profile?.theme_preference) {
            setThemeState(profile.theme_preference as ThemeType);
            
            await SecureStore.setItemAsync(
              'themePreference',
              profile.theme_preference
            );
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Function to update theme
  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);

    try {
     
      await SecureStore.setItemAsync('themePreference', newTheme);

      
      await updateThemePreference(newTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  if (isLoading) {
    // You could return a loading indicator here if needed
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
