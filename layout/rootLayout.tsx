import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/lib/notifications/push-notification';
import "../styles/global.css";
import { useThemeStorage } from '@/hooks/use-theme-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { useNotificationStore } from '@/stores/notification-store';

export default function RootLayoutContent() {
  const { colorScheme } = useThemeStorage();
  const responseListener = useRef<Notifications.Subscription>();
  const notificationListener = useRef<Notifications.Subscription>();
  const lastNotificationId = useRef<string | null>(null);
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { incrementUnread } = useNotificationStore();

  useEffect(() => {
    // Auto register push token
    registerForPushNotificationsAsync();

    // Listen for incoming notifications (khi app đang chạy)
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      // Increment unread count in store
      incrementUnread();
      // Also invalidate queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    // Handle notification khi app đóng hoàn toàn
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response) {
        const data = response.notification.request.content.data;
        const notificationId = response.notification.request.identifier;


        if (data.productSlug && notificationId !== lastNotificationId.current) {
          lastNotificationId.current = notificationId;

          const targetRoute = `/xem-phim/${data.productSlug}`;

          setTimeout(() => {
            router.push(targetRoute as any);
          }, 300);
        }
      }
    });

    // Handle notification tap khi app đang chạy/background
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      const notificationId = response.notification.request.identifier;


      if (notificationId === lastNotificationId.current) {
        return;
      }

      lastNotificationId.current = notificationId;
      if (data.productSlug) {
        const targetRoute = `/xem-phim/${data.productSlug}`;

        setTimeout(() => {
          router.push(targetRoute as any);
        }, 100);
      } else {
        console.log('⚠️ Không tìm thấy categorySlug trong data');
      }
    });

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} >
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="phim/[id]" />
        <Stack.Screen name="xem-phim/[id]" />
        <Stack.Screen name="all/page" />
        <Stack.Screen name="notification/page" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}