import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import React from 'react';

interface EpisodeNavigationProps {
  prevEpisode?: string | null;
  nextEpisode?: string | null;
  isDark: boolean;
}

export const EpisodeNavigation: React.FC<EpisodeNavigationProps> = ({
  prevEpisode,
  nextEpisode,
  isDark,
}) => {
  if (!prevEpisode && !nextEpisode) return null;

  const handlePrevEpisode = () => {
    if (prevEpisode) {
      router.push({
        pathname: '/xem-phim/[id]',
        params: { id: prevEpisode }
      });
    }
  };

  const handleNextEpisode = () => {
    if (nextEpisode) {
      router.push({
        pathname: '/xem-phim/[id]',
        params: { id: nextEpisode }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePrevEpisode}
        disabled={!prevEpisode}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: prevEpisode ? '#374151' : '#1f2937',
            opacity: !prevEpisode ? 0.5 : pressed ? 0.8 : 1,
          }
        ]}
      >
        <Text style={styles.buttonText}>← Tập trước</Text>
      </Pressable>
      
      <Pressable
        onPress={handleNextEpisode}
        disabled={!nextEpisode}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: nextEpisode ? '#dc2626' : '#1f2937',
            opacity: !nextEpisode ? 0.5 : pressed ? 0.8 : 1,
          }
        ]}
      >
        <Text style={styles.buttonText}>Tập tiếp →</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});