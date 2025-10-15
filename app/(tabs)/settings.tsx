import { StyleSheet, View, Pressable, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { NotificationSettings } from '@/components/notification-settings';
import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import { useThemeStorage } from '@/hooks';
import { Bell, ChevronRight, Moon, Smartphone, Sun, XCircle } from 'lucide-react-native';
interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  disabled?: boolean;
  colorScheme: 'light' | 'dark';
}

function MenuItem({ icon, title, subtitle, onPress, disabled = false, colorScheme }: MenuItemProps) {

  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      style={[
        styles.menuItem,
        {
          backgroundColor: isDark ? '#1a1a1a' : '#fff',
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }}
    >
      <View style={styles.menuItemLeft}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
            },
          ]}
        >
            {icon}
        </View>
        <View style={styles.menuItemText}>
          <ThemedText style={styles.menuItemTitle}>{title}</ThemedText>
          {subtitle && (
            <ThemedText style={styles.menuItemSubtitle}>{subtitle}</ThemedText>
          )}
        </View>
      </View>
      <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <ChevronRight size={20} color={isDark ? '#666' : '#999'} />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const {
    colorScheme,
    themePreference,
    isLoading,
    toggleTheme
  } = useThemeStorage();

  const [isChangingTheme, setIsChangingTheme] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  const handleToggleTheme = async () => {
    if (isChangingTheme) return;

    setIsChangingTheme(true);

    try {
      await toggleTheme();

      // Small delay for better UX
      setTimeout(() => {
        setIsChangingTheme(false);
      }, 300);
    } catch (error) {
      console.error('Failed to toggle theme:', error);
      setIsChangingTheme(false);
    }
  };

  const getThemeDisplayInfo = () => {
    if (themePreference === 'system') {
      return {
        icon: <Smartphone size={20} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />,
        subtitle: `Auto (${colorScheme === 'dark' ? 'Dark' : 'Light'})`,
      };
    } else if (themePreference === 'light') {
      return {
        icon: <Sun size={20} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />,
        subtitle: 'Light Mode',
      };
    } else {
      return {
        icon: <Moon size={20} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />,
        subtitle: 'Dark Mode',
      };
    }
  };

  const themeInfo = getThemeDisplayInfo();
  const isDark = colorScheme === 'dark';

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={isDark ? Colors.dark.tint : Colors.light.tint} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userSection}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: isDark ? '#2a2a2a' : '#e0e0e0',
              },
            ]}
          >
            <ThemedText style={styles.avatarText}>MC</ThemedText>
          </View>
          <ThemedText type="subtitle" style={styles.userName}>
            Movie Collector
          </ThemedText>
          <ThemedText style={styles.userEmail}>user@example.com</ThemedText>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Settings</ThemedText>

          <MenuItem
            icon={<Bell size={20} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />}
            title="Notifications"
            subtitle="Quản lý thông báo"
            onPress={() => setShowNotificationSettings(true)}
            colorScheme={colorScheme}
          />

          <MenuItem
            icon={themeInfo.icon}
            title="Appearance"
            subtitle={isChangingTheme ? 'Changing...' : themeInfo.subtitle}
            onPress={handleToggleTheme}
            disabled={isChangingTheme}
            colorScheme={colorScheme}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Notification Settings Modal */}
      <Modal
        visible={showNotificationSettings}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotificationSettings(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Cài đặt thông báo
            </ThemedText>
            <Pressable onPress={() => setShowNotificationSettings(false)}>
              <XCircle size={28} color={isDark ? '#999' : '#666'} />
            </Pressable>
          </View>
          <NotificationSettings />
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  content: {
    flex: 1,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.6,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  bottomSpacing: {
    height: 32,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});
