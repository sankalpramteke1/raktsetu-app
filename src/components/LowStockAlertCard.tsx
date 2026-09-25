import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../constants/theme';

interface Props {
  group?: string;
  units?: number;
}

export const LowStockAlertCard: React.FC<Props> = ({
  group = 'O-',
  units = 6,
}) => {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
      onPress={() =>
        router.push({
          pathname: '/stock/[bloodGroup]',
          params: { bloodGroup: encodeURIComponent(group) },
        })
      }>
      <View style={styles.leftGroup}>
        <View style={styles.iconCircle}>
          <Ionicons name="warning" size={14} color={Palette.critical} />
        </View>
        <Text style={styles.alertText}>
          Low stock · <Text style={styles.boldGroup}>{group}</Text> ({units} units left)
        </Text>
      </View>

      <View style={styles.actionRow}>
        <Text style={styles.actionText}>Restock</Text>
        <Ionicons name="chevron-forward" size={13} color={Palette.primary} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Palette.criticalBg,
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.criticalBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.xs,
    ...Shadows.subtle,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Palette.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    fontSize: 13,
    color: Palette.textPrimary,
    fontWeight: '600',
  },
  boldGroup: {
    fontWeight: '800',
    color: Palette.critical,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 8,
    backgroundColor: Palette.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
});
