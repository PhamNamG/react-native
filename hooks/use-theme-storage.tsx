import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useSystemColorScheme } from 'react-native';

const THEME_STORAGE_KEY = '@app_theme_preference';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  themePreference: ThemePreference;
  colorScheme: ColorScheme;
  isLoading: boolean;
  setThemePreference: (theme: ThemePreference) => Promise<void>;
  toggleTheme: () => Promise<void>;
  resetTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeStorageProvider({ children }: { children: ReactNode }): JSX.Element {
  const systemColorScheme = useSystemColorScheme();
  const [themePreference, setThemePref] = useState<ThemePreference>('system');
  const [isLoading, setIsLoading] = useState(true);

  const colorScheme: ColorScheme = 
    themePreference === 'system' 
      ? (systemColorScheme ?? 'light')
      : themePreference;

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemePref(savedTheme as ThemePreference);
      }
    } catch (error) {
      console.error('[ThemeStorage] Failed to load theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setThemePreference = useCallback(async (theme: ThemePreference) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      setThemePref(theme);
    } catch (error) {
      console.error('[ThemeStorage] Failed to save theme:', error);
      throw error;
    }
  }, []);

  const toggleTheme = useCallback(async () => {
    try {
      let newTheme: ThemePreference;
      
      if (themePreference === 'system') {
        newTheme = 'light';
      } else if (themePreference === 'light') {
        newTheme = 'dark';
      } else {
        newTheme = 'system';
      }

      await setThemePreference(newTheme);
    } catch (error) {
      console.error('[ThemeStorage] Failed to toggle theme:', error);
      throw error;
    }
  }, [themePreference, setThemePreference]);

  const resetTheme = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
      setThemePref('system');
    } catch (error) {
      console.error('[ThemeStorage] Failed to reset theme:', error);
      throw error;
    }
  }, []);

  const value: ThemeContextType = {
    themePreference,
    colorScheme,
    isLoading,
    setThemePreference,
    toggleTheme,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeStorage(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeStorage must be used within ThemeStorageProvider');
  }
  return context;
}

