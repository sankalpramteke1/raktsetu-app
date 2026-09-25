export const Palette = {
  // Brand Crimson / Blood-Red
  primary: '#C62828',        // Primary Crimson
  primaryDark: '#8E0000',    // Darker shade
  primaryLight: '#E53935',   // Vibrant Red Accent
  primarySurface: '#FEE2E2', // Soft red tint for badges
  primaryMuted: '#FFF5F5',   // Very light background accent

  // Clean Neutrals
  white: '#FFFFFF',
  background: '#F8FAFC',     // Modern slate-50 neutral app canvas
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E2E8F0',         // Soft slate border
  borderSubtle: '#F1F5F9',   // Very faint separator
  borderLight: '#F1F5F9',
  primarySoft: '#FEE2E2',
  divider: '#E2E8F0',

  // Info
  info: '#0284C7',
  infoBg: '#E0F2FE',
  infoBorder: '#BAE6FD',

  // Typography
  textPrimary: '#0F172A',    // Deep slate charcoal
  textSecondary: '#475569',  // Medium slate
  textMuted: '#94A3B8',      // Light muted slate
  textOnPrimary: '#FFFFFF',

  // Healthcare Status Accents (Refined & Soft)
  healthy: '#16A34A',        // Green
  healthyBg: '#F0FDF4',
  healthyBorder: '#DCFCE7',

  moderate: '#2563EB',       // Blue
  moderateBg: '#EFF6FF',
  moderateBorder: '#DBEAFE',

  warning: '#D97706',        // Amber
  warningBg: '#FFFBEB',
  warningBorder: '#FEF3C7',

  critical: '#DC2626',       // Red
  criticalBg: '#FEF2F2',
  criticalBorder: '#FEE2E2',

  quarantine: '#7C3AED',     // Purple
  quarantineBg: '#F5F3FF',
  quarantineBorder: '#EDE9FE',

  issued: '#0D9488',         // Teal
  issuedBg: '#F0FDFA',
  issuedBorder: '#CCFBF1',
};

export const Typography = {
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Palette.textPrimary,
    letterSpacing: -0.2,
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
    fontSize: 24,
    fontWeight: '800' as const,
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },
  metricMedium: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Palette.textPrimary,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  raised: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
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
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
