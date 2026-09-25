import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassStyles, Palette, Spacing } from '../constants/theme';

interface Props { collected: number; issued: number; pending: number; }

export const TodayOverviewCard: React.FC<Props> = ({ collected, issued, pending }) => (
  <View style={styles.card}>
    <Text style={styles.title}>Today's Overview</Text>
    <View style={styles.row}>
      <View style={styles.item}><Text style={[styles.val, { color: Palette.healthy }]}>{collected}</Text><Text style={styles.label}>Collected</Text></View>
      <View style={styles.divider} />
      <View style={styles.item}><Text style={[styles.val, { color: Palette.issued }]}>{issued}</Text><Text style={styles.label}>Issued</Text></View>
      <View style={styles.divider} />
      <View style={styles.item}><Text style={[styles.val, { color: Palette.warning }]}>{pending}</Text><Text style={styles.label}>Pending</Text></View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { ...GlassStyles.card, padding: Spacing.md },
  title: { fontSize: 13, fontWeight: '700', color: Palette.textPrimary, marginBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  item: { flex: 1, alignItems: 'center' },
  val: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  label: { fontSize: 10, color: Palette.textMuted, fontWeight: '600', marginTop: 2 },
  divider: { width: 1, height: 24, backgroundColor: Palette.borderSubtle },
});
