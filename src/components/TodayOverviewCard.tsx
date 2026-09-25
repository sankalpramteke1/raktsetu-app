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
  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerTitleRow}>
          <View style={styles.pulseIndicator} />
          <Text style={styles.cardTitle}>Today's Operational Pulse</Text>
        </View>
        <View style={styles.dateBadge}>
          <Ionicons name="calendar-outline" size={12} color={Palette.textSecondary} />
          <Text style={styles.dateText}>{todayStr}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.statItem}>
          <View style={[styles.iconWrap, { backgroundColor: Palette.healthyBg }]}>
            <Ionicons name="arrow-down-circle" size={18} color={Palette.healthy} />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statVal}>{collectedUnits}</Text>
            <Text style={styles.statLbl}>Units Collected</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconWrap, { backgroundColor: Palette.issuedBg }]}>
            <Ionicons name="arrow-up-circle" size={18} color={Palette.issued} />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statVal}>{issuedUnits}</Text>
            <Text style={styles.statLbl}>Units Issued</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconWrap, { backgroundColor: Palette.primarySurface }]}>
            <Ionicons name="people" size={18} color={Palette.primary} />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statVal}>{newDonors}</Text>
            <Text style={styles.statLbl}>New Donors</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconWrap, { backgroundColor: Palette.moderateBg }]}>
            <Ionicons name="git-pull-request" size={18} color={Palette.moderate} />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statVal}>{pendingRequests}</Text>
            <Text style={styles.statLbl}>Pending Requests</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    ...Shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.healthy,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.backgroundSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Palette.background,
    padding: 10,
    borderRadius: BorderRadius.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  statLbl: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.textMuted,
    marginTop: 1,
  },
});
