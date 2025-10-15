import { create } from 'zustand';
import { notificationApi } from '@/lib/api/services/notification';

interface NotificationState {
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUnreadCount: () => Promise<void>;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
  resetUnread: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchUnreadCount: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationApi.getUnreadCount();
      set({ 
        unreadCount: response.unreadCount,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('❌ Failed to fetch unread count:', error);
      set({ 
        error: error.message,
        isLoading: false,
      });
    }
  },

  setUnreadCount: (count: number) => {
    set({ unreadCount: count });
  },

  incrementUnread: () => {
    set((state) => ({ unreadCount: state.unreadCount + 1 }));
  },

  decrementUnread: () => {
    set((state) => ({ 
      unreadCount: Math.max(0, state.unreadCount - 1) 
    }));
  },

  resetUnread: () => {
    set({ unreadCount: 0 });
  },
}));

