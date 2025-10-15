import React from 'react';
import { View, Pressable, Text, ScrollView } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface ServerOption {
  id: string;
  name: string;
  url: string;
  priority: number;
}

interface ServerSelectorProps {
  isDark: boolean;
  servers: ServerOption[];
  currentServerId: string | null;
  onServerChange: (serverId: string) => void;
}

export function ServerSelector({
  isDark,
  servers,
  currentServerId,
  onServerChange,
}: ServerSelectorProps) {
  if (servers.length <= 1) return null;

  return (
    <View className={`border-b ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row items-center mb-2">
          <IconSymbol name="play.rectangle.fill" size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text className={`text-sm font-semibold ml-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Chọn Server
          </Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4"
        contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
      >
        {servers.map((server) => {
          const isActive = currentServerId === server.id;
          return (
            <Pressable
              key={server.id}
              onPress={() => onServerChange(server.id)}
              className={`px-4 py-2 rounded-full border ${isActive
                ? 'bg-red-600 border-red-600'
                : isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
                }`}
            >
              <Text className={`text-[13px] font-semibold ${isActive ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {server.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <Text className='text-xs text-yellow-600 px-4 px-5 pb-3'>
        Note: Nếu không xem được phim, vui lòng chọn server khác
      </Text>
    </View>
  );
}

