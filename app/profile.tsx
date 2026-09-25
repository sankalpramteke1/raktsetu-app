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

export default function ProfileScreen() {
  const router = useRouter();

  const handleSimulateSync = () => {
    Alert.alert(
      'Offline Demo Mode',
      'All blood bank data is currently operating fully offline from local storage. Zero network API connection is active.'
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
            <Ionicons name="shield-checkmark" size={26} color={Palette.white} />
          </View>
          <Text style={styles.adminName}>Dr. S. K. Verma</Text>
          <Text style={styles.adminRole}>Blood Center Administrator</Text>
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
            <Text style={styles.detailVal}>0788-2322333 · Ext 204</Text>
          </View>
        </View>

        {/* Quick Module Links */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Quick Links</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/stock')}>
            <Text style={styles.menuText}>Blood Stock Inventory</Text>
            <Ionicons name="chevron-forward" size={15} color={Palette.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/donors')}>
            <Text style={styles.menuText}>Regular Donors Registry</Text>
            <Ionicons name="chevron-forward" size={15} color={Palette.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/requests')}>
            <Text style={styles.menuText}>Ward Requisitions</Text>
            <Ionicons name="chevron-forward" size={15} color={Palette.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/notifications')}>
            <Text style={styles.menuText}>Operational Alerts</Text>
            <Ionicons name="chevron-forward" size={15} color={Palette.textMuted} />
          </TouchableOpacity>
        </View>

        {/* System Diagnostics */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>System Status</Text>

          <View style={styles.statusRow}>
            <View style={styles.dotGreen} />
            <Text style={styles.statusText}>Offline Client Prototype · Fully Functional</Text>
          </View>

          <TouchableOpacity
            style={styles.checkBtn}
            onPress={handleSimulateSync}
            activeOpacity={0.8}>
            <Text style={styles.checkBtnText}>Diagnostics Check</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionFooter}>
          RaktSetu Mobile v1.0.0 · Durg, Chhattisgarh
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
    borderBottomColor: Palette.borderSubtle,
    backgroundColor: Palette.white,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  headerSpacer: {
    width: 36,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  contentContainer: {
    padding: Spacing.screenPadding,
    paddingBottom: 32,
    gap: 10,
  },
  adminCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
  },
  avatarLarge: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  adminName: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  adminRole: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  orgText: {
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  menuText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
  },
  dotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.healthy,
  },
  statusText: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  checkBtn: {
    backgroundColor: Palette.borderSubtle,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  checkBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  versionFooter: {
    fontSize: 11,
    color: Palette.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
