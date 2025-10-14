import { Image } from 'expo-image';
import { StyleSheet, Pressable, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Anime } from '@/lib/api/services/movies';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface AnimeCardProps {
  anime: Anime;
  onPress?: () => void;
  width?: number | string;
}

export function AnimeCard({ anime, onPress, width = '100%' }: AnimeCardProps) {

  const averageRating = anime.rating?.length > 0
    ? anime.rating.reduce((acc, r) => acc + (r || 0), 0) / anime.rating.length
    : 0;

  // Calculate aspect ratio dynamically
  const posterAspectRatio = 2 / 3; // Standard poster ratio (width:height)

  const containerStyle = typeof width === 'number' 
    ? { width } 
    : width === '100%' 
    ? { width: '100%' as const }
    : undefined;

  return (
    <Pressable
      style={[styles.container, containerStyle]}
      onPress={onPress}
      android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
    >
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: anime.linkImg }}
          style={[
            styles.poster,
            { 
              width: '100%',
              aspectRatio: posterAspectRatio,
            }
          ]}
          contentFit="cover"
          transition={300}
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />
        
        {/* Badges overlay */}
        {anime.newMovie === true && (
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>NEW</ThemedText>
          </View>
        )}
        
        {anime.quality && (
          <View style={styles.qualityBadge}>
            <ThemedText style={styles.badgeText}>{anime.quality}</ThemedText>
          </View>
        )}
        
        {anime.sumSeri && (
          <View style={styles.episodeBadge}>
            <ThemedText style={styles.episodeText}>EP {anime.sumSeri}</ThemedText>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <ThemedText style={styles.title} numberOfLines={2}>
          {anime.name}
        </ThemedText>
        
        <ThemedText style={styles.titleChinese} numberOfLines={1}>
          {anime.anotherName ? anime.anotherName : anime.time + '/tập'}
        </ThemedText>

        <View style={styles.meta}>
          {averageRating > 0 && (
            <View style={styles.rating}>
              <IconSymbol name="star.fill" size={12} color="#FFD700" />
              <ThemedText style={styles.ratingText}>{averageRating.toFixed(1)}</ThemedText>
            </View>
          )}
          {anime.year && (
            <ThemedText style={styles.year}>{anime.year}</ThemedText>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    flexShrink: 1,
  },
  posterContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  poster: {
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  qualityBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#2ecc71',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  episodeBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  episodeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  info: {
    marginTop: 8,
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    lineHeight: 18,
  },
  titleChinese: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
    lineHeight: 16,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
  },
  year: {
    fontSize: 11,
    opacity: 0.6,
    fontWeight: '500',
  },
});
