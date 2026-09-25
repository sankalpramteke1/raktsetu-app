import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../constants/theme';

interface Props {
  collectedUnits?: number;
  issuedUnits?: number;
  newDonors?: number;
  pendingRequests?: number;
}

export const TodayOverviewCard: React.FC<Props> = ({
  collectedUnits = 24,
  issuedUnits = 17,
  newDonors = 8,
  pendingRequests = 7,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Today's Overview</Text>
        <View style={styles.dateBadge}>
          <Ionicons name="time-outline" size={11} color={Palette.textMuted} />
          <Text style={styles.dateText}>Live Sync</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.cell}>
          <View style={[styles.iconWrap, { backgroundColor: Palette.healthyBg }]}>
            <Ionicons name="water" size={16} color={Palette.healthy} />
          </View>
          <Text style={styles.metricVal}>{collectedUnits}</Text>
          <Text style={styles.metricLabel}>Units Collected</Text>
        </View>

        <View style={styles.dividerV} />

        <View style={styles.cell}>
          <View style={[styles.iconWrap, { backgroundColor: Palette.issuedBg }]}>
            <Ionicons name="arrow-redo" size={16} color={Palette.issued} />
          </View>
          <Text style={styles.metricVal}>{issuedUnits}</Text>
          <Text style={styles.metricLabel}>Units Issued</Text>
        </View>

        <View style={styles.dividerV} />

        <View style={styles.cell}>
          <View style={[styles.iconWrap, { backgroundColor: Palette.moderateBg }]}>
            <Ionicons name="person-add" size={16} color={Palette.moderate} />
          </View>
          <Text style={styles.metricVal}>{newDonors}</Text>
          <Text style={styles.metricLabel}>New Donors</Text>
        </View>

        <View style={styles.dividerV} />

        <View style={styles.cell}>
          <View style={[styles.iconWrap, { backgroundColor: Palette.warningBg }]}>
            <Ionicons name="hourglass" size={16} color={Palette.warning} />
          </View>
          <Text style={[styles.metricVal, { color: Palette.warning }]}>{pendingRequests}</Text>
          <Text style={styles.metricLabel}>Pending Reqs</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dateText: {
    fontSize: 11,
    color: Palette.textMuted,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  metricLabel: {
    fontSize: 10,
    color: Palette.textMuted,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  dividerV: {
    width: 1,
    height: 36,
    backgroundColor: Palette.borderSubtle,
  },
});
