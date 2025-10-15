
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Linking, TouchableOpacity, Alert } from 'react-native';
import { isNotificationEnabled } from '@/lib/notifications/push-notification';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function NotificationSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const enabled = await isNotificationEnabled();
    setIsEnabled(enabled);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <ThemedView className="p-4 items-center">
        <ActivityIndicator size="small" color={isDark ? '#fff' : '#000'} />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 p-4">
      {/* Status */}
      <View className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <View className="flex-row items-center justify-between mb-2">
          <ThemedText className="text-base font-semibold">
            Trạng thái thông báo
          </ThemedText>
          <View className={`px-3 py-1 rounded-full ${
            isEnabled 
              ? 'bg-green-500/20' 
              : 'bg-gray-500/20'
          }`}>
            <Text className={`text-xs font-bold ${
              isEnabled ? 'text-green-500' : 'text-gray-500'
            }`}>
              {isEnabled ? 'BẬT' : 'TẮT'}
            </Text>
          </View>
        </View>
        
        <ThemedText className="text-sm opacity-70">
          {isEnabled 
            ? '✅ Bạn sẽ nhận thông báo khi có phim hoặc tập mới' 
            : '❌ Vui lòng bật thông báo trong Cài đặt để nhận thông tin mới nhất'
          }
        </ThemedText>
      </View>

      {/* Action */}
      {!isEnabled && (
        <TouchableOpacity
          onPress={() => Linking.openSettings()}
          className={`p-4 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
        >
          <Text className="text-white text-center font-semibold">
            ⚙️ Mở Cài đặt hệ thống
          </Text>
        </TouchableOpacity>
      )}

      {/* Info */}
      <View className="mt-6 px-2">
        <ThemedText className="text-sm opacity-70 mb-3">
          📌 Bạn sẽ nhận thông báo khi:
        </ThemedText>
        <View className="ml-4 space-y-2">
          <ThemedText className="text-sm opacity-60 mb-2">
            • Có tập phim mới được phát hành
          </ThemedText>
          <ThemedText className="text-sm opacity-60 mb-2">
            • Có phim mới được thêm vào
          </ThemedText>
          <ThemedText className="text-sm opacity-60">
            • Có cập nhật quan trọng
          </ThemedText>
        </View>
      </View>

      {/* How it works */}
      <View className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <ThemedText className="text-xs font-semibold mb-2 opacity-70">
          💡 Cách hoạt động:
        </ThemedText>
        <ThemedText className="text-xs opacity-60">
          Khi có thông báo mới, bạn sẽ nhận được notification trên điện thoại. 
          Nhấn vào notification để xem ngay phim hoặc tập mới.
        </ThemedText>
      </View>
    </ThemedView>
  );
}
