import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, GlassStyles, Palette, Shadows, Spacing } from '../src/constants/theme';
import { checkForAppUpdate } from '../src/services/updateService';

export default function ProfileScreen() {
  const router = useRouter();

  const handleSimulateSync = () => {
    Alert.alert('Offline Demo Mode', 'All blood bank data is currently operating fully offline from local storage. Zero network API connection is active.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={20} color={Palette.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Blood Center Admin</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.adminCard}>
          <View style={styles.avatarLarge}>
            <Ionicons name="shield-checkmark" size={26} color={Palette.white} />
          </View>
          <Text style={styles.adminName}>Dr. S. K. Verma</Text>
          <Text style={styles.adminRole}>Blood Center Administrator</Text>
          <Text style={styles.orgText}>District Hospital, Durg, Chhattisgarh</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Facility Accreditation</Text>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Center</Text><Text style={styles.detailVal}>Durg District Blood Center</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>License</Text><Text style={styles.detailVal}>CG/BB/2023/0847</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>NBTC ID</Text><Text style={styles.detailVal}>NBTC-CG-DRG-04</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Category</Text><Text style={styles.detailVal}>District Hospital Blood Bank</Text></View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <View style={styles.statusRow}>
            <View style={styles.dotGreen} />
            <Text style={styles.statusText}>Offline Client Prototype — Fully Functional</Text>
          </View>
          <TouchableOpacity style={styles.checkBtn} onPress={handleSimulateSync} activeOpacity={0.8}>
            <Text style={styles.checkBtnText}>Diagnostics Check</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.checkBtn, styles.updateBtn]} onPress={() => checkForAppUpdate(true)} activeOpacity={0.8}>
            <Ionicons name="cloud-download-outline" size={14} color={Palette.primary} />
            <Text style={[styles.checkBtnText, { color: Palette.primary }]}>Check for App Updates</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionFooter}>RaktSetu Mobile v1.0.0 — Durg, Chhattisgarh</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screenPadding, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Palette.borderSubtle },
  backBtn: { width: 36, height: 36, borderRadius: BorderRadius.md, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: Palette.textPrimary },
  headerSpacer: { width: 36 },
  pressed: { opacity: 0.6 },
  scrollContainer: { flex: 1 },
  contentContainer: { padding: Spacing.screenPadding, paddingBottom: 100, gap: Spacing.md },
  adminCard: { ...GlassStyles.cardElevated, padding: Spacing.xl, alignItems: 'center' },
  avatarLarge: { width: 56, height: 56, borderRadius: 28, backgroundColor: Palette.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12, ...Shadows.glow },
  adminName: { fontSize: 18, fontWeight: '800', color: Palette.textPrimary },
  adminRole: { fontSize: 13, color: Palette.primary, fontWeight: '600', marginTop: 2 },
  orgText: { fontSize: 12, color: Palette.textMuted, marginTop: 4 },
  sectionCard: { ...GlassStyles.card, padding: Spacing.lg },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Palette.textPrimary, marginBottom: Spacing.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Palette.borderSubtle },
  detailLabel: { fontSize: 12, color: Palette.textMuted, fontWeight: '500' },
  detailVal: { fontSize: 12, color: Palette.textPrimary, fontWeight: '600' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 4 },
  dotGreen: { width: 7, height: 7, borderRadius: 4, backgroundColor: Palette.healthy, shadowColor: Palette.healthy, shadowOpacity: 0.6, shadowRadius: 4, shadowOffset: { width: 0, height: 0 }, elevation: 2 },
  statusText: { fontSize: 12, color: Palette.textSecondary },
  checkBtn: { backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, paddingVertical: 10, borderRadius: BorderRadius.md, alignItems: 'center', marginTop: 8, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  checkBtnText: { fontSize: 12, fontWeight: '700', color: Palette.textPrimary },
  updateBtn: { backgroundColor: Palette.primarySurface, borderColor: Palette.borderAccent },
  versionFooter: { fontSize: 11, color: Palette.textMuted, textAlign: 'center', marginTop: Spacing.sm },
});
