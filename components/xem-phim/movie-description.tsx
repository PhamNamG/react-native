import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronUp, ChevronDown } from 'lucide-react-native';
import { styles } from '@/app/xem-phim/style';

interface MovieDescriptionProps {
  isDark: boolean;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function MovieDescription({
  isDark,
  description,
  isExpanded,
  onToggle,
}: MovieDescriptionProps) {
  if (!description) return null;

  return (
    <View >
      <View>
        <Pressable
          onPress={onToggle}
          style={styles.descriptionHeader}
        >
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#111827' }]}>
            Nội dung
          </Text>
          {isExpanded ? (
            <ChevronUp size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          ) : (
            <ChevronDown size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          )}
        </Pressable>
        <Text
          style={[
            styles.description,
            { color: isDark ? '#d1d5db' : '#374151' }
          ]}
          numberOfLines={isExpanded ? undefined : 3}
        >
          {description}
        </Text>
        {!isExpanded && description.length > 150 && (
          <Pressable
            onPress={onToggle}
            style={styles.readMoreButton}
          >
            <Text style={styles.readMoreText}>Xem thêm</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

