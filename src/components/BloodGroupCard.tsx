import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, GlassStyles, Palette, Shadows, Spacing } from '../constants/theme';
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
      case 'Healthy': return Palette.healthy;
      case 'Moderate': return Palette.moderate;
      case 'Low': return Palette.warning;
      case 'Critical': return Palette.critical;
    }
  };

  const handlePress = () => {
    router.push({ pathname: '/stock/[bloodGroup]', params: { bloodGroup: encodeURIComponent(item.bloodGroup) } });
  };

  if (compact) {
    return (
      <Pressable style={({ pressed }) => [styles.pillCard, pressed && styles.pressed]} onPress={handlePress}>
        <View style={styles.pillTop}>
          <Text style={styles.pillGroup}>{item.bloodGroup}</Text>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(), shadowColor: getStatusColor(), shadowOpacity: 0.6, shadowRadius: 4, elevation: 2 }]} />
        </View>
        <Text style={styles.pillUnits}>{item.units}</Text>
        <Text style={styles.pillLabel}>units</Text>
      </Pressable>
    );
  }

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={handlePress}>
      <View style={styles.cardHeader}>
        <View style={[styles.groupBadge, { shadowColor: getStatusColor() }]}>
          <Text style={styles.groupText}>{item.bloodGroup}</Text>
        </View>
        <View style={styles.centerCol}>
          <View style={styles.unitsRow}>
            <Text style={styles.unitsNumber}>{item.units}</Text>
            <Text style={styles.unitsUnit}>Units available</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${Math.max(ratio, 8)}%`, backgroundColor: getStatusColor() }]} />
          </View>
        </View>
        <View style={styles.rightCol}>
          <StockStatusBadge status={item.status} size="small" />
          <Ionicons name="chevron-forward" size={16} color={Palette.textMuted} style={styles.chevron} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    ...GlassStyles.card,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  groupBadge: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Palette.primarySurface,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  groupText: { fontSize: 18, fontWeight: '800', color: Palette.primary },
  centerCol: { flex: 1 },
  unitsRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5, marginBottom: 6 },
  unitsNumber: { fontSize: 22, fontWeight: '800', color: Palette.textPrimary, letterSpacing: -0.3 },
  unitsUnit: { fontSize: 12, color: Palette.textMuted, fontWeight: '500' },
  progressTrack: { height: 4, backgroundColor: Palette.borderSubtle, borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 2 },
  rightCol: { alignItems: 'flex-end', justifyContent: 'space-between', gap: 6 },
  chevron: { marginTop: 2 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  pillCard: {
    flex: 1,
    minWidth: '22%',
    ...GlassStyles.card,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  pillTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 4 },
  pillGroup: { fontSize: 15, fontWeight: '800', color: Palette.textPrimary },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  pillUnits: { fontSize: 20, fontWeight: '800', color: Palette.textPrimary, letterSpacing: -0.3 },
  pillLabel: { fontSize: 10, color: Palette.textMuted, fontWeight: '500' },
});
