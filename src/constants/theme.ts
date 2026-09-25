// ─── RaktSetu Glassmorphism Design System ───────────────────────────────
// A premium, frosted-glass healthcare aesthetic with deep dark backgrounds,
// translucent surfaces, glowing accents, and smooth micro-interactions.

export const Palette = {
  // ── Core Background Layers ──
  background: '#0A0E1A',        // Deep navy-black canvas
  backgroundAlt: '#0F1425',     // Slightly lighter variant
  surface: 'rgba(255,255,255,0.06)',  // Frosted glass surface
  surfaceElevated: 'rgba(255,255,255,0.10)', // Raised glass card
  surfaceActive: 'rgba(255,255,255,0.14)',   // Pressed/hovered state
  card: 'rgba(255,255,255,0.07)',      // Default glass card

  // ── Brand Crimson / Blood-Red ──
  primary: '#FF3B5C',           // Vibrant neon crimson
  primaryDark: '#CC2E49',       // Deep crimson
  primaryLight: '#FF6B84',      // Soft glow variant
  primarySurface: 'rgba(255,59,92,0.15)',  // Red glass tint
  primaryMuted: 'rgba(255,59,92,0.08)',    // Very subtle red glow
  primaryGlow: 'rgba(255,59,92,0.30)',     // Glow ring effect

  // ── Glass Border & Dividers ──
  border: 'rgba(255,255,255,0.10)',
  borderSubtle: 'rgba(255,255,255,0.06)',
  borderLight: 'rgba(255,255,255,0.08)',
  borderAccent: 'rgba(255,59,92,0.25)',
  divider: 'rgba(255,255,255,0.06)',
  white: '#FFFFFF',
  primarySoft: 'rgba(255,59,92,0.12)',

  // ── Typography ──
  textPrimary: '#F1F3F8',       // Near-white
  textSecondary: '#8B93A7',     // Muted silver
  textMuted: '#565E73',         // Dim grey
  textOnPrimary: '#FFFFFF',
  textGlow: '#FF3B5C',          // Neon accent for emphasis

  // ── Status Accents (Vibrant Neon on Dark) ──
  healthy: '#00E676',           // Neon green
  healthyBg: 'rgba(0,230,118,0.12)',
  healthyBorder: 'rgba(0,230,118,0.20)',

  moderate: '#448AFF',          // Electric blue
  moderateBg: 'rgba(68,138,255,0.12)',
  moderateBorder: 'rgba(68,138,255,0.20)',

  warning: '#FFB300',           // Amber glow
  warningBg: 'rgba(255,179,0,0.12)',
  warningBorder: 'rgba(255,179,0,0.20)',

  critical: '#FF1744',          // Neon red
  criticalBg: 'rgba(255,23,68,0.12)',
  criticalBorder: 'rgba(255,23,68,0.20)',

  quarantine: '#B388FF',        // Purple glow
  quarantineBg: 'rgba(179,136,255,0.12)',
  quarantineBorder: 'rgba(179,136,255,0.20)',

  issued: '#00E5FF',            // Cyan glow
  issuedBg: 'rgba(0,229,255,0.12)',
  issuedBorder: 'rgba(0,229,255,0.20)',

  // ── Info ──
  info: '#448AFF',
  infoBg: 'rgba(68,138,255,0.12)',
  infoBorder: 'rgba(68,138,255,0.20)',

  // ── Gradient Presets ──
  gradientPrimary: ['#FF3B5C', '#FF6B84'] as const,
  gradientDark: ['#0A0E1A', '#141B2D'] as const,
  gradientGlass: ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.04)'] as const,
  gradientHeader: ['rgba(255,59,92,0.20)', 'rgba(10,14,26,0.95)'] as const,
};

export const Typography = {
  headerTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Palette.textPrimary,
    letterSpacing: -0.4,
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
    fontSize: 28,
    fontWeight: '800' as const,
    color: Palette.textPrimary,
    letterSpacing: -0.6,
  },
  metricMedium: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Palette.textPrimary,
  },
};

export const Shadows = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 8,
    elevation: 4,
  },
  raised: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  glow: {
    shadowColor: '#FF3B5C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  glowSubtle: {
    shadowColor: '#FF3B5C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  full: 9999,
};

// ── Glass Style Helpers ──
export const GlassStyles = {
  card: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.card,
  },
  cardElevated: {
    backgroundColor: Palette.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    ...Shadows.raised,
  },
  pill: {
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Palette.border,
  },
};
