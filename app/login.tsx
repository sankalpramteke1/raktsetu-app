import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../src/constants/theme';
import { useAuth } from '../src/context/AuthContext';
import { API_BASE_URL } from '../src/services/apiClient';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await login(email.trim(), password);
      // Redirect to main tabs
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err.message || 'Login failed. Please check your credentials.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setErrorMessage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          {/* Header Brand Branding */}
          <View style={styles.brandHeader}>
            <View style={styles.logoWrap}>
              <Ionicons name="water" size={38} color={Palette.primary} />
            </View>
            <Text style={styles.brandTitle}>RaktSetu</Text>
            <Text style={styles.brandSubtitle}>
              Durg District Hospital Blood Bank Portal
            </Text>
            <View style={styles.liveBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.liveBadgeText}>Central Hospital Network Live</Text>
            </View>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Staff Sign In</Text>
            <Text style={styles.cardSubtitle}>
              Sign in with your authorized hospital credentials to access the blood management system.
            </Text>

            {errorMessage && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color={Palette.critical} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Official Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={19}
                  color={Palette.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. admin@ibitf.org"
                  placeholderTextColor={Palette.textMuted}
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    setErrorMessage(null);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Security Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={19}
                  color={Palette.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={Palette.textMuted}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    setErrorMessage(null);
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={10}
                  style={styles.eyeBtn}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={19}
                    color={Palette.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.loginBtn, submitting && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={submitting}
              activeOpacity={0.85}>
              {submitting ? (
                <ActivityIndicator size="small" color={Palette.white} />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>Authenticate & Proceed</Text>
                  <Ionicons name="arrow-forward" size={18} color={Palette.white} />
                </>
              )}
            </TouchableOpacity>

            {/* Quick Fill Chips for Testing */}
            <View style={styles.quickFillSection}>
              <Text style={styles.quickFillHeader}>Demo Authorized Logins:</Text>
              <View style={styles.chipRow}>
                <TouchableOpacity
                  style={styles.presetChip}
                  onPress={() => handleQuickFill('admin@ibitf.org', 'Admin@123')}>
                  <Ionicons name="shield-checkmark" size={13} color={Palette.primary} />
                  <Text style={styles.presetChipText}>Admin (admin@ibitf.org)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetChip}
                  onPress={() => handleQuickFill('admin2@ibitf.org', 'Admin@123')}>
                  <Ionicons name="person" size={13} color={Palette.primary} />
                  <Text style={styles.presetChipText}>Staff (admin2@ibitf.org)</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Connection Info */}
          <View style={styles.footerInfo}>
            <Ionicons name="globe-outline" size={13} color={Palette.textMuted} />
            <Text style={styles.footerInfoText}>Connected to: {API_BASE_URL}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl + Spacing.lg,
    justifyContent: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Palette.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.healthyBg,
    borderColor: Palette.healthyBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    marginTop: Spacing.md,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.healthy,
    marginRight: 6,
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.healthy,
  },
  card: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.criticalBg,
    borderColor: Palette.criticalBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontSize: 12,
    color: Palette.critical,
    marginLeft: Spacing.sm,
    flex: 1,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.backgroundSubtle,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Palette.textPrimary,
    height: '100%',
  },
  eyeBtn: {
    padding: Spacing.xs,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.primary,
    borderRadius: BorderRadius.lg,
    height: 48,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '700',
  },
  quickFillSection: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
  },
  quickFillHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textMuted,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.primaryMuted,
    borderColor: Palette.primarySurface,
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  presetChipText: {
    fontSize: 11,
    color: Palette.primary,
    fontWeight: '600',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    gap: 6,
  },
  footerInfoText: {
    fontSize: 11,
    color: Palette.textMuted,
  },
});
