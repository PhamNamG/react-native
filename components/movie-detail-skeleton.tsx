import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './skeleton';

interface MovieDetailSkeletonProps {
  isDark?: boolean;
}

export function MovieDetailSkeleton({ isDark = true }: MovieDetailSkeletonProps) {
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#181b24' : '#ffffff' }]}>
      {/* Backdrop Skeleton */}
      <View style={styles.backdropContainer}>
        <Skeleton width="100%" height={350} borderRadius={0} isDark={isDark} />
      </View>

      {/* Content - giống như thực tế: -mt-20 */}
      <View style={styles.content}>
        {/* Poster + Title Section */}
        <View style={styles.headerSection}>
          {/* Poster - nằm ở trên cùng */}
          <Skeleton width={110} height={165} borderRadius={12} isDark={isDark} />

          {/* Title & Meta - có pt-14 (56px) */}
          <View style={styles.titleSection}>
            {/* Title */}
            <Skeleton width="90%" height={28} borderRadius={6} isDark={isDark} style={{ marginBottom: 8 }} />
            {/* Subtitle (anotherName) */}
            <Skeleton width="70%" height={16} borderRadius={4} isDark={isDark} style={{ marginBottom: 8 }} />
            
            {/* Rating & Year - inline */}
            <View style={styles.metaRow}>
              <Skeleton width={60} height={20} borderRadius={4} isDark={isDark} />
              <Skeleton width={50} height={20} borderRadius={4} isDark={isDark} style={{ marginLeft: 16 }} />
            </View>

            {/* Badges - gap-2 (8px) */}
            <View style={styles.badgesRow}>
              <Skeleton width={50} height={28} borderRadius={6} isDark={isDark} />
              <Skeleton width={70} height={28} borderRadius={6} isDark={isDark} style={{ marginLeft: 8 }} />
              <Skeleton width={60} height={28} borderRadius={6} isDark={isDark} style={{ marginLeft: 8 }} />
            </View>
          </View>
        </View>

        {/* Action Buttons - gap-3 (12px), nút 1 flex-1, 2 nút còn lại 56x56 */}
        <View style={styles.buttonsSection}>
          <View style={{ flex: 1 }}>
            <Skeleton width="100%" height={48} borderRadius={12} isDark={isDark} />
          </View>
          <Skeleton width={56} height={56} borderRadius={12} isDark={isDark} style={{ marginLeft: 12 }} />
          <Skeleton width={56} height={56} borderRadius={12} isDark={isDark} style={{ marginLeft: 12 }} />
        </View>

        {/* Episodes Grid */}
        <View style={styles.episodesSection}>
          <Skeleton width={140} height={24} borderRadius={6} isDark={isDark} style={{ marginBottom: 12 }} />
          <View style={styles.episodesGrid}>
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} width={50} height={50} borderRadius={8} isDark={isDark} style={{ margin: 4 }} />
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Skeleton width={100} height={24} borderRadius={6} isDark={isDark} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={16} borderRadius={4} isDark={isDark} style={{ marginBottom: 8 }} />
          <Skeleton width="95%" height={16} borderRadius={4} isDark={isDark} style={{ marginBottom: 8 }} />
          <Skeleton width="90%" height={16} borderRadius={4} isDark={isDark} />
        </View>

        {/* Tags */}
        <View style={styles.tagsSection}>
          <Skeleton width={80} height={24} borderRadius={6} isDark={isDark} style={{ marginBottom: 12 }} />
          <View style={styles.tagsRow}>
            <Skeleton width={60} height={28} borderRadius={14} isDark={isDark} style={{ marginRight: 8 }} />
            <Skeleton width={80} height={28} borderRadius={14} isDark={isDark} style={{ marginRight: 8 }} />
            <Skeleton width={70} height={28} borderRadius={14} isDark={isDark} />
          </View>
        </View>

        {/* Info Grid */}
        <View style={[styles.infoSection, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6' }]}>
          <Skeleton width={150} height={24} borderRadius={6} isDark={isDark} style={{ marginBottom: 12 }} />
          <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' }}>
            {[...Array(5)].map((_, i) => (
              <View key={i} style={[styles.infoRow, { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' }]}>
                <Skeleton width={80} height={16} borderRadius={4} isDark={isDark} />
                <Skeleton width={100} height={16} borderRadius={4} isDark={isDark} />
              </View>
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
  backdropContainer: {
    height: 350,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 48,
    marginTop: -80, // Tương đương -mt-20 (20 * 4 = 80)
  },
  headerSection: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  titleSection: {
    flex: 1,
    marginLeft: 16,
    paddingTop: 56, // Tương đương pt-14 (14 * 4 = 56)
    justifyContent: 'flex-start',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  buttonsSection: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  episodesSection: {
    marginBottom: 24,
  },
  episodesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  tagsSection: {
    marginBottom: 24,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
});

