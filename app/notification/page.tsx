import { Text, View, FlatList, Pressable, RefreshControl, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import { useNotifications, useMarkAsRead } from "@/hooks/api/use-notification";
import { useNotificationStore } from "@/stores/notification-store";
import { Image } from "expo-image";
import { Notification } from "@/lib/api/services/notification";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { styles } from "./style";

export default function NotificationPage() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications(1,20);

  const markAsRead = useMarkAsRead();
  const { unreadCount, decrementUnread } = useNotificationStore();
  
  const notifications = data?.pages.flatMap(page => page.data) || [];
  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead.mutate(notification._id);
      // Decrease unread count in store
      decrementUnread();
    }

    // Navigate to appropriate page
    if (notification.productSlug) {
      router.push({
        pathname: '/xem-phim/[id]',
        params: { id: notification.productSlug },
      });
    } else if (notification.categorySlug) {
      router.push({
        pathname: '/phim/[id]',
        params: { id: notification.categorySlug },
      });
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    // Safe date parsing
    let timeAgo = 'Vừa xong';
    try {
      const sentDate = new Date(item.sentAt);
      if (!isNaN(sentDate.getTime())) {
        timeAgo = formatDistanceToNow(sentDate, {
          addSuffix: true,
          locale: vi,
        });
      }
    } catch (error) {
      console.error('Error parsing date:', item.sentAt);
    }

    const posterUrl = item.categoryId?.linkImg || 'https://via.placeholder.com/100x150';

    return (
      <Pressable
        onPress={() => handleNotificationPress(item)}
        style={[
          styles.notificationCard,
          {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderColor: isDark ? '#374151' : '#e5e7eb',
          },
        ]}
      >
        {/* Unread indicator */}
        {!item.isRead && (
          <View style={styles.unreadBadge} />
        )}

        {/* Poster */}
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          contentFit="cover"
        />

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { color: isDark ? '#ffffff' : '#111827' },
              !item.isRead && styles.titleUnread,
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <Text
            style={[
              styles.body,
              { color: isDark ? '#9ca3af' : '#6b7280' },
            ]}
            numberOfLines={2}
          >
            {item.body}
          </Text>

          {/* Meta info */}
          <View style={styles.metaRow}>
            <IconSymbol
              name="clock.fill"
              size={14}
              color={isDark ? '#6b7280' : '#9ca3af'}
            />
            <Text style={[styles.timeText, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
              {timeAgo}
            </Text>

            {item.episodeNumber && (
              <>
                <Text style={[styles.dot, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
                  •
                </Text>
                <Text style={[styles.episodeText, { color: isDark ? '#ef4444' : '#dc2626' }]}>
                  Tập {item.episodeNumber}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Chevron */}
        <IconSymbol
          name="chevron.right"
          size={20}
          color={isDark ? '#6b7280' : '#9ca3af'}
        />
      </Pressable>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol
        name="bell.slash.fill"
        size={64}
        color={isDark ? '#374151' : '#d1d5db'}
      />
      <Text style={[styles.emptyTitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
        Chưa có thông báo
      </Text>
      <Text style={[styles.emptyText, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
        Bạn sẽ nhận được thông báo khi có tập phim mới
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator color="#ef4444" />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#181b24' : '#f9fafb' }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 12, backgroundColor: isDark ? '#181b24' : '#ffffff' },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={isDark ? '#ffffff' : '#111827'} />
        </Pressable>

        <View style={styles.headerTitle}>
          <Text style={[styles.headerText, { color: isDark ? '#ffffff' : '#111827' }]}>
            Thông báo
          </Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
            </View>
          )}
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ef4444" />
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle.fill" size={48} color="#ef4444" />
          <Text style={[styles.errorText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Không thể tải thông báo
          </Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>Thử lại</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={refetch}
              tintColor="#ef4444"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}


