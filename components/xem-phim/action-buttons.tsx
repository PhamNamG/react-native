import React from 'react';
import { View, Pressable, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Flag, Heart, Plus, Share2, Repeat } from 'lucide-react-native';

interface ActionButtonsProps {
  isDark: boolean;
  prevEpisode?: string;
  nextEpisode?: string;
  isFavorite: boolean;
  autoNext: boolean;
  onFavoriteToggle: () => void;
  onAutoNextToggle: () => void;
  onReport: () => void;
  onShare: () => void;
  onAddToList: () => void;
}

export function ActionButtons({
  isDark,
  prevEpisode,
  nextEpisode,
  isFavorite,
  autoNext,
  onFavoriteToggle,
  onAutoNextToggle,
  onReport,
  onShare,
  onAddToList,
}: ActionButtonsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={`border-b ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}
      contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}
      style={{ maxHeight: 48 }}
    >
      {/* Tập trước */}
      <Pressable
        onPress={() => {
          if (prevEpisode) {
            router.push({
              pathname: '/xem-phim/[id]',
              params: { id: prevEpisode }
            });
          }
        }}
        disabled={!prevEpisode}
        className={`flex-row items-center justify-center py-2 px-3 rounded-lg gap-1.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} ${!prevEpisode && 'opacity-40'}`}
      >
        <ChevronLeft size={14} color={isDark ? '#ffffff' : '#111827'} />
        <Text className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Tập trước
        </Text>
      </Pressable>

      {/* Tập tiếp */}
      <Pressable
        onPress={() => {
          if (nextEpisode) {
            router.push({
              pathname: '/xem-phim/[id]',
              params: { id: nextEpisode }
            });
          }
        }}
        disabled={!nextEpisode}
        className={`flex-row items-center justify-center py-2 px-3 rounded-lg gap-1.5 ${nextEpisode ? 'bg-red-600' : isDark ? 'bg-gray-700' : 'bg-gray-200'} ${!nextEpisode && 'opacity-40'}`}
      >
        <Text className={`text-xs font-semibold ${nextEpisode ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Tập tiếp
        </Text>
        <ChevronRight
          size={14}
          color={nextEpisode ? '#ffffff' : isDark ? '#9ca3af' : '#6b7280'}
        />
      </Pressable>

      {/* Yêu thích */}
      <Pressable
        onPress={onFavoriteToggle}
        className={`flex-row items-center justify-center py-2 px-3 rounded-lg gap-1.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
      >
        <Heart
          size={14}
          color={isFavorite ? '#ef4444' : isDark ? '#ffffff' : '#111827'}
          fill={isFavorite ? '#ef4444' : 'none'}
        />
        <Text className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Yêu thích
        </Text>
      </Pressable>

      {/* Thêm vào */}
      <Pressable
        onPress={onAddToList}
        className={`flex-row items-center justify-center py-2 px-3 rounded-lg gap-1.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
      >
        <Plus size={14} color={isDark ? '#ffffff' : '#111827'} />
        <Text className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Thêm vào
        </Text>
      </Pressable>

      {/* Chuyển tập */}
      <Pressable
        onPress={onAutoNextToggle}
        className={`flex-row items-center justify-center py-2 px-3 rounded-lg gap-1.5 ${autoNext ? 'bg-green-600' : isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
      >
        <Repeat size={14} color={autoNext ? '#ffffff' : isDark ? '#ffffff' : '#111827'} />
        <Text className={`text-xs font-semibold ${autoNext ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'}`}>
          Chuyển tập
        </Text>
        <View className={`px-1.5 py-0.5 rounded ${autoNext ? 'bg-green-500' : 'bg-gray-500'}`}>
          <Text className="text-[10px] font-bold text-white">
            {autoNext ? 'ON' : 'OFF'}
          </Text>
        </View>
      </Pressable>

      {/* Chia sẻ */}
      <Pressable
        onPress={onShare}
        className={`flex-row items-center justify-center py-2 px-3 rounded-lg gap-1.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
      >
        <Share2 size={14} color={isDark ? '#ffffff' : '#111827'} />
        <Text className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Chia sẻ
        </Text>
      </Pressable>

      {/* Báo lỗi */}
      <Pressable
        onPress={onReport}
        className={`flex-row items-center justify-center py-2 px-3 rounded-lg gap-1.5 ${isDark ? 'bg-red-600' : 'bg-red-500'}`}
      >
        <Flag size={14} color="#ffffff" />
        <Text className="text-xs font-semibold text-white">
          Báo lỗi
        </Text>
      </Pressable>
    </ScrollView>
  );
}

