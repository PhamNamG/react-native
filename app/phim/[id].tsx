import { View, Text, ScrollView, Pressable, StatusBar, StyleSheet, RefreshControl } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAnimeById } from '@/hooks/api';
import { Ionicons } from '@expo/vector-icons';
import { EpisodesGrid } from '@/components/episodes-grid';
import React, { useCallback, useState } from 'react';
import { MovieDetailSkeleton } from '@/components/movie-detail-skeleton';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { useQueryClient } from '@tanstack/react-query';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AnimeDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data, isLoading, isError }: any = useAnimeById(id);
  const [refreshing, setRefreshing] = useState(false);
  const anime = data?.data;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const averageRating = anime?.rating?.length > 0
    ? anime.rating.reduce((acc: number, r: number) => acc + (r || 0), 0) / anime.rating.length
    : 0;

  const imgPoster = anime?.posters?.find((item: any) => item.coverPoster === 'cover');
  const backdropImage = imgPoster?.imageUrl || anime?.linkImg;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Invalidate và refetch tất cả queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['animeById', id] })
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);


  if (isLoading) {
    return <MovieDetailSkeleton isDark={isDark} />
  }

  if (isError || !anime) {
    return (
      <View className={`flex-1 justify-center items-center px-4`} style={{ backgroundColor: isDark ? '#181b24' : '#fff' }}>
        <Text className={`text-xl mb-6 text-center ${isDark ? 'text-white' : 'text-black'}`}>
          ⚠️ Không tìm thấy phim!
        </Text>
        <Pressable
          className="bg-red-600 px-8 py-3 rounded-xl active:opacity-80"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold text-base">Quay lại</Text>
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
    <View className="flex-1" style={{ backgroundColor: isDark ? '#181b24' : '#fff', paddingTop: insets.top }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="h-[350px] relative">
        <Image
          source={{ uri: backdropImage }}
          style={styles.blurredImage}
        />

        {/* 2. LỚP BLUR */}
        <BlurView
          intensity={60}
          tint={isDark ? 'dark' : 'light'}
          style={styles.blurContainer}
        />

        <LinearGradient
          colors={['rgba(0,0,0,0.1)', isDark ? '#181b24' : '#ffffff']}
          locations={[0.6, 1]}
          style={styles.blurContainer}
        >
        </LinearGradient>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 -mt-20"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint}
            colors={[colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint]}
            progressBackgroundColor={colorScheme === 'dark' ? '#1f2937' : '#f3f4f6'}
          />
        }>
        <View className="px-4 pb-12">
          {/* Movie Header */}
          <View className="mb-6">
            <View className="flex-row">
              {/* Poster */}
              <Image
                source={{ uri: anime.linkImg }}
                style={styles.poster}
              />

              {/* Title & Meta */}
              <View className="flex-1 ml-4 justify-start pt-14">
                <Text
                  className={`text-2xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-black'}`}
                  numberOfLines={3}
                >
                  {anime.name}
                </Text>
                {anime.anotherName && (
                  <Text
                    className={`text-sm mb-2 italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                    numberOfLines={1}
                  >
                    {anime.anotherName}
                  </Text>
                )}

                {/* Rating & Year */}
                <View className="flex-row items-center flex-wrap mb-3">
                  {averageRating > 0 && (
                    <View className="flex-row items-center ml-4">
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text className="text-[#FFD700] text-base font-bold ml-1">
                        {averageRating.toFixed(1)}
                      </Text>
                    </View>
                  )}
                  {anime.year && (
                    <Text className={`text-base font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {anime.year}
                    </Text>
                  )}
                </View>

                {/* Badges */}
                <View className="flex-row gap-2 flex-wrap">
                  {anime.quality && (
                    <View className="bg-red-600 px-2.5 py-1 rounded-md">
                      <Text className="text-white text-xs font-bold">{anime.quality}</Text>
                    </View>
                  )}
                  {anime.lang && (
                    <View className="bg-blue-600 px-2.5 py-1 rounded-md">
                      <Text className="text-white text-xs font-bold">
                        {anime.lang === "Vietsub" ? "Vietsub" :
                          anime.lang === "ThuyetMinh" ? "Thuyết Minh" :
                            anime.lang === "ThuyetMinh-Vietsub" ? "TM & Vietsub" : anime.lang}
                      </Text>
                    </View>
                  )}
                  {anime.sumSeri && (
                    <View className={`px-2.5 py-1 rounded-md ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <Text className={`text-xs font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                        {anime.sumSeri} tập
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mb-6">
            <Pressable
              onPress={() => handleEpisodePress(anime.products?.[0]?.slug || '')}
              className="flex-1 flex-row items-center justify-center bg-red-600 py-3 rounded-xl active:opacity-90"
            >
              <Ionicons name="play" size={20} color="#fff" />
              <Text className="text-white text-base font-bold ml-2">Xem ngay</Text>
            </Pressable>

            <Pressable
              className={`w-14 h-14 items-center justify-center rounded-xl active:opacity-70 ${isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}
            >
              <Ionicons name="bookmark-outline" size={24} color={isDark ? '#fff' : '#000'} />
            </Pressable>

            <Pressable
              className={`w-14 h-14 items-center justify-center rounded-xl active:opacity-70 ${isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}
            >
              <Ionicons name="share-social-outline" size={24} color={isDark ? '#fff' : '#000'} />
            </Pressable>
          </View>

          {/* Episodes Grid */}
          {anime.products?.length > 0 && (
            <View className="mb-6">
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
            <View className="mb-6">
              <Text className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
                Nội dung
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {anime.des}
              </Text>
            </View>
          )}

          {/* Tags */}
          {anime.tags?.length > 0 && (
            <View className="mb-6">
              <Text className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
                Thể loại
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {anime.tags.map((tag: any) => (
                  <View
                    key={tag._id}
                    className={`px-3 py-1 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
                  >
                    <Text className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tag.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Info Grid */}
          <View className={`mb-6 px-4 py-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <Text className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
              Thông tin chi tiết
            </Text>
            <View className="border-t border-black/10">
              {anime.sumSeri && (
                <View className="flex-row justify-between items-start py-2 border-b border-black/10">
                  <Text className={`text-base w-1/3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tổng tập
                  </Text>
                  <Text className={`text-base font-semibold text-right flex-1 ${isDark ? 'text-white' : 'text-black'}`}>
                    {anime.sumSeri} tập
                  </Text>
                </View>
              )}
              {anime.country && (
                <View className="flex-row justify-between items-start py-2 border-b border-black/10">
                  <Text className={`text-base w-1/3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Quốc gia
                  </Text>
                  <Text className={`text-base font-semibold text-right flex-1 ${isDark ? 'text-white' : 'text-black'}`}>
                    {anime.country}
                  </Text>
                </View>
              )}
              {anime.time && (
                <View className="flex-row justify-between items-start py-2 border-b border-black/10">
                  <Text className={`text-base w-1/3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Thời lượng
                  </Text>
                  <Text className={`text-base font-semibold text-right flex-1 ${isDark ? 'text-white' : 'text-black'}`}>
                    {anime.time}
                  </Text>
                </View>
              )}
              {anime.hour && (
                <View className="flex-row justify-between items-start py-2 border-b border-black/10">
                  <Text className={`text-base w-1/3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tổng thời gian
                  </Text>
                  <Text className={`text-base font-semibold text-right flex-1 ${isDark ? 'text-white' : 'text-black'}`}>
                    {anime.hour}
                  </Text>
                </View>
              )}
              {anime.week && (
                <View className="flex-row justify-between items-start py-2 border-b border-black/10">
                  <Text className={`text-base w-1/3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Lịch chiếu
                  </Text>
                  <Text className={`text-base font-semibold text-right flex-1 ${isDark ? 'text-white' : 'text-black'}`}>
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
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  blurredImage: {
    width: '100%',
    height: '100%',
  },
  poster: {
    width: 110,
    height: 165,
    borderRadius: 12,
  },
});