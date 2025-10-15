import { notificationApi, NotificationResponse, UnreadCountResponse } from "@/lib/api/services/notification";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useNotifications = (page: number = 1,limit: number = 20) => {
  return useInfiniteQuery<NotificationResponse>({
    queryKey: ['notifications', page, limit],
    queryFn: () => notificationApi.getNotificationsByDevice(page as number, limit),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useUnreadCount = () => {
  return useQuery<UnreadCountResponse>({
    queryKey: ['unreadCount'],
    queryFn: () => notificationApi.getUnreadCount(),
    refetchInterval: 60000, // Refetch every 1 minute
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => notificationApi.markAsRead(notificationId),
    onSuccess: () => {
      // Invalidate notifications and unread count
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
};