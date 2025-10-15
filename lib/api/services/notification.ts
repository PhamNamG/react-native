import api from '../config/api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_TOKEN_KEY = '@push_token';

export interface Notification {
  _id: string;
  title: string;
  body: string;
  categorySlug: string;
  productSlug?: string;
  episodeNumber?: number;
  sentAt: string;
  isRead?: boolean;
  data?: any;
  categoryId?: {
    _id: string;
    name: string;
    slug: string;
    linkImg?: string;
  };
}

export interface NotificationResponse {
  success: boolean;
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  unreadCount: number;
}

class NotificationApi {
  /**
   * Get device token from storage
   */
  private async getDeviceToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(DEVICE_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting device token:', error);
      return null;
    }
  }

  /**
   * Get notifications by device
   */
  async getNotificationsByDevice(page: number = 1, limit: number = 20): Promise<NotificationResponse> {
    const deviceToken = await this.getDeviceToken();
    
    if (!deviceToken) {
      throw new Error('Device token not found. Please enable notifications.');
    }
    const response = await api.get(`/notifications/device/history?page=${page}&limit=${limit}`, {
      headers: {
        'x-device-token': deviceToken,
      },
    });

    return response.data;
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    const deviceToken = await this.getDeviceToken();
    
    if (!deviceToken) {
      return { success: true, unreadCount: 0 };
    }

    try {
      const response = await api.get('/notifications/device/unread-count', {
        headers: {
          'x-device-token': deviceToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return { success: true, unreadCount: 0 };
    }
  }

  /**
   * Mark notification as read (if backend supports it)
   */
  async markAsRead(notificationId: string): Promise<void> {
    const deviceToken = await this.getDeviceToken();
    
    if (!deviceToken) {
      return;
    }

    try {
      await api.put(`/notifications/${notificationId}/read`, {}, {
        headers: {
          'x-device-token': deviceToken,
        },
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }
}

export const notificationApi = new NotificationApi();
