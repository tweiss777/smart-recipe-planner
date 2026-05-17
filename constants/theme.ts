import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#2C3E2C',
    background: '#F4F9EE',
    surface: '#FFFFFF',
    tint: '#6B8E23',
    accent: '#C5E384',
    icon: '#5A6F5A',
    muted: '#5A6F5A',
    border: '#D4E4C8',
    tabIconDefault: '#5A6F5A',
    tabIconSelected: '#6B8E23',
    error: '#C0392B',
  },
  dark: {
    text: '#E8F5E0',
    background: '#1B2A1B',
    surface: '#243524',
    tint: '#9ACD32',
    accent: '#7CB342',
    icon: '#A8C4A0',
    muted: '#A8C4A0',
    border: '#3D5238',
    tabIconDefault: '#A8C4A0',
    tabIconSelected: '#9ACD32',
    error: '#E74C3C',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
