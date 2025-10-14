import { StyleSheet, View, TextInput, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useSearchAnime } from '@/hooks/api/use-movies';
import { AnimeCard } from '@/components/anime-card';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data, isLoading, isError }:any = useSearchAnime(debouncedQuery);

  // Debounce search input - chỉ gọi API sau 500ms user ngừng gõ
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleMoviePress = useCallback((movie: any) => {
    router.push({
      pathname: '/phim/[id]',
      params: { id: movie.slug },
    });
  }, []);

  const handleClearSearch = useCallback(() => {
    setInputValue('');
    setDebouncedQuery('');
  }, []);

  const filteredMovies = data?.data || [];

  const isDark = colorScheme === 'dark';
  const showLoading = isLoading && debouncedQuery.length > 0;
  const showEmpty = !isLoading && debouncedQuery.length > 0 && filteredMovies.length === 0;
  const showResults = filteredMovies.length > 0;

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Tìm kiếm</ThemedText>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <IconSymbol 
            name="magnifyingglass" 
            size={20} 
            color={isDark ? '#666' : '#999'} 
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
                color: isDark ? Colors.dark.text : Colors.light.text,
              },
            ]}
            placeholder="Tìm kiếm phim, diễn viên..."
            placeholderTextColor={isDark ? '#666' : '#999'}
            value={inputValue}
            onChangeText={setInputValue}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {inputValue.length > 0 ? (
            <Pressable onPress={handleClearSearch} style={styles.clearButton}>
              <IconSymbol name="xmark.circle.fill" size={20} color={isDark ? '#666' : '#999'} />
            </Pressable>
          ) : null}
        </View>

        {/* Search Info */}
        {debouncedQuery.length > 0 ? (
          <View style={styles.searchInfo}>
            <ThemedText style={styles.searchInfoText}>
              {isLoading ? 'Đang tìm kiếm...' : `Tìm thấy ${filteredMovies.length} kết quả`}
            </ThemedText>
          </View>
        ) : null}
      </View>

      {/* Results */}
      <ScrollView 
        style={styles.resultsScroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Loading State */}
        {showLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDark ? '#ff6b81' : '#ff4757'} />
            <ThemedText style={styles.loadingText}>Đang tìm kiếm...</ThemedText>
          </View>
        ) : null}

        {/* Error State */}
        {isError ? (
          <View style={styles.emptyState}>
            <IconSymbol name="exclamationmark.triangle.fill" size={48} color="#f59e0b" />
            <ThemedText style={[styles.emptyText, { marginTop: 16 }]}>
              Không thể tải dữ liệu
            </ThemedText>
            <ThemedText style={[styles.emptySubText, { opacity: 0.6 }]}>
              Vui lòng thử lại sau
            </ThemedText>
          </View>
        ) : null}

        {/* Empty State */}
        {showEmpty && !isError ? (
          <View style={styles.emptyState}>
            <IconSymbol name="magnifyingglass" size={48} color={isDark ? '#666' : '#999'} />
            <ThemedText style={[styles.emptyText, { marginTop: 16 }]}>
              Không tìm thấy kết quả
            </ThemedText>
            <ThemedText style={[styles.emptySubText, { opacity: 0.6 }]}>
              Thử tìm kiếm với từ khóa khác
            </ThemedText>
          </View>
        ) : null}

        {/* Initial State - no search yet */}
        {!debouncedQuery && !isLoading && !isError ? (
          <View style={styles.emptyState}>
            <IconSymbol name="film" size={48} color={isDark ? '#666' : '#999'} />
            <ThemedText style={[styles.emptyText, { marginTop: 16 }]}>
              Tìm kiếm phim yêu thích
            </ThemedText>
            <ThemedText style={[styles.emptySubText, { opacity: 0.6 }]}>
              Nhập tên phim, diễn viên hoặc mô tả
            </ThemedText>
          </View>
        ) : null}

        {/* Results Grid */}
        {showResults && !isLoading && !isError ? (
          <View style={styles.resultsGrid}>
            {filteredMovies.map((movie: any) => (
              <View key={movie._id} style={styles.movieCardWrapper}>
                <AnimeCard
                  anime={movie}
                  onPress={() => handleMoviePress(movie)}
                />
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 48,
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  searchInfo: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  searchInfoText: {
    fontSize: 14,
    opacity: 0.7,
  },
  genreScroll: {
    maxHeight: 50,
    marginBottom: 16,
  },
  genreContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  genreChipActive: {
    // Active style applied via backgroundColor
  },
  genreText: {
    fontSize: 14,
    fontWeight: '500',
  },
  genreTextActive: {
    color: '#fff',
  },
  resultsScroll: {
    flex: 1,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  movieCardWrapper: {
    width: '48%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

