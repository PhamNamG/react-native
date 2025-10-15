import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { EpisodesGrid } from '@/components/episodes-grid';
import { Image } from 'expo-image';

interface Episode {
  slug: string;
  seri: string;
  thumnail?: string;
}

interface EpisodeTabsProps {
  isDark: boolean;
  episodes: Episode[];
  gallery?: Array<{ imageUrl: string; _id: string }>;
  onEpisodePress: (slug: string) => void;
}

export function EpisodeTabs({ isDark, episodes, gallery = [], onEpisodePress }: EpisodeTabsProps) {
  const [activeTab, setActiveTab] = useState<'episodes' | 'gallery'>('episodes');
  const [showThumbnails, setShowThumbnails] = useState(false);

  // Remove duplicate episodes based on slug
  const uniqueEpisodes = React.useMemo(() => {
    const seen = new Set();
    return episodes.filter(episode => {
      if (seen.has(episode.slug)) {
        return false;
      }
      seen.add(episode.slug);
      return true;
    });
  }, [episodes]);

  // Fallback image for thumbnails
  const fallbackImage = gallery[0]?.imageUrl || 'https://via.placeholder.com/200x120?text=No+Image';

  return (
    <View className="mb-6">
      {/* Header with Tabs and Switch */}
      <View className={`flex-row items-center justify-between mb-3 pb-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        {/* Tabs */}
        <View className="flex-row gap-4">
          <Pressable onPress={() => setActiveTab('episodes')}>
            <Text className={`text-base font-bold ${activeTab === 'episodes'
                ? isDark ? 'text-white' : 'text-black'
                : isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
              Danh sách tập
            </Text>
            {activeTab === 'episodes' && (
              <View className="h-0.5 bg-red-600 mt-1 rounded-full" />
            )}
          </Pressable>

          {gallery.length > 0 && (
            <Pressable onPress={() => setActiveTab('gallery')}>
              <Text className={`text-base font-bold ${activeTab === 'gallery'
                  ? isDark ? 'text-white' : 'text-black'
                  : isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>
                Gallery
              </Text>
              {activeTab === 'gallery' && (
                <View className="h-0.5 bg-red-600 mt-1 rounded-full" />
              )}
            </Pressable>
          )}
        </View>

        {/* Switch for thumbnail view (only show on episodes tab) */}
        {activeTab === 'episodes' && (
          <View className="flex-row items-center gap-2">
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Rút gọn
            </Text>
            <Switch
              value={showThumbnails}
              onValueChange={setShowThumbnails}
              trackColor={{ false: isDark ? '#374151' : '#d1d5db', true: '#dc2626' }}
              thumbColor={showThumbnails ? '#ffffff' : '#f3f4f6'}
              ios_backgroundColor={isDark ? '#374151' : '#d1d5db'}
            />
          </View>
        )}
      </View>

      {/* Content */}
      {activeTab === 'episodes' ? (
        showThumbnails ? (
          // Thumbnail Grid View
          <ScrollView
            className={`rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}
            style={{ maxHeight: 400 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
           <View className="flex-row flex-wrap p-2 gap-2">
             {uniqueEpisodes.map((episode, index) => (
               <Pressable
                 key={`${episode.slug}-${index}`}
                 onPress={() => onEpisodePress(episode.slug)}
                 className="w-[31%] mb-2"
               >
                 <View className="relative">
                   <Image
                     source={{
                       uri: episode.thumnail || fallbackImage
                     }}
                     style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 8 }}
                     contentFit="cover"
                     transition={100}
                   />
                   <View className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded">
                     <Text className="text-white text-[10px] font-bold">
                       Tập {episode.seri}
                     </Text>
                   </View>
                 </View>
               </Pressable>
             ))}
           </View>
          </ScrollView>
         ) : (
           // Number Grid View
           <EpisodesGrid
             title=''
             episodes={uniqueEpisodes}
             isDark={isDark}
             showCount={false}
             maxHeight={200}
             columns={6}
             onEpisodePress={onEpisodePress}
           />
         )
      ) : (
        // Gallery View
        <ScrollView
          className={`rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}
          style={{ maxHeight: 400 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View className="flex-row flex-wrap p-2 gap-2">
            {gallery.map((image, index) => (
              <View key={image._id} className="w-[48%] mb-2">
                <Image
                  source={{ uri: image.imageUrl }}
                  style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 8 }}
                  contentFit="cover"
                  transition={200}
                />
                <Text className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ảnh {index + 1}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

