import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './skeleton';

interface VideoPlayerSkeletonProps {
  isDark?: boolean;
}

export function VideoPlayerSkeleton({ isDark = true }: VideoPlayerSkeletonProps) {
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#030712' : '#f9fafb' }]}>
      {/* Video Player Skeleton */}
      <View style={styles.videoContainer}>
        <Skeleton width="100%" height="100%" borderRadius={0} isDark={isDark} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.titleContainer}>
            <Skeleton width="85%" height={28} borderRadius={6} isDark={isDark} style={{ marginBottom: 8 }} />
            <Skeleton width="65%" height={18} borderRadius={4} isDark={isDark} style={{ marginBottom: 8 }} />
            <Skeleton width={120} height={16} borderRadius={4} isDark={isDark} />
          </View>
          <View style={styles.viewContainer}>
            <Skeleton width={80} height={32} borderRadius={16} isDark={isDark} />
          </View>
        </View>

        {/* Meta Badges */}
        <View style={styles.metaContainer}>
          <Skeleton width={60} height={28} borderRadius={14} isDark={isDark} style={{ marginRight: 8 }} />
          <Skeleton width={80} height={28} borderRadius={14} isDark={isDark} style={{ marginRight: 8 }} />
          <Skeleton width={50} height={28} borderRadius={14} isDark={isDark} style={{ marginRight: 8 }} />
          <Skeleton width={70} height={28} borderRadius={14} isDark={isDark} />
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Skeleton width={100} height={22} borderRadius={6} isDark={isDark} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={16} borderRadius={4} isDark={isDark} style={{ marginBottom: 8 }} />
          <Skeleton width="95%" height={16} borderRadius={4} isDark={isDark} style={{ marginBottom: 8 }} />
          <Skeleton width="88%" height={16} borderRadius={4} isDark={isDark} />
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          {[...Array(3)].map((_, i) => (
            <View key={i} style={styles.infoRow}>
              <Skeleton width={100} height={16} borderRadius={4} isDark={isDark} />
              <Skeleton width={150} height={16} borderRadius={4} isDark={isDark} />
            </View>
          ))}
        </View>

        {/* Episodes Grid */}
        <View style={styles.episodesSection}>
          <Skeleton width={120} height={22} borderRadius={6} isDark={isDark} style={{ marginBottom: 12 }} />
          <View style={styles.episodesGrid}>
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} width={48} height={48} borderRadius={8} isDark={isDark} style={{ margin: 4 }} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  viewContainer: {
    marginLeft: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  episodesSection: {
    marginBottom: 24,
  },
  episodesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

