import React from 'react';
import { View, Text, Animated } from 'react-native';
import { Image } from 'expo-image';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LoaderCircle } from 'lucide-react-native';
import { styles } from '@/app/xem-phim/style';

interface MovieHeaderProps {
  isDark: boolean;
  posterUrl?: string;
  title: string;
  subtitle?: string;
  currentEpisode: string;
  totalEpisodes: string;
  latestEpisode?: string;
  viewCount?: number;
  year?: string;
  time?: string;
  quality?: string;
  lang?: string;
  tags?: Array<{ _id: string; name: string }>;
  spin: Animated.AnimatedInterpolation<string | number>;
}

export function MovieHeader({
  isDark,
  posterUrl,
  title,
  subtitle,
  currentEpisode,
  totalEpisodes,
  latestEpisode,
  viewCount,
  year,
  time,
  quality,
  lang,
  tags,
  spin,
}: MovieHeaderProps) {
  const formatLang = (langValue: string) => {
    if (langValue === "Vietsub") return "Vietsub";
    if (langValue === "ThuyetMinh") return "Thuyết Minh";
    if (langValue === "ThuyetMinh-Vietsub") return "TM & Vietsub";
    return langValue;
  };

  return (
    <View className={`px-4 py-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <View style={styles.headerRow}>
        {/* Thumbnail */}
        {posterUrl && (
          <View style={styles.thumbnailContainer}>
            <Image
              source={{ uri: posterUrl }}
              style={styles.thumbnailImage}
              contentFit="cover"
              transition={200}
            />
          </View>
        )}

        {/* Info Column */}
        <View style={styles.infoColumn}>
          {/* Title & Episode Info */}
          <View style={styles.titleSection}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: isDark ? '#ffffff' : '#111827' }]}>
                {title}
              </Text>
              {subtitle && (
                <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
                  {subtitle}
                </Text>
              )}
              <Text style={[styles.episodeInfo, { color: isDark ? '#6b7280' : '#6b7280' }]}>
                Tập {currentEpisode}/{totalEpisodes}
              </Text>

              {/* Đang chiếu */}
              {latestEpisode && totalEpisodes && (
                <View className="flex-row items-center gap-1 mt-1.5">
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <LoaderCircle size={12} color="#f59e0b" />
                  </Animated.View>
                  <Text className="text-[11px] font-semibold text-orange-500">
                    Đang chiếu: {latestEpisode} / {totalEpisodes} Tập
                  </Text>
                </View>
              )}
            </View>

            {viewCount && (
              <View style={styles.viewContainer}>
                <View style={styles.viewBadge}>
                  <IconSymbol name="eye.fill" size={14} color="#facc15" />
                  <Text style={styles.viewText}>
                    {String(viewCount)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            {year && (
              <View style={[styles.metaBadge, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}>
                <Text style={[styles.metaText, { color: isDark ? '#d1d5db' : '#374151' }]}>
                  {year}
                </Text>
              </View>
            )}
            {time && (
              <View style={[styles.metaBadge, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}>
                <Text style={[styles.metaText, { color: isDark ? '#d1d5db' : '#374151' }]}>
                  {time}
                </Text>
              </View>
            )}
            {quality && (
              <View style={styles.qualityBadge}>
                <Text style={styles.qualityText}>{quality}</Text>
              </View>
            )}
            {lang && (
              <View style={styles.langBadge}>
                <Text style={styles.langText}>{formatLang(lang)}</Text>
              </View>
            )}
            {tags?.map((tag) => (
              tag?._id && tag?.name ? (
                <View key={tag._id} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag.name}</Text>
                </View>
              ) : null
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

