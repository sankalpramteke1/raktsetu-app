import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
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

import { AppVersionInfo, fetchLatestAppVersion, isNewerVersion } from '../src/services/updateService';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update banner state
  const [updateInfo, setUpdateInfo] = useState<AppVersionInfo | null>(null);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const [downloadingUpdate, setDownloadingUpdate] = useState(false);

  // Check for updates on mount
  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const currentVersion = Constants.expoConfig?.version || '1.0.0';
        const latest = await fetchLatestAppVersion();
        if (latest && isNewerVersion(latest.version, currentVersion)) {
          setUpdateInfo(latest);
        }
      } catch {
        // Silently ignore update check errors on login screen
      }
    };
    checkUpdate();
  }, []);

  const handleDownloadUpdate = async () => {
    if (!updateInfo?.downloadUrl) return;
    setDownloadingUpdate(true);
    try {
      const canOpen = await Linking.canOpenURL(updateInfo.downloadUrl);
      if (canOpen) {
        await Linking.openURL(updateInfo.downloadUrl);
      }
    } catch {
      // ignore
    } finally {
      setDownloadingUpdate(false);
    }
  };

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
          {/* Update Banner */}
          {updateInfo && !updateDismissed && (
            <View style={styles.updateBanner}>
              <View style={styles.updateBannerTop}>
                <View style={styles.updateIconWrap}>
                  <Ionicons name="cloud-download-outline" size={20} color={Palette.white} />
                </View>
                <View style={styles.updateTextWrap}>
                  <Text style={styles.updateTitle}>Naya Update Available! 🎉</Text>
                  <Text style={styles.updateVersion}>
                    Version {updateInfo.version}
                    {updateInfo.fileSize ? `  •  ${updateInfo.fileSize}` : ''}
                    {updateInfo.releaseDate ? `  •  ${updateInfo.releaseDate}` : ''}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setUpdateDismissed(true)}
                  hitSlop={10}
                  style={styles.updateDismiss}>
                  <Ionicons name="close" size={16} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
              </View>
              {updateInfo.releaseNotes ? (
                <Text style={styles.updateNotes} numberOfLines={2}>
                  {updateInfo.releaseNotes}
                </Text>
              ) : null}
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={handleDownloadUpdate}
                activeOpacity={0.85}
                disabled={downloadingUpdate}>
                {downloadingUpdate ? (
                  <ActivityIndicator size="small" color={Palette.primary} />
                ) : (
                  <>
                    <Ionicons name="download-outline" size={15} color={Palette.primary} />
                    <Text style={styles.updateBtnText}>Download APK ({updateInfo.version})</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

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
                  placeholder="Enter your official email"
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
  // ─── Update Banner ────────────────────────────────────────────────────────
  updateBanner: {
    backgroundColor: '#1a6e3c',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  updateBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  updateIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  updateTextWrap: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.white,
    marginBottom: 2,
  },
  updateVersion: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  updateDismiss: {
    padding: 4,
  },
  updateNotes: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 17,
    marginBottom: Spacing.md,
  },
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: 10,
  },
  updateBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a6e3c',
  },
  // ─────────────────────────────────────────────────────────────────────────
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


});
