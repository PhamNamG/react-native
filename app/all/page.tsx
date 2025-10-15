import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from "react-native";
import { useState } from "react";
import { useAnimeAll } from "@/hooks/api/use-movies";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import Loading from "@/components/loading";
import { AnimeCard } from "@/components/anime-card";
import { Anime } from "@/lib/api/services/movies";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function AllPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching } = useAnimeAll(page);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleAnimePress = (anime: Anime) => {
    router.push({
      pathname: '/phim/[id]',
      params: { id: anime.slug },
    });
  };

  const handleLoadMore = () => {
    if (!isFetching) {
      setPage(prev => prev + 1);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading && page === 1) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ThemedView style={styles.errorContainer}>
        <IconSymbol name="exclamationmark.triangle" size={48} color={isDark ? '#ff6b81' : '#ff4757'} />
        <ThemedText style={styles.errorText}>⚠️ Không thể tải dữ liệu</ThemedText>
        <ThemedText style={styles.errorSubtext}>Vui lòng thử lại sau</ThemedText>
        <Pressable 
          style={[styles.retryButton, { backgroundColor: isDark ? '#ff6b81' : '#ff4757' }]}
          onPress={() => setPage(1)}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </Pressable>
      </ThemedView>
    );
  }

  const animeList = data?.data.data || [];

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <IconSymbol 
            name="chevron.left" 
            size={24} 
            color={isDark ? Colors.dark.text : Colors.light.text} 
          />
        </Pressable>
        <ThemedText type="title" style={styles.headerTitle}>
          Tất cả phim
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      {/* Anime Grid */}
      <FlatList
        data={animeList}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <AnimeCard
              anime={item}
              onPress={() => handleAnimePress(item)}
            />
          </View>
        )}
        ListFooterComponent={() => (
          isFetching ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="large" color={isDark ? Colors.dark.tint : Colors.light.tint} />
              <ThemedText style={styles.loadingText}>Đang tải thêm...</ThemedText>
            </View>
          ) : animeList.length > 0 ? (
            <Pressable 
              style={[styles.loadMoreButton, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}
              onPress={handleLoadMore}
            >
              <ThemedText style={styles.loadMoreText}>Xem thêm</ThemedText>
              <IconSymbol name="chevron.down" size={16} color={isDark ? '#fff' : '#000'} />
            </Pressable>
          ) : null
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <IconSymbol name="film" size={64} color={isDark ? '#666' : '#ccc'} />
            <ThemedText style={styles.emptyText}>Không có phim nào</ThemedText>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 40,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardWrapper: {
    width: '48%',
  },
  footerLoader: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    opacity: 0.7,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 15,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    opacity: 0.5,
  },
});
