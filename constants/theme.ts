/**
 * Setting light and dark colour palettes for the app.
 **/


export const Colors = {
  light: {
    primary: '#0D9488',           // main brand colour - Teal
    primaryLight: '#CCFBF1',
    primaryDark: '#115E59',
    background: '#F8FAFC',        // main background colour
    surface: '#FFFFFF',           // card/input colour
    surfaceAlt: '#F1F5F9',        
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',         // placeholder text and hint colour
    border: '#E2E8F0',
    borderFocused: '#0D9488',
    danger: '#DC2626',
    dangerLight: '#FEE2E2',
    success: '#16A34A',
    successLight: '#DCFCE7',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    tabIconDefault: '#94A3B8',
    tabIconActive: '#0D9488',
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
  },
  dark: {
    primary: '#2DD4BF',            // a lighter teal for dark theme
    primaryLight: '#042F2E',
    primaryDark: '#99F6E4',
    background: '#0F172A',
    surface: '#1E293B',
    surfaceAlt: '#334155',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    border: '#334155',
    borderFocused: '#2DD4BF',
    danger: '#EF4444',
    dangerLight: '#450A0A',
    success: '#22C55E',
    successLight: '#052E16',
    warning: '#FBBF24',
    warningLight: '#422006',
    tabBar: '#1E293B',
    tabBarBorder: '#334155',
    tabIconDefault: '#64748B',
    tabIconActive: '#2DD4BF',
    card: '#1E293B',
    cardBorder: '#334155',
  },
};

// export type for other files
export type ThemeColors = typeof Colors.light;

// preset colour options for log categories
export const CategoryColors = [
  '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B',
  '#EF4444', '#EC4899', '#06B6D4', '#84CC16',
  '#F97316', '#6366F1', '#14B8A6', '#A855F7',
];

// preset icons for log categories
export const CategoryIcons = [
  '💪', '🧘', '📚', '⚡', '🏃', '💧', '🎯', '✍️',
  '🎵', '🧹', '💰', '🍎', '😴', '🧠', '🌱', '❤️',
];