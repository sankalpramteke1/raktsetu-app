import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, GlassStyles, Palette, Spacing } from '../constants/theme';

interface Props { bloodGroup: string; units: number; status: string; }

export const LowStockAlertCard: React.FC<Props> = ({ bloodGroup, units, status }) => (
  <View style={styles.card}>
    <View style={styles.badge}><Text style={styles.badgeText}>{bloodGroup}</Text></View>
    <View style={styles.info}>
      <Text style={styles.units}>{units} units remaining</Text>
      <Text style={styles.status}>{status} level</Text>
    </View>
    <Ionicons name="alert-circle" size={18} color={status === 'Critical' ? Palette.critical : Palette.warning} />
  </View>
);

const styles = StyleSheet.create({
  card: { ...GlassStyles.card, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.sm, borderColor: Palette.criticalBorder },
  badge: { width: 40, height: 40, borderRadius: BorderRadius.sm, backgroundColor: Palette.primarySurface, borderWidth: 1, borderColor: Palette.borderAccent, justifyContent: 'center', alignItems: 'center' },
  badgeText: { fontSize: 14, fontWeight: '800', color: Palette.primary },
  info: { flex: 1 },
  units: { fontSize: 14, fontWeight: '700', color: Palette.textPrimary },
  status: { fontSize: 11, color: Palette.textMuted, marginTop: 1, textTransform: 'capitalize' },
});
