import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ViewStyle, TextStyle } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeStyles {
  container: ViewStyle;
  text: TextStyle;
  recordContainer: ViewStyle;
  input: TextStyle;
  button: ViewStyle;
  checkboxContainer: ViewStyle;
}

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  currentTheme: ThemeStyles;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useSystemColorScheme();
  const [theme, setTheme] = useState<Theme>('light');

  const currentTheme: ThemeStyles = theme === 'light'
  ? {
      container: { backgroundColor: 'white' },
      text: { color: 'black' },
      recordContainer: { backgroundColor: '#f9f9f9' },
      input: { borderColor: 'gray', borderWidth: 1, padding: 10 },
      button: { backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
      checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
    }
  : {
      container: { backgroundColor: '#121212' },
      text: { color: 'white' },
      recordContainer: { backgroundColor: '#1E1E1E' },
      input: { borderColor: 'lightgray', borderWidth: 1, padding: 10 },
      button: { backgroundColor: '#0056b3', padding: 10, borderRadius: 5 },
      checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
    };

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme as Theme);
      } else {
        setTheme(systemColorScheme ?? 'light');
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};