import { styles } from './style';
import { View, Text, ScrollView, Animated } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAnimeEpisodeById } from '@/hooks';
import { IframeVideoPlayer } from '@/components/iframe/iframe-video-player';
import { EpisodesGrid } from '@/components/episodes-grid';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { VideoPlayerSkeleton } from '@/components/iframe/video-player-skeleton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButtons } from '@/components/xem-phim/action-buttons';
import { ServerSelector } from '@/components/xem-phim/server-selector';
import { MovieHeader } from '@/components/xem-phim/movie-header';
import { MovieDescription } from '@/components/xem-phim/movie-description';
import { MovieInfo } from '@/components/xem-phim/movie-info';

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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const insets = useSafeAreaInsets();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Rotating animation for "Đang chiếu" icon
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Reset server và description khi chuyển episode
  useEffect(() => {
    setSelectedServerId(null);
    setIsDescriptionExpanded(false);
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

      {/* Action Buttons */}
      <ActionButtons
        isDark={isDark}
        prevEpisode={episode?.prevEpisode}
        nextEpisode={episode?.nextEpisode}
        isFavorite={isFavorite}
        autoNext={autoNext}
        onFavoriteToggle={() => setIsFavorite(!isFavorite)}
        onAutoNextToggle={() => setAutoNext(!autoNext)}
        onReport={() => console.log('Report episode')}
        onShare={() => console.log('Share episode')}
        onAddToList={() => console.log('Add to playlist')}
      />

      {/* Server Selector */}
      <ServerSelector
        isDark={isDark}
        servers={availableServers}
        currentServerId={currentServer?.id || null}
        onServerChange={handleServerChange}
      />

      {/* Movie Details */}
      <ScrollView
        style={[styles.scrollView, { backgroundColor: isDark ? '#181b24' : '#f9fafb' }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Movie Header */}
        <MovieHeader
          isDark={isDark}
          posterUrl={seriesData?.linkImg}
          title={seriesData?.name || 'Unknown'}
          subtitle={seriesData?.anotherName}
          currentEpisode={episodeNumber}
          totalEpisodes={seriesData?.sumSeri || '?'}
          latestEpisode={allEpisodes[0]?.seri}
          viewCount={episode?.view}
          year={seriesData?.year}
          time={seriesData?.time}
          quality={seriesData?.quality}
          lang={seriesData?.lang}
          tags={seriesData?.tags}
          spin={spin}
        />

        {/* Description */}
        <View className="px-4 py-5">
          <MovieDescription
            isDark={isDark}
            description={seriesData?.des || ''}
            isExpanded={isDescriptionExpanded}
            onToggle={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          />
        </View>

        {/* Series Info */}
        <View className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <MovieInfo
            isDark={isDark}
            totalEpisodes={seriesData?.sumSeri}
            status={seriesData?.status}
            uploadDate={episode?.uploadDate}
          />
        </View>

        {/* Episodes Grid */}
        <View className="px-4 py-5">
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
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}

