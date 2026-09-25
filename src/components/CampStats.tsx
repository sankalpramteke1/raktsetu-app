import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, GlassStyles, Palette, Spacing } from '../constants/theme';

interface Props { stats: any; }

export const CampStats: React.FC<Props> = ({ stats }) => {
  if (!stats) return null;
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.val}>{stats.total ?? 0}</Text>
        <Text style={styles.label}>Total</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statItem}>
        <Text style={[styles.val, { color: Palette.healthy }]}>{stats.ongoing ?? 0}</Text>
        <Text style={styles.label}>Active</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statItem}>
        <Text style={[styles.val, { color: Palette.moderate }]}>{stats.upcoming ?? 0}</Text>
        <Text style={styles.label}>Upcoming</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statItem}>
        <Text style={[styles.val, { color: Palette.textMuted }]}>{stats.completed ?? 0}</Text>
        <Text style={styles.label}>Done</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...GlassStyles.card, flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  statItem: { flex: 1, alignItems: 'center' },
  val: { fontSize: 18, fontWeight: '800', color: Palette.textPrimary, letterSpacing: -0.3 },
  label: { fontSize: 10, color: Palette.textMuted, fontWeight: '600', marginTop: 2 },
  divider: { width: 1, height: 24, backgroundColor: Palette.borderSubtle },
});
