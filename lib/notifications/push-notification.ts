/**
 * Push Notification Service - Simplified
 * App chỉ NHẬN notification và navigate khi tap
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/api/config/api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_TOKEN_KEY = '@push_token';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  
  if (!Device.isDevice) {
    return null;
  }
  

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return null;
    }
    
    
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    
    if (!projectId) {
      return null;
    }

    const pushToken = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = pushToken.data;

    // Save token to AsyncStorage for API calls
    await AsyncStorage.setItem(DEVICE_TOKEN_KEY, token);
    
    try {
      const response = await api.post(API_ENDPOINTS.PUSH_TOKEN_REGISTER, {
        token,
        platform: Platform.OS, // 'android' | 'ios'
        deviceName: Device.deviceName || 'Unknown Device',
        appVersion: Constants.expoConfig?.version || '1.0.0',
      });

      return token;
    } catch (error: any) {
      return token; // Vẫn trả về token nếu backend fail
    }
  } catch (error: any) {
    return null;
  }
}

/**
 * Unregister push token (khi user uninstall app hoặc disable notifications)
 */
export async function unregisterPushToken(token: string) {
  try {
    await api.post(API_ENDPOINTS.PUSH_TOKEN_UNREGISTER, { token });
    console.log('✅ Đã hủy đăng ký push token');
  } catch (error: any) {
    console.error('❌ Lỗi khi hủy token:', error.response?.data || error.message);
  }
}

/**
 * Check notification permission status
 */
export async function isNotificationEnabled(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    return false;
  }
}
