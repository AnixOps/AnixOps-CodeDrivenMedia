import { Theme } from '../types';

// 主题色彩定义
export const COLORS = {
  // 品牌色
  primary: '#007AFF',
  primaryLight: '#4DA2FF',
  primaryDark: '#0051D4',
  
  // 辅助色
  secondary: '#34C759',
  accent: '#FF9500',
  warning: '#FF3B30',
  
  // 中性色
  white: '#FFFFFF',
  black: '#000000',
  background: '#F8FAFC',
  
  // 文本色
  text: {
    primary: '#1A202C',
    secondary: '#718096',
    muted: '#A0AEC0'
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // 透明度变体
  alpha: {
    white10: 'rgba(255, 255, 255, 0.1)',
    white20: 'rgba(255, 255, 255, 0.2)',
    white40: 'rgba(255, 255, 255, 0.4)',
    white50: 'rgba(255, 255, 255, 0.5)',
    white80: 'rgba(255, 255, 255, 0.8)',
    black10: 'rgba(0, 0, 0, 0.1)',
    black20: 'rgba(0, 0, 0, 0.2)',
    black50: 'rgba(0, 0, 0, 0.5)',
    black80: 'rgba(0, 0, 0, 0.8)',
    primary30: 'rgba(0, 122, 255, 0.3)'
  }
} as const;

// 字体定义
export const TYPOGRAPHY = {
  fontFamily: {
    primary: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
    secondary: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
    mono: 'SF Mono, Monaco, Cascadia Code, monospace',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  }
} as const;

// 间距定义
export const SPACING = {
  px: '1px',
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem',    // 256px
} as const;

// 阴影定义
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// 默认主题
export const DEFAULT_THEME: Theme = {
  name: 'default',
  colors: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    accent: COLORS.accent,
    background: COLORS.white,
    surface: COLORS.gray[50],
    text: {
      primary: COLORS.gray[900],
      secondary: COLORS.gray[600],
      disabled: COLORS.gray[400],
    },
    status: {
      success: COLORS.secondary,
      warning: COLORS.accent,
      error: COLORS.warning,
      info: COLORS.primary,
    },
  },
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadows: SHADOWS,
};

// 深色主题
export const DARK_THEME: Theme = {
  ...DEFAULT_THEME,
  name: 'dark',
  colors: {
    ...DEFAULT_THEME.colors,
    background: COLORS.gray[900],
    surface: COLORS.gray[800],
    text: {
      primary: COLORS.white,
      secondary: COLORS.gray[300],
      disabled: COLORS.gray[500],
    },
  },
};