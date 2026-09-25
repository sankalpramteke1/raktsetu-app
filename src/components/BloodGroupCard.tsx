import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../constants/theme';
import { BloodStockItem } from '../types/blood';
import { StockStatusBadge } from './StockStatusBadge';

interface Props {
  item: BloodStockItem;
  compact?: boolean;
}

export const BloodGroupCard: React.FC<Props> = ({ item, compact = false }) => {
  const router = useRouter();

  const ratio = Math.min(Math.round((item.units / item.optimalLevel) * 100), 100);

  const getStatusColor = () => {
    switch (item.status) {
      case 'Healthy':
        return Palette.healthy;
      case 'Moderate':
        return Palette.moderate;
      case 'Low':
        return Palette.warning;
      case 'Critical':
        return Palette.critical;
    }
  };

  const handlePress = () => {
    router.push({
      pathname: '/stock/[bloodGroup]',
      params: { bloodGroup: encodeURIComponent(item.bloodGroup) },
    });
  };

  if (compact) {
    return (
      <Pressable
        style={({ pressed }) => [styles.pillCard, pressed && styles.pressed]}
        onPress={handlePress}>
        <View style={styles.pillTop}>
          <Text style={styles.pillGroup}>{item.bloodGroup}</Text>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        </View>
        <Text style={styles.pillUnits}>{item.units}</Text>
        <Text style={styles.pillLabel}>units</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={handlePress}>
      <View style={styles.cardHeader}>
        <View style={styles.groupBadge}>
          <Text style={styles.groupText}>{item.bloodGroup}</Text>
        </View>

        <View style={styles.centerCol}>
          <View style={styles.unitsRow}>
            <Text style={styles.unitsNumber}>{item.units}</Text>
            <Text style={styles.unitsUnit}>Units available</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.max(ratio, 8)}%`, backgroundColor: getStatusColor() },
              ]}
            />
          </View>
        </View>

        <View style={styles.rightCol}>
          <StockStatusBadge status={item.status} size="small" />
          <Ionicons
            name="chevron-forward"
            size={16}
            color={Palette.textMuted}
            style={styles.chevron}
          />
        </View>
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
    borderColor: Palette.borderLight,
    ...Shadows.card,
    marginBottom: Spacing.sm + 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupBadge: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Palette.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  groupText: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.primary,
    letterSpacing: -0.3,
  },
  centerCol: {
    flex: 1,
  },
  unitsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
    marginBottom: 8,
  },
  unitsNumber: {
    fontSize: 21,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  unitsUnit: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  progressTrack: {
    height: 5,
    backgroundColor: Palette.borderSubtle,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 6,
  },
  chevron: {
    marginTop: 2,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  pillCard: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    alignItems: 'center',
    ...Shadows.card,
  },
  pillTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  pillGroup: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  pillUnits: {
    fontSize: 19,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  pillLabel: {
    fontSize: 11,
    color: Palette.textMuted,
    fontWeight: '500',
    marginTop: 1,
  },
});
