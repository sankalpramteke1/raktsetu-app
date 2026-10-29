import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
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
import * as Updates from 'expo-updates';
import {
  AppVersionInfo,
  checkAndApplyEASUpdate,
  fetchLatestAppVersion,
  isNewerVersion,
} from '../src/services/updateService';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // App version & Update banner state
  const currentVersion = Constants.expoConfig?.version || '1.0.6';
  const [updateInfo, setUpdateInfo] = useState<AppVersionInfo | null>(null);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const [downloadingUpdate, setDownloadingUpdate] = useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);

  const handleDownloadUpdate = async (customUrl?: string) => {
    const url = customUrl || updateInfo?.downloadUrl;
    if (!url) return;
    setDownloadingUpdate(true);
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Download Error', 'Download link open nahi ho paya.');
      }
    } catch (err: any) {
      Alert.alert('Download Error', err.message || 'Link open karne me samasya aayi.');
    } finally {
      setDownloadingUpdate(false);
    }
  };

  // Run update check
  const runUpdateCheck = async (isManual = false) => {
    if (isManual) setCheckingUpdate(true);
    try {
      // 1. Try EAS Over-The-Air Update first
      if (Updates.isEnabled && !__DEV__) {
        const ota = await checkAndApplyEASUpdate(isManual);
        if (ota.updated) {
          if (isManual) setCheckingUpdate(false);
          return;
        }
      }

      // 2. Fallback to GitHub Release APK check
      const latest = await fetchLatestAppVersion();
      const now = new Date();
      setLastChecked(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      if (latest && isNewerVersion(latest.version, currentVersion)) {
        setUpdateInfo(latest);
        setUpdateDismissed(false);
        if (isManual) {
          Alert.alert(
            `Naya Update Uplabdh Hai! 🎉`,
            `Version: ${latest.version}\nSize: ${latest.fileSize || 'Standard APK'}\nDate: ${latest.releaseDate || 'Recent'}\n\nNaye features aur improvements ke liye APK download karein.`,
            [
              { text: 'Baad me', style: 'cancel' },
              {
                text: 'Download APK',
                onPress: () => handleDownloadUpdate(latest.downloadUrl),
              },
            ]
          );
        }
      } else {
        setUpdateInfo(latest || null);
        if (isManual) {
          Alert.alert(
            'Up to Date! 🎉',
            `Aap pehle se hi latest version (v${currentVersion}) use kar rahe hain. Koi naya update pending nahi hai.`
          );
        }
      }
    } catch {
      if (isManual) {
        Alert.alert('Update Check Failed', 'Network connection check karein aur dobara koshish karein.');
      }
    } finally {
      if (isManual) setCheckingUpdate(false);
    }
  };

  // Check for updates on mount
  useEffect(() => {
    runUpdateCheck(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const hasUpdate = Boolean(updateInfo && isNewerVersion(updateInfo.version, currentVersion));

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
          {hasUpdate && !updateDismissed && updateInfo && (
            <View style={styles.updateBanner}>
              <View style={styles.updateBannerTop}>
                <View style={styles.updateIconWrap}>
                  <Ionicons name="cloud-download-outline" size={20} color={Palette.white} />
                </View>
                <View style={styles.updateTextWrap}>
                  <View style={styles.updateBadgeRow}>
                    <Text style={styles.updateTitle}>Naya Update Available! 🎉</Text>
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  </View>
                  <Text style={styles.updateVersion}>
                    Installed v{currentVersion}  ➔  New {updateInfo.version}
                    {updateInfo.fileSize ? `  •  ${updateInfo.fileSize}` : ''}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setUpdateDismissed(true)}
                  hitSlop={10}
                  style={styles.updateDismiss}>
                  <Ionicons name="close" size={18} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
              </View>

              {updateInfo.releaseNotes ? (
                <Text style={styles.updateNotes} numberOfLines={2}>
                  {updateInfo.releaseNotes.replace(/^#+\s+/gm, '')}
                </Text>
              ) : null}

              <View style={styles.updateBtnRow}>
                <TouchableOpacity
                  style={styles.updateBtn}
                  onPress={() => handleDownloadUpdate()}
                  activeOpacity={0.85}
                  disabled={downloadingUpdate}>
                  {downloadingUpdate ? (
                    <ActivityIndicator size="small" color="#1a6e3c" />
                  ) : (
                    <>
                      <Ionicons name="download-outline" size={15} color="#1a6e3c" />
                      <Text style={styles.updateBtnText}>Download APK ({updateInfo.version})</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.updateNotesBtn}
                  onPress={() => setShowNotesModal(true)}
                  activeOpacity={0.85}>
                  <Ionicons name="document-text-outline" size={15} color={Palette.white} />
                  <Text style={styles.updateNotesBtnText}>Details</Text>
                </TouchableOpacity>
              </View>
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

          {/* App Version & In-App Update Card */}
          <View style={styles.versionFooterCard}>
            <View style={styles.versionMainRow}>
              <View style={styles.versionLeft}>
                <Ionicons name="shield-checkmark" size={16} color={Palette.primary} />
                <Text style={styles.versionLabel}>
                  RaktSetu <Text style={styles.versionHighlight}>v{currentVersion}</Text>
                </Text>
              </View>

              {/* Status Badge */}
              {checkingUpdate ? (
                <View style={styles.statusCheckingBadge}>
                  <ActivityIndicator size="small" color={Palette.primary} style={{ transform: [{ scale: 0.7 }] }} />
                  <Text style={styles.statusCheckingText}>Checking...</Text>
                </View>
              ) : hasUpdate && updateInfo ? (
                <TouchableOpacity
                  style={styles.statusUpdateBadge}
                  onPress={() => setShowNotesModal(true)}
                  activeOpacity={0.8}>
                  <View style={styles.pulsingDot} />
                  <Text style={styles.statusUpdateText}>{updateInfo.version} Available</Text>
                  <Ionicons name="arrow-up-circle" size={13} color="#b45309" />
                </TouchableOpacity>
              ) : (
                <View style={styles.statusUpToDateBadge}>
                  <Ionicons name="checkmark-circle" size={13} color={Palette.healthy} />
                  <Text style={styles.statusUpToDateText}>Up to date</Text>
                </View>
              )}
            </View>

            {/* Interactive Update Trigger Row */}
            <View style={styles.versionActionRow}>
              <TouchableOpacity
                style={styles.checkUpdatesLink}
                onPress={() => runUpdateCheck(true)}
                disabled={checkingUpdate}
                activeOpacity={0.7}>
                <Ionicons
                  name={checkingUpdate ? 'sync' : 'refresh-circle-outline'}
                  size={15}
                  color={Palette.primary}
                />
                <Text style={styles.checkUpdatesLinkText}>
                  {checkingUpdate ? 'Verifying server...' : 'Check for App Update'}
                </Text>
              </TouchableOpacity>

              {lastChecked && (
                <Text style={styles.lastCheckedText}>Checked at {lastChecked}</Text>
              )}
            </View>
          </View>

          <Text style={styles.bottomDisclaimer}>
            Durg District Blood Center • Live National Health Portal
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* What's New / Release Notes Modal */}
      <Modal
        visible={showNotesModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotesModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <Ionicons name="rocket-outline" size={24} color={Palette.primary} />
              </View>
              <View style={styles.modalTitleWrap}>
                <Text style={styles.modalTitle}>App Update Overview</Text>
                <Text style={styles.modalSubtitle}>
                  Current: v{currentVersion}  ➔  New: {updateInfo?.version || 'Latest'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowNotesModal(false)}
                hitSlop={10}
                style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color={Palette.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalMetaRow}>
              <View style={styles.metaBadge}>
                <Ionicons name="pricetag-outline" size={12} color={Palette.textSecondary} />
                <Text style={styles.metaBadgeText}>{updateInfo?.version || 'v1.0.7'}</Text>
              </View>
              {updateInfo?.fileSize ? (
                <View style={styles.metaBadge}>
                  <Ionicons name="file-tray-full-outline" size={12} color={Palette.textSecondary} />
                  <Text style={styles.metaBadgeText}>{updateInfo.fileSize}</Text>
                </View>
              ) : null}
              {updateInfo?.releaseDate ? (
                <View style={styles.metaBadge}>
                  <Ionicons name="calendar-outline" size={12} color={Palette.textSecondary} />
                  <Text style={styles.metaBadgeText}>{updateInfo.releaseDate}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.modalSectionHeading}>What's Included in This Release:</Text>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalBodyText}>
                {updateInfo?.releaseNotes?.replace(/^#+\s+/gm, '') ||
                  'Bug fixes, speed improvements and latest blood inventory management updates.'}
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalDownloadBtn}
                onPress={() => {
                  setShowNotesModal(false);
                  handleDownloadUpdate();
                }}
                activeOpacity={0.85}
                disabled={downloadingUpdate}>
                {downloadingUpdate ? (
                  <ActivityIndicator size="small" color={Palette.white} />
                ) : (
                  <>
                    <Ionicons name="download" size={16} color={Palette.white} />
                    <Text style={styles.modalDownloadBtnText}>Download & Install APK</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDismissBtn}
                onPress={() => setShowNotesModal(false)}>
                <Text style={styles.modalDismissBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: Spacing.xl,
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
  updateBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.white,
  },
  newBadge: {
    backgroundColor: '#eab308',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  newBadgeText: {
    color: '#78350f',
    fontSize: 9,
    fontWeight: '800',
  },
  updateVersion: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  updateDismiss: {
    padding: 4,
  },
  updateNotes: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 17,
    marginBottom: Spacing.md,
  },
  updateBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  updateBtn: {
    flex: 1,
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
  updateNotesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
  },
  updateNotesBtnText: {
    color: Palette.white,
    fontSize: 13,
    fontWeight: '600',
  },
  // ─── Header & Card ────────────────────────────────────────────────────────
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Palette.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  brandTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 3,
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
    marginTop: Spacing.sm,
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

  // ─── Version Footer Card ──────────────────────────────────────────────────
  versionFooterCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    ...Shadows.subtle,
  },
  versionMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  versionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  versionLabel: {
    fontSize: 13,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  versionHighlight: {
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  statusCheckingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.backgroundSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  statusCheckingText: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  statusUpdateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  statusUpdateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f59e0b',
  },
  statusUpToDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.healthyBg,
    borderColor: Palette.healthyBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  statusUpToDateText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.healthy,
  },
  versionActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
  },
  checkUpdatesLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 2,
  },
  checkUpdatesLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  lastCheckedText: {
    fontSize: 11,
    color: Palette.textMuted,
  },
  bottomDisclaimer: {
    fontSize: 11,
    color: Palette.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
  },

  // ─── What's New Modal ─────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxHeight: '82%',
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  modalTitleWrap: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.md,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.backgroundSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  modalSectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  modalScroll: {
    maxHeight: 200,
    backgroundColor: Palette.backgroundSubtle,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modalBodyText: {
    fontSize: 13,
    lineHeight: 20,
    color: Palette.textPrimary,
  },
  modalFooter: {
    gap: 8,
  },
  modalDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    ...Shadows.subtle,
  },
  modalDownloadBtnText: {
    color: Palette.white,
    fontSize: 14,
    fontWeight: '700',
  },
  modalDismissBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  modalDismissBtnText: {
    color: Palette.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});

