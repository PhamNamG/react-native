import { View, Text, ScrollView, Pressable, StatusBar, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAnimeEpisodeById } from '@/hooks';
import { IframeVideoPlayer } from '@/components/iframe/iframe-video-player';
import { EpisodesGrid } from '@/components/episodes-grid';
import React, { useState, useMemo, useEffect } from 'react';
import { VideoPlayerSkeleton } from '@/components/iframe/video-player-skeleton';
import { ThemedText } from '@/components/themed-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ServerOption {
  id: string;
  name: string;
  url: string;
  priority: number;
}

export default function MoviePlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError }: any = useAnimeEpisodeById(id);
  const colorScheme = useColorScheme();
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  // Reset server khi chuyển episode
  useEffect(() => {
    setSelectedServerId(null);
  }, [id]);

  // Extract data trước để tránh hook violation
  const episode = data?.data;
  const seriesData = episode?.category;
  const currentEpisodeSlug = episode?.slug || '';
  const episodeNumber = episode?.seri ? String(episode.seri) : '?';
  const allEpisodes = seriesData?.products || [];
  const isDark = colorScheme === 'dark';

  // Tạo danh sách servers có sẵn - PHẢI ở top level trước early returns
  const availableServers: ServerOption[] = useMemo(() => {
    if (!episode) return [];

    const servers: ServerOption[] = [];

    // Ưu tiên 1: voiceOverLink (Thuyết minh)
    if (episode.voiceOverLink) {
      servers.push({
        id: 'voiceOverLink',
        name: 'Thuyết Minh #1',
        url: episode.voiceOverLink,
        priority: 1,
      });
    }

    // Ưu tiên 2: voiceOverLink2
    if (episode.voiceOverLink2) {
      servers.push({
        id: 'voiceOverLink2',
        name: 'Thuyết Minh #2',
        url: episode.voiceOverLink2,
        priority: 2,
      });
    }

    // Ưu tiên 3: dailyMotionServer
    if (episode.dailyMotionServer) {
      servers.push({
        id: 'dailyMotionServer',
        name: 'Vietsub#1',
        url: episode.dailyMotionServer,
        priority: 3,
      });
    }

    // Ưu tiên 4: server2
    if (episode.server2) {
      servers.push({
        id: 'server2',
        name: 'Vietsub#2',
        url: episode.server2,
        priority: 4,
      });
    }

    // Ưu tiên 5: link
    if (episode.link) {
      servers.push({
        id: 'link',
        name: 'Vietsub#3',
        url: episode.link,
        priority: 5,
      });
    }

    return servers.sort((a, b) => a.priority - b.priority);
  }, [episode]);

  // Chọn server mặc định
  const defaultServer = availableServers[0];
  const currentServer = selectedServerId
    ? availableServers.find(s => s.id === selectedServerId) || defaultServer
    : defaultServer;

  const videoUrl = currentServer?.url || '';

  const handleBack = () => {
    router.back();
  };

  const handleServerChange = (serverId: string) => {
    setSelectedServerId(serverId);
  };

  // Early returns SAU khi tất cả hooks đã được gọi
  if (isLoading) {
    return <VideoPlayerSkeleton isDark={isDark} />;
  }

  if (isError || !data?.data) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: '#181b24' }]}>
        <Text style={styles.errorText}>Không tìm thấy tập phim</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#181b24' : '#f9fafb', paddingTop: insets.top }]} >

      {/* Video Player hoặc Error Message */}
      {videoUrl ? (
        <IframeVideoPlayer
          videoUrl={videoUrl}
          episodeNumber={episodeNumber}
          seriesName={seriesData?.name || 'Unknown'}
          seriesNameChinese={seriesData?.anotherName}
          onBack={handleBack}
        />
      ) : (
        <View style={styles.videoErrorContainer}>
          <IconSymbol name="exclamationmark.triangle.fill" size={40} color="#f59e0b" />
          <Text style={styles.videoErrorTitle}>Video chưa được cập nhật</Text>
          <Text style={styles.videoErrorText}>Vui lòng chọn tập khác hoặc quay lại sau</Text>
        </View>
      )}

      {/* Server Selector */}
      {availableServers.length > 1 && (
        <View style={[styles.serverContainer, { backgroundColor: isDark ? '#111827' : '#ffffff' }]}>
          <View style={styles.serverHeader}>
            <IconSymbol name="play.rectangle.fill" size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text style={[styles.serverTitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Chọn Server
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.serverList}
          >
            {availableServers.map((server) => {
              const isActive = currentServer?.id === server.id;
              return (
                <Pressable
                  key={server.id}
                  onPress={() => handleServerChange(server.id)}
                  style={[
                    styles.serverButton,
                    {
                      backgroundColor: isActive
                        ? '#dc2626'
                        : isDark ? '#1f2937' : '#f3f4f6',
                      borderColor: isActive
                        ? '#dc2626'
                        : isDark ? '#374151' : '#e5e7eb',
                    }
                  ]}
                >
                  <Text style={[
                    styles.serverButtonText,
                    { color: isActive ? '#ffffff' : isDark ? '#d1d5db' : '#374151' }
                  ]}>
                    {server.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Text className='text-sm text-yellow-700 px-3 mt-2'>Note: Nếu không xem được phim, vui lòng chọn server khác</Text>
        </View>
      )}

      {/* Movie Details */}
      <ScrollView
        style={[styles.scrollView, { backgroundColor: isDark ? '#181b24' : '#f9fafb' }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title & Episode Info */}
          <View style={styles.titleSection}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: isDark ? '#ffffff' : '#111827' }]}>
                {(seriesData?.name || 'Unknown') + ' - Tập ' + episodeNumber}
              </Text>
              {seriesData?.anotherName ? (
                <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
                  {seriesData.anotherName}
                </Text>
              ) : null}
              <Text style={[styles.episodeInfo, { color: isDark ? '#6b7280' : '#6b7280' }]}>
                Tập {episodeNumber}/{seriesData?.sumSeri || '?'}
              </Text>
            </View>

            {episode.view ? (
              <View style={styles.viewContainer}>
                <View style={styles.viewBadge}>
                  <IconSymbol name="eye.fill" size={16} color="#facc15" />
                  <Text style={styles.viewText}>
                    {String(episode.view)}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            {seriesData?.year ? (
              <View style={[styles.metaBadge, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}>
                <Text style={[styles.metaText, { color: isDark ? '#d1d5db' : '#374151' }]}>
                  {String(seriesData.year)}
                </Text>
              </View>
            ) : null}
            {seriesData?.time ? (
              <View style={[styles.metaBadge, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}>
                <Text style={[styles.metaText, { color: isDark ? '#d1d5db' : '#374151' }]}>
                  {String(seriesData.time)}
                </Text>
              </View>
            ) : null}
            {seriesData?.quality ? (
              <View style={styles.qualityBadge}>
                <Text style={styles.qualityText}>{String(seriesData.quality)}</Text>
              </View>
            ) : null}
            {seriesData?.lang ? (
              <View style={styles.langBadge}>
                <Text style={styles.langText}>{String(seriesData.lang)}</Text>
              </View>
            ) : null}
            {seriesData?.tags && Array.isArray(seriesData.tags) ?
              seriesData.tags.map((tag: any) =>
                tag?._id && tag?.name ? (
                  <View
                    key={tag._id}
                    style={styles.tagBadge}
                  >
                    <Text style={styles.tagText}>{String(tag.name)}</Text>
                  </View>
                ) : null
              ) : null
            }
          </View>

          {/* Description */}
          {seriesData?.des ? (
            <View style={styles.descriptionSection}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
                Nội dung
              </Text>
              <Text style={[styles.description, { color: isDark ? '#d1d5db' : '#374151' }]}>
                {seriesData.des}
              </Text>
            </View>
          ) : null}

          {/* Series Info */}
          <View style={styles.infoSection}>
            {seriesData?.sumSeri ? (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
                  Tổng số tập:
                </Text>
                <Text style={[styles.infoValue, { color: isDark ? '#ffffff' : '#111827' }]}>
                  {String(seriesData.sumSeri)} tập
                </Text>
              </View>
            ) : null}
            {seriesData?.status ? (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
                  Trạng thái:
                </Text>
                <Text style={[styles.infoValue, { color: isDark ? '#ffffff' : '#111827' }]}>
                  {String(seriesData.status) === 'pending' ? 'Đang cập nhật' : 'Hoàn thành'}
                </Text>
              </View>
            ) : null}
            {episode.uploadDate ? (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
                  Ngày đăng:
                </Text>
                <Text style={[styles.infoValue, { color: isDark ? '#ffffff' : '#111827' }]}>
                  {new Date(episode.uploadDate).toLocaleDateString('vi-VN')}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Episodes Grid */}
          <EpisodesGrid
            episodes={allEpisodes}
            currentSlug={currentEpisodeSlug}
            isDark={isDark}
            title="Danh sách tập"
            showCount={true}
            maxHeight={300}
            columns={6}
            onEpisodePress={(slug) => router.push({
              pathname: '/xem-phim/[id]',
              params: { id: slug }
            })}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  videoErrorContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  videoErrorTitle: {
    color: '#f59e0b',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  videoErrorText: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  episodeInfo: {
    fontSize: 14,
    marginTop: 4,
  },
  viewContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },
  viewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  viewText: {
    color: '#facc15',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  metaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  qualityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: '#dc2626',
  },
  qualityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  langBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: '#2563eb',
  },
  langText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#a855f7',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 128,
    fontSize: 14,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 32,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  serverContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  serverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serverTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  serverList: {
    paddingVertical: 4,
    gap: 8,
  },
  serverButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  serverButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});