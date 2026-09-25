// Modern Medical Light Theme Design System
export const Palette = {
  // Brand Crimson / Ruby-Red (Modern vibrant medical rose-red)
  primary: '#E11D48',        // Vibrant Primary Rose-Crimson
  primaryDark: '#BE123C',    // Deep Crimson
  primaryLight: '#FB7185',   // Soft Rose Accent
  primarySurface: '#FFE4E6', // Soft rose tint for badges
  primaryMuted: '#FFF1F2',   // Very light background accent
  primarySoft: '#FFE4E6',
  primaryGlow: 'rgba(225, 29, 72, 0.12)',

  // Clean Neutrals
  white: '#FFFFFF',
  background: '#F8FAFC',     // Clean slate-50 canvas
  backgroundSubtle: '#F1F5F9', // Slate-100
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  cardSubtle: '#FBFDFF',
  border: '#E2E8F0',         // Soft slate border
  borderSubtle: '#F1F5F9',   // Very faint separator
  borderLight: '#F1F5F9',
  divider: '#E2E8F0',

  // Info
  info: '#0284C7',
  infoBg: '#E0F2FE',
  infoBorder: '#BAE6FD',

  // Typography
  textPrimary: '#0F172A',    // Deep slate charcoal (slate-900)
  textSecondary: '#475569',  // Medium slate (slate-600)
  textMuted: '#94A3B8',      // Light muted slate (slate-400)
  textSubtle: '#CBD5E1',     // Slate-300
  textOnPrimary: '#FFFFFF',

  // Healthcare Status Accents (Vibrant & Accessible)
  healthy: '#10B981',        // Emerald-500
  healthyBg: '#ECFDF5',      // Emerald-50
  healthyBorder: '#A7F3D0',  // Emerald-200

  moderate: '#2563EB',       // Blue-600
  moderateBg: '#EFF6FF',     // Blue-50
  moderateBorder: '#BFDBFE',  // Blue-200

  warning: '#F59E0B',        // Amber-500
  warningBg: '#FFFBEB',      // Amber-50
  warningBorder: '#FDE68A',  // Amber-200

  critical: '#EF4444',       // Red-500
  criticalBg: '#FEF2F2',     // Red-50
  criticalBorder: '#FECACA',  // Red-200

  quarantine: '#8B5CF6',     // Violet-500
  quarantineBg: '#F5F3FF',   // Violet-50
  quarantineBorder: '#DDD6FE',

  issued: '#0D9488',         // Teal-600
  issuedBg: '#F0FDFA',       // Teal-50
  issuedBorder: '#CCFBF1',

  // Gradients for modern UI
  gradientPrimary: ['#E11D48', '#BE123C'] as const,
  gradientLight: ['#FFFFFF', '#F8FAFC'] as const,
  gradientHero: ['#FFF1F2', '#F8FAFC'] as const,
};

export const Typography = {
  headerTitle: {
    fontSize: 21,
    fontWeight: '800' as const,
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  bodyRegular: {
    fontSize: 14,
    color: Palette.textSecondary,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    color: Palette.textMuted,
    lineHeight: 16,
  },
  caption: {
    fontSize: 11,
    color: Palette.textMuted,
    fontWeight: '500' as const,
  },
  metricLarge: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },
  metricMedium: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
};

export const Shadows = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  raised: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  floating: {
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
  },
  nav: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  screenPadding: 16,
};

export const BorderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  full: 9999,
};
