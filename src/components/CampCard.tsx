import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../constants/theme';
import { BloodDonationCamp } from '../types/camp';
import { CampStatusBadge } from './CampStatusBadge';

interface Props {
  camp: BloodDonationCamp;
}

export const CampCard: React.FC<Props> = ({ camp }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/camps/[id]',
      params: { id: camp.id },
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        camp.status === 'Ongoing' && styles.ongoingAccent,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}>
      {/* Top Row: Camp Type Tag & Status Badge */}
      <View style={styles.topRow}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{camp.type}</Text>
        </View>
        <CampStatusBadge status={camp.status} size="small" />
      </View>

      {/* Camp Name */}
      <View style={styles.nameRow}>
        <View style={styles.bloodIconCircle}>
          <Ionicons name="water" size={14} color={Palette.primary} />
        </View>
        <Text style={styles.campName} numberOfLines={1}>
          {camp.name}
        </Text>
      </View>

      {/* Date & Time */}
      <View style={styles.scheduleRow}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={13} color={Palette.textMuted} />
          <Text style={styles.metaText}>{camp.date}</Text>
        </View>
        <Text style={styles.dotSep}>·</Text>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={13} color={Palette.textMuted} />
          <Text style={styles.metaText}>
            {camp.startTime} – {camp.endTime}
          </Text>
        </View>
      </View>

      {/* Venue / Location */}
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={13} color={Palette.textMuted} />
        <Text style={styles.locationText} numberOfLines={1}>
          {camp.venue}, {camp.city}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom Row: Registered & Collected Metrics + Chevron */}
      <View style={styles.bottomRow}>
        <View style={styles.metricsGroup}>
          <View style={styles.metricItem}>
            <Ionicons name="people-outline" size={13} color={Palette.textSecondary} />
            <Text style={styles.metricText}>
              <Text style={styles.metricBold}>{camp.participants.length}</Text> registered
            </Text>
          </View>

          <Text style={styles.dotSep}>·</Text>

          <View style={styles.metricItem}>
            <Ionicons name="medkit-outline" size={13} color={Palette.primary} />
            <Text style={styles.metricText}>
              <Text style={[styles.metricBold, { color: Palette.primary }]}>
                {camp.unitsCollected}
              </Text>{' '}
              units collected
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={15} color={Palette.textMuted} />
      </View>
    </Pressable>
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
    marginBottom: Spacing.sm,
  },
  ongoingAccent: {
    borderLeftWidth: 3,
    borderLeftColor: Palette.healthy,
  },
  pressed: {
    opacity: 0.75,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: Palette.borderSubtle,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.textSecondary,
    textTransform: 'uppercase',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  bloodIconCircle: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  campName: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
    flex: 1,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: Palette.textMuted,
    flex: 1,
  },
  dotSep: {
    marginHorizontal: 6,
    color: Palette.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.borderSubtle,
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  metricBold: {
    fontWeight: '800',
    color: Palette.textPrimary,
  },
});
