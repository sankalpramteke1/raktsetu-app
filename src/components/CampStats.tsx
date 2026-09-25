import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../constants/theme';
import { CampSummaryStats } from '../types/camp';

interface Props {
  stats: CampSummaryStats;
}

export const CampStats: React.FC<Props> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <View style={styles.col}>
        <Text style={[styles.val, { color: Palette.moderate }]}>{stats.upcoming}</Text>
        <Text style={styles.label}>Upcoming</Text>
      </View>

      <View style={styles.dividerV} />

      <View style={styles.col}>
        <Text style={[styles.val, { color: Palette.healthy }]}>{stats.ongoing}</Text>
        <Text style={styles.label}>Ongoing</Text>
      </View>

      <View style={styles.dividerV} />

      <View style={styles.col}>
        <Text style={styles.val}>{stats.completed}</Text>
        <Text style={styles.label}>Completed</Text>
      </View>

      <View style={styles.dividerV} />

      <View style={styles.col}>
        <Text style={[styles.val, { color: Palette.primary }]}>{stats.totalUnits}</Text>
        <Text style={styles.label}>Total Units</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
    marginBottom: Spacing.sm,
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  val: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  label: {
    fontSize: 10,
    color: Palette.textMuted,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  dividerV: {
    width: 1,
    height: 24,
    backgroundColor: Palette.borderSubtle,
  },
});
