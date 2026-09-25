import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../constants/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  iconName,
  iconColor = Palette.primary,
  iconBgColor = Palette.primarySurface,
  onPress,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && onPress && styles.pressed]}
      onPress={onPress}
      disabled={!onPress}>
      <View style={[styles.iconWrap, { backgroundColor: iconBgColor }]}>
        <Ionicons name={iconName} size={16} color={iconColor} />
      </View>
      <Text style={styles.valText}>{value}</Text>
      <Text style={styles.titleText}>{title}</Text>
      {subtitle && <Text style={styles.subText}>{subtitle}</Text>}
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
    flex: 1,
    minWidth: 130,
  },
  pressed: {
    opacity: 0.8,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  valText: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textSecondary,
    marginTop: 2,
  },
  subText: {
    fontSize: 10,
    color: Palette.textMuted,
    marginTop: 1,
  },
});
