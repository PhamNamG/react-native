import { View, Text, ScrollView, Pressable } from 'react-native';
import React from 'react';

interface Episode {
  slug?: string;
  _id?: string;
  seri: string;
}

interface EpisodesGridProps {
  episodes: Episode[];
  currentSlug?: string;
  isDark: boolean;
  title?: string;
  showCount?: boolean;
  maxHeight?: number;
  onEpisodePress: (slug: string) => void;
  columns?: 5 | 6;
}

export const EpisodesGrid: React.FC<EpisodesGridProps> = ({
  episodes,
  currentSlug,
  isDark,
  title = 'Danh sách tập',
  showCount = true,
  maxHeight = 280,
  onEpisodePress,
  columns = 6,
}) => {
  if (!episodes || episodes.length === 0) return null;

  const columnWidth = columns === 5 ? 'w-[20%]' : 'w-[16.66%]';

  return (
    <View className="mb-6">
      {/* Header */}
      {title && (
        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </Text>
          {showCount && (
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {episodes.length} tập
            </Text>
          )}
        </View>
      )}

      {/* Episodes Grid */}
      <ScrollView
        style={{ maxHeight }}
        className={`rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}
        contentContainerStyle={{ padding: 8 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View className="flex-row flex-wrap -mx-1">
          {episodes
            .sort((a, b) => {
              const seriA = Number(a.seri) || 0;
              const seriB = Number(b.seri) || 0;
              return seriB - seriA;
            })
            .map((episode, index) => {
              const episodeSlug = episode.slug || episode._id || '';
              const isActive = currentSlug ? episodeSlug === currentSlug : false;
              const uniqueKey = `${episode._id || episode.slug || 'ep'}-${index}`;

              return (
                <View
                  key={uniqueKey}
                  className={`px-1 mb-2 ${columnWidth}`}
                >
                  <Pressable
                    onPress={() => onEpisodePress(episodeSlug)}
                    className={`aspect-square items-center justify-center rounded-xl border-[0.5px] active:opacity-80 ${isActive
                        ? 'bg-red-600 border-red-600'
                        : isDark
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-gray-300'
                      }`}
                  >
                    <Text
                      className={`text-base font-extrabold ${isActive
                          ? 'text-white'
                          : isDark
                            ? 'text-white'
                            : 'text-gray-900'
                        }`}
                    >
                      {episode.seri ? String(episode.seri) : '?'}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};