import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query/query-client';
import React from 'react';
import "../styles/global.css";
import { ThemeStorageProvider, useThemeStorage } from '@/hooks/use-theme-storage';

// Inner component that uses theme context
function RootLayoutContent() {
  const { colorScheme } = useThemeStorage();
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="phim/[id]" />
        <Stack.Screen name="series/[id]" />
        <Stack.Screen name="xem-phim/[id]" />
        <Stack.Screen name="all/page" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

// Root component with providers
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeStorageProvider>
        <RootLayoutContent />
      </ThemeStorageProvider>
    </QueryClientProvider>
  );
} 