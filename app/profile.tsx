import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../src/constants/theme';
import { checkForAppUpdate } from '../src/services/updateService';

export default function ProfileScreen() {
  const router = useRouter();

  const handleSimulateSync = () => {
    Alert.alert(
      'System Diagnostics',
      'All local database tables verified:\n\n• Blood Stock: 8 Groups synced\n• Active Camps: 3 Scheduled\n• Requisitions: 7 In Queue\n• Storage Temp: 4.2°C (Optimal)',
      [{ text: 'Dismiss', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          onPress={() => router.back()}
          hitSlop={8}>
          <Ionicons name="arrow-back" size={20} color={Palette.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Blood Center Admin</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Administrator Profile Card */}
        <View style={styles.adminCard}>
          <View style={styles.avatarLarge}>
            <Ionicons name="shield-checkmark" size={28} color={Palette.white} />
          </View>
          <Text style={styles.adminName}>Dr. S. K. Verma</Text>
          <Text style={styles.adminRole}>Chief Medical Officer & Administrator</Text>
          <Text style={styles.orgText}>District Hospital, Durg, Chhattisgarh</Text>
        </View>

        {/* Facility Credentials */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Facility Accreditation</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Center</Text>
            <Text style={styles.detailVal}>Durg District Blood Center</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>FDA License</Text>
            <Text style={styles.detailVal}>CG/BB/2018/042-R</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cold Storage</Text>
            <Text style={styles.detailVal}>3 Refrigerator Units (350 U Cap)</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Emergency Desk</Text>
            <Text style={styles.detailVal}>0788-2322333 • Ext 204</Text>
          </View>
        </View>

        {/* Quick Module Links */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Quick Access Modules</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/stock')}>
            <View style={styles.menuLeft}>
              <Ionicons name="water" size={17} color={Palette.primary} />
              <Text style={styles.menuText}>Blood Stock Inventory</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Palette.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/donors')}>
            <View style={styles.menuLeft}>
              <Ionicons name="people" size={17} color={Palette.healthy} />
              <Text style={styles.menuText}>Regular Donors Registry</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Palette.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/requests')}>
            <View style={styles.menuLeft}>
              <Ionicons name="document-text" size={17} color={Palette.moderate} />
              <Text style={styles.menuText}>Ward Requisitions</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Palette.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/notifications')}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications" size={17} color={Palette.warning} />
              <Text style={styles.menuText}>Operational Alerts</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Palette.textMuted} />
          </TouchableOpacity>
        </View>

        {/* System Diagnostics & Update Checker */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>System Status & App Updates</Text>

          <View style={styles.statusRow}>
            <View style={styles.dotGreen} />
            <Text style={styles.statusText}>Live Sync Active • All Systems Operational</Text>
          </View>

          <TouchableOpacity
            style={styles.checkBtn}
            onPress={handleSimulateSync}
            activeOpacity={0.8}>
            <Ionicons name="pulse" size={16} color={Palette.textPrimary} style={{ marginRight: 6 }} />
            <Text style={styles.checkBtnText}>Run Diagnostics Check</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.checkBtn, styles.updateBtn]}
            onPress={() => checkForAppUpdate(true)}
            activeOpacity={0.8}>
            <Ionicons name="cloud-download" size={16} color={Palette.white} style={{ marginRight: 6 }} />
            <Text style={[styles.checkBtnText, { color: Palette.white }]}>Check for App Updates</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionFooter}>
          RaktSetu Mobile v1.0.0 • Durg District Blood Center
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
    backgroundColor: Palette.white,
    ...Shadows.subtle,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.backgroundSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderLight,
  },
  pressed: {
    opacity: 0.7,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 38,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  contentContainer: {
    padding: Spacing.screenPadding,
    paddingBottom: 36,
    gap: 12,
  },
  adminCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderLight,
    ...Shadows.card,
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.floating,
  },
  adminName: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  adminRole: {
    fontSize: 13,
    color: Palette.textSecondary,
    fontWeight: '600',
    marginTop: 3,
  },
  orgText: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md + 2,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    ...Shadows.card,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  detailLabel: {
    fontSize: 13,
    color: Palette.textMuted,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginVertical: 4,
  },
  dotGreen: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Palette.healthy,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  checkBtn: {
    flexDirection: 'row',
    backgroundColor: Palette.backgroundSubtle,
    paddingVertical: 11,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  updateBtn: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
    ...Shadows.subtle,
  },
  checkBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  versionFooter: {
    fontSize: 12,
    color: Palette.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
