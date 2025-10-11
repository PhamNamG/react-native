import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
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

  const columnWidth = columns === 5 ? '20%' : '16.66%';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#111827' }]}>
          {title}
        </Text>
        {showCount && (
          <Text style={[styles.count, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
            {episodes.length} tập
          </Text>
        )}
      </View>

      {/* Episodes Grid */}
      <ScrollView
        style={[styles.scrollView, { maxHeight, backgroundColor: isDark ? '#1f2937' : '#f3f4f6' }]}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={styles.grid}>
          {episodes
            .sort((a, b) => parseInt(a.seri) - parseInt(b.seri))
            .map((episode) => {
              const episodeSlug = episode.slug || episode._id || '';
              const isActive = currentSlug ? episodeSlug === currentSlug : false;

              return (
                <View
                  key={episodeSlug}
                  style={[styles.episodeContainer, { width: columnWidth }]}
                >
                  <Pressable
                    onPress={() => onEpisodePress(episodeSlug)}
                    style={({ pressed }) => [
                      styles.episodeButton,
                      {
                        backgroundColor: isActive 
                          ? '#dc2626' 
                          : isDark 
                            ? '#1f2937' 
                            : '#ffffff',
                        borderColor: isActive 
                          ? '#dc2626' 
                          : isDark 
                            ? '#374151' 
                            : '#d1d5db',
                        opacity: pressed ? 0.8 : 1,
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.episodeText,
                        { 
                          color: isActive 
                            ? '#ffffff' 
                            : isDark 
                              ? '#ffffff' 
                              : '#111827' 
                        }
                      ]}
                    >
                      {episode.seri}
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 14,
  },
  scrollView: {
    borderRadius: 12,
    padding: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  episodeContainer: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  episodeButton: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 0.5,
  },
  episodeText: {
    fontSize: 16,
    fontWeight: '800',
  },
});