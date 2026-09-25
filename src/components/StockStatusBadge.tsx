import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette } from '../constants/theme';
import { StockStatus } from '../types/blood';

interface Props { status: StockStatus; size?: 'small' | 'medium'; }

export const StockStatusBadge: React.FC<Props> = ({ status, size = 'medium' }) => {
  const getColors = () => {
    switch (status) {
      case 'Healthy': return { bg: Palette.healthyBg, text: Palette.healthy, border: Palette.healthyBorder };
      case 'Moderate': return { bg: Palette.moderateBg, text: Palette.moderate, border: Palette.moderateBorder };
      case 'Low': return { bg: Palette.warningBg, text: Palette.warning, border: Palette.warningBorder };
      case 'Critical': return { bg: Palette.criticalBg, text: Palette.critical, border: Palette.criticalBorder };
    }
  };
  const c = getColors();
  const isSmall = size === 'small';
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }, isSmall && styles.badgeSmall]}>
      <View style={[styles.dot, { backgroundColor: c.text, shadowColor: c.text, shadowOpacity: 0.5, shadowRadius: 3, elevation: 2 }]} />
      <Text style={[styles.text, { color: c.text }, isSmall && styles.textSmall]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full, borderWidth: 1 },
  badgeSmall: { paddingHorizontal: 6, paddingVertical: 2, gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, shadowOffset: { width: 0, height: 0 } },
  text: { fontSize: 11, fontWeight: '700' },
  textSmall: { fontSize: 10 },
});
