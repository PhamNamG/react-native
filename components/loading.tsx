import React from "react";
import { ActivityIndicator, Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";

const Loading = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#181b24' : '#ffffff' }]}>
      <ActivityIndicator 
        size="large" 
        color="#ff4757" 
      />
      <Text style={[styles.text, { color: isDark ? '#ffffff' : '#1f2937' }]}>
        Đang tải...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
  },
});

export default Loading;