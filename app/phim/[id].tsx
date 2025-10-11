import { View, Text, ScrollView, Pressable, StatusBar, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAnimeById } from '@/hooks/api';
import { Ionicons } from '@expo/vector-icons';
import { EpisodesGrid } from '@/components/episodes-grid';
import React from 'react';
import Loading from '@/components/loading';

export default function AnimeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError }: any = useAnimeById(id);
  const anime = data?.data;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const averageRating = anime?.rating?.length > 0
    ? anime.rating.reduce((acc: number, r: number) => acc + (r || 0), 0) / anime.rating.length
    : 0;

  const imgPoster = anime?.posters?.find((item: any) => item.coverPoster === 'cover');
  const backdropImage = imgPoster?.imageUrl || anime?.linkImg;

  if (isLoading) {
    return <Loading />
  }

  if (isError || !anime) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#030712' : '#ffffff' }]}>
        <Text style={[styles.errorText, { color: isDark ? '#fff' : '#000' }]}>
          ⚠️ Không tìm thấy phim!
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.errorButton,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.errorButtonText}>Quay lại</Text>
        </Pressable>
      </View>
    );
  }

  const handleEpisodePress = (episodeSlug: string) => {
    router.push({
      pathname: '/xem-phim/[id]',
      params: {
        id: episodeSlug
      },
    });
  };
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#030712' : '#ffffff' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Backdrop Section */}
      <View style={styles.backdropContainer}>
        <Image
          source={{ uri: backdropImage }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', isDark ? '#030712' : '#ffffff']}
          locations={[0.6, 1]}
          style={StyleSheet.absoluteFillObject}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.headerButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.headerButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Ionicons name="bookmark-outline" size={20} color="#fff" />
            </Pressable>
          </View>
        </LinearGradient>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Movie Header */}
          <View style={styles.movieHeader}>
            <View style={styles.posterSection}>
              {/* Poster */}
              <Image
                source={{ uri: anime.linkImg }}
                style={styles.poster}
                contentFit="cover"
              />

              {/* Title & Meta */}
              <View style={styles.titleSection}>
                <Text
                  style={[styles.title, { color: isDark ? '#fff' : '#000' }]}
                  numberOfLines={3}
                >
                  {anime.name}
                </Text>
                {anime.anotherName && (
                  <Text 
                    style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]} 
                    numberOfLines={1}
                  >
                    {anime.anotherName}
                  </Text>
                )}

                {/* Rating & Year */}
                <View style={styles.metaRow}>
                  {averageRating > 0 && (
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>
                        {averageRating.toFixed(1)}
                      </Text>
                    </View>
                  )}
                  {anime.year && (
                    <Text style={[styles.yearText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                      {anime.year}
                    </Text>
                  )}
                </View>

                {/* Badges */}
                <View style={styles.badgesContainer}>
                  {anime.quality && (
                    <View style={styles.qualityBadge}>
                      <Text style={styles.badgeText}>{anime.quality}</Text>
                    </View>
                  )}
                  {anime.lang && (
                    <View style={styles.langBadge}>
                      <Text style={styles.badgeText}>
                        {anime.lang === "Vietsub" ? "Vietsub" : 
                         anime.lang === "ThuyetMinh" ? "Thuyết Minh" : 
                         anime.lang === "ThuyetMinh-Vietsub" ? "TM & Vietsub" : anime.lang}
                      </Text>
                    </View>
                  )}
                  {anime.sumSeri && (
                    <View style={[styles.episodesBadge, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6' }]}>
                      <Text style={[styles.episodesText, { color: isDark ? '#fff' : '#000' }]}>
                        {anime.sumSeri} tập
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable
              onPress={() => handleEpisodePress(anime.products?.[0]?.slug || '')}
              style={({ pressed }) => [
                styles.playButton,
                { opacity: pressed ? 0.9 : 1 }
              ]}
            >
              <Ionicons name="play" size={20} color="#fff" />
              <Text style={styles.playButtonText}>Xem ngay</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: isDark ? '#1f2937' : '#f3f4f6', opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Ionicons name="bookmark-outline" size={24} color={isDark ? '#fff' : '#000'} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: isDark ? '#1f2937' : '#f3f4f6', opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Ionicons name="share-social-outline" size={24} color={isDark ? '#fff' : '#000'} />
            </Pressable>
          </View>

          {/* Episodes Grid */}
          {anime.products?.length > 0 && (
            <View style={styles.episodesSection}>
              <EpisodesGrid
                episodes={anime.products || []}
                isDark={isDark}
                title="Danh sách tập"
                showCount={true}
                maxHeight={280}
                columns={6}
                onEpisodePress={handleEpisodePress}
              />
            </View>
          )}

          {/* Description */}
          {anime.des && (
            <View style={styles.descriptionSection}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
                Nội dung
              </Text>
              <Text style={[styles.description, { color: isDark ? '#d1d5db' : '#374151' }]}>
                {anime.des}
              </Text>
            </View>
          )}

          {/* Tags */}
          {anime.tags?.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
                Thể loại
              </Text>
              <View style={styles.tagsContainer}>
                {anime.tags.map((tag: any) => (
                  <View
                    key={tag._id}
                    style={[styles.tag, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6' }]}
                  >
                    <Text style={[styles.tagText, { color: isDark ? '#d1d5db' : '#374151' }]}>
                      {tag.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Info Grid */}
          <View style={[styles.infoSection, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6' }]}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
              Thông tin chi tiết
            </Text>
            <View style={styles.infoGrid}>
              {anime.sumSeri && (
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                    Tổng tập
                  </Text>
                  <Text style={[styles.infoValue, { color: isDark ? '#fff' : '#000' }]}>
                    {anime.sumSeri} tập
                  </Text>
                </View>
              )}
              {anime.country && (
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                    Quốc gia
                  </Text>
                  <Text style={[styles.infoValue, { color: isDark ? '#fff' : '#000' }]}>
                    {anime.country}
                  </Text>
                </View>
              )}
              {anime.time && (
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                    Thời lượng
                  </Text>
                  <Text style={[styles.infoValue, { color: isDark ? '#fff' : '#000' }]}>
                    {anime.time}
                  </Text>
                </View>
              )}
              {anime.hour && (
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                    Tổng thời gian
                  </Text>
                  <Text style={[styles.infoValue, { color: isDark ? '#fff' : '#000' }]}>
                    {anime.hour}
                  </Text>
                </View>
              )}
              {anime.week && (
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
                    Lịch chiếu
                  </Text>
                  <Text style={[styles.infoValue, { color: isDark ? '#fff' : '#000' }]}>
                    {Array.isArray(anime.week) ? anime.week.map((w: any) => w.name).filter(Boolean).join(', ') : anime.week}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdropContainer: {
    height: 350,
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  scrollView: {
    flex: 1,
    marginTop: -80,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  movieHeader: {
    marginBottom: 24,
  },
  posterSection: {
    flexDirection: 'row',
  },
  poster: {
    width: 110,
    height: 165,
    borderRadius: 12,
  },
  titleSection: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-start',
    paddingTop: 56,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  yearText: {
    fontSize: 16,
    fontWeight: '500',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  qualityBadge: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  langBadge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  episodesBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  episodesText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 12,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  actionButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  episodesSection: {
    marginBottom: 24,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  tagsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  infoGrid: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  infoLabel: {
    fontSize: 16,
    width: '33.333333%',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  errorButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#dc2626',
  },
  errorButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});