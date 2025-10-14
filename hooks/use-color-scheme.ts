import { useThemeStorage } from "./use-theme-storage";

export type ColorScheme = 'light' | 'dark';

/**
 * Hook to get current color scheme
 * Uses ThemeStorageProvider context if available, otherwise returns 'light'
 * 
 * @returns 'light' | 'dark' (never null)
 */
export function useColorScheme(): ColorScheme {
  try {
    // Try to use theme from context
    const { colorScheme } = useThemeStorage();
    return colorScheme;
  } catch {
    // Fallback if not within ThemeStorageProvider
    return 'light';
  }
}
