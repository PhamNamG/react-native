import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query/query-client';
import React from 'react';
import * as Notifications from 'expo-notifications';
import "../styles/global.css";
import { ThemeStorageProvider } from '@/hooks/use-theme-storage';
import RootLayoutContent from '@/layout/rootLayout';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeStorageProvider>
        <RootLayoutContent />
      </ThemeStorageProvider>
    </QueryClientProvider>
  );
}
