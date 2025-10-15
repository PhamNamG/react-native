import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '@/app/xem-phim/style';

interface MovieInfoProps {
  isDark: boolean;
  totalEpisodes?: string;
  status?: string;
  uploadDate?: string;
}

export function MovieInfo({
  isDark,
  totalEpisodes,
  status,
  uploadDate,
}: MovieInfoProps) {
  return (
    <View className={`px-4 py-5 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      {totalEpisodes && (
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
            Tổng số tập:
          </Text>
          <Text style={[styles.infoValue, { color: isDark ? '#ffffff' : '#111827' }]}>
            {totalEpisodes} tập
          </Text>
        </View>
      )}
      {status && (
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
            Trạng thái:
          </Text>
          <Text style={[styles.infoValue, { color: isDark ? '#ffffff' : '#111827' }]}>
            {status === 'pending' ? 'Đang cập nhật' : 'Hoàn thành'}
          </Text>
        </View>
      )}
      {uploadDate && (
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
            Ngày đăng:
          </Text>
          <Text style={[styles.infoValue, { color: isDark ? '#ffffff' : '#111827' }]}>
            {new Date(uploadDate).toLocaleDateString('vi-VN')}
          </Text>
        </View>
      )}
    </View>
  );
}

