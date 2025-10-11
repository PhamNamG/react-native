import { View, Text, ScrollView, Pressable, StatusBar, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAnimeEpisodeById } from '@/hooks';
import { IframeVideoPlayer } from '@/components/iframe-video-player';
import { EpisodeNavigation } from '@/components/episode-navigation';
import { EpisodesGrid } from '@/components/episodes-grid';
import React from 'react';
import Loading from '@/components/loading';

export default function MoviePlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError }: any = useAnimeEpisodeById(id);
  const colorScheme = useColorScheme();

  if (isLoading) {
    return <Loading />
  }

  if (isError || !data?.data) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: '#030712' }]}>
        <Text style={styles.errorText}>Không tìm thấy tập phim</Text>
      </View>
    );
  }

  const episode = data.data;
  const seriesData = episode.category;
  const currentEpisodeSlug = episode.slug;
  const episodeNumber = episode.seri;
  const videoUrl = episode.dailyMotionServer;
  const nextEpisode = episode.nextEpisode;
  const prevEpisode = episode.prevEpisode;
  const allEpisodes = seriesData?.products || [];
  const isDark = colorScheme === 'dark';

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#030712' : '#f9fafb' }]}>
      <StatusBar hidden />

      <IframeVideoPlayer
        videoUrl={videoUrl}
        episodeNumber={episodeNumber}
        seriesName={seriesData?.name}
        seriesNameChinese={seriesData?.anotherName}
        onBack={handleBack}
      />

      {/* Episode Navigation */}
      {/* <EpisodeNavigation
        prevEpisode={prevEpisode}
        nextEpisode={nextEpisode}
        isDark={isDark}
      /> */}

      {/* Movie Details */}
      <ScrollView
        style={[styles.scrollView, { backgroundColor: isDark ? '#030712' : '#f9fafb' }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title & Episode Info */}
          <View style={styles.titleSection}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: isDark ? '#ffffff' : '#111827' }]}>
                {seriesData?.name + ' - Tập ' + episodeNumber}
              </Text>
              {seriesData?.anotherName && (
                <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
                  {seriesData.anotherName}
                </Text>
              )}
              <Text style={[styles.episodeInfo, { color: isDark ? '#6b7280' : '#6b7280' }]}>
                Tập {episodeNumber}/{seriesData?.sumSeri || '?'}
              </Text>
            </View>

            {episode.view && (
              <View style={styles.viewContainer}>
                <View style={styles.viewBadge}>
                  <IconSymbol name="eye.fill" size={16} color="#facc15" />
                  <Text style={styles.viewText}>
                    {episode.view}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            {seriesData?.year && (
              <View style={[styles.metaBadge, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}>
                <Text style={[styles.metaText, { color: isDark ? '#d1d5db' : '#374151' }]}>
                  {seriesData.year}
                </Text>
              </View>
            )}
            {seriesData?.time && (
              <View style={[styles.metaBadge, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}>
                <Text style={[styles.metaText, { color: isDark ? '#d1d5db' : '#374151' }]}>
                  {seriesData.time}
                </Text>
              </View>
            )}
            {seriesData?.quality && (
              <View style={styles.qualityBadge}>
                <Text style={styles.qualityText}>{seriesData.quality}</Text>
              </View>
            )}
            {seriesData?.lang && (
              <View style={styles.langBadge}>
                <Text style={styles.langText}>{seriesData.lang}</Text>
              </View>
            )}
            {seriesData?.tags?.map((tag: any) => (
              <View
                key={tag._id}
                style={styles.tagBadge}
              >
                <Text style={styles.tagText}>{tag.name}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          {seriesData?.des && (
            <View style={styles.descriptionSection}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
                Nội dung
              </Text>
              <Text style={[styles.description, { color: isDark ? '#d1d5db' : '#374151' }]}>
                {seriesData.des}
              </Text>
            </View>
          )}

          {/* Series Info */}
          <View style={styles.infoSection}>
            {seriesData?.sumSeri && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
                  Tổng số tập:
                </Text>
                <Text style={[styles.infoValue, { color: isDark ? '#ffffff' : '#111827' }]}>
                  {seriesData.sumSeri} tập
                </Text>
              </View>
            )}
            {seriesData?.status && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
                  Trạng thái:
                </Text>
                <Text style={[styles.infoValue, { color: isDark ? '#ffffff' : '#111827' }]}>
                  {seriesData.status === 'pending' ? 'Đang cập nhật' : 'Hoàn thành'}
                </Text>
              </View>
            )}
            {episode.uploadDate && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
                  Ngày đăng:
                </Text>
                <Text style={[styles.infoValue, { color: isDark ? '#ffffff' : '#111827' }]}>
                  {new Date(episode.uploadDate).toLocaleDateString('vi-VN')}
                </Text>
              </View>
            )}
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
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
  },
});