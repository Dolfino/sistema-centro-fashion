/**
 * LEGACY DESIGN TOKENS (SINALIZAÇÃO DO MALL)
 * Extraídos estritamente de styles.html da baseline oficial s26_6
 */

export const LegacyTheme = {
  colors: {
    navy: '#11184f',
    navy2: '#252d72',
    pink: '#ef0a7c',
    pinkDark: '#c50064',
    bg: '#f4f6fb',
    surface: '#ffffff',
    text: '#20233a',
    muted: '#697086',
    border: '#dfe3ed',
    success: '#18794e',
    warning: '#9a5b00',
    danger: '#b42318',
    // Status badges
    onlineBg: 'rgba(31, 191, 117, 0.2)',
    onlineText: '#b9f6d3',
    offlineBg: 'rgba(239, 10, 124, 0.2)',
    offlineText: '#ffd0e7',
    badgeDefaultBg: 'rgba(255, 255, 255, 0.14)',
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontSizeHeaderTitle: 17,
    fontSizeHeaderSub: 12,
    fontSizeLabel: 13,
    fontSizeBody: 14,
    fontSizeSmall: 12,
  },
  borderRadius: {
    small: 6,
    medium: 10,
    card: 16,
    pill: 999,
  },
  shadows: {
    header: {
      shadowColor: '#11184f',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.22,
      shadowRadius: 18,
      elevation: 5,
    },
    card: {
      shadowColor: '#11184f',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      elevation: 3,
    },
  },
};
