import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette } from '../constants/theme';
import { StockStatus } from '../types/blood';

interface Props {
  status: StockStatus;
  size?: 'small' | 'medium';
}

export const StockStatusBadge: React.FC<Props> = ({ status, size = 'medium' }) => {
  const getColors = () => {
    switch (status) {
      case 'Healthy':
        return { bg: Palette.healthyBg, text: Palette.healthy, border: Palette.healthyBorder };
      case 'Moderate':
        return { bg: Palette.moderateBg, text: Palette.moderate, border: Palette.moderateBorder };
      case 'Low':
        return { bg: Palette.warningBg, text: Palette.warning, border: Palette.warningBorder };
      case 'Critical':
        return { bg: Palette.criticalBg, text: Palette.critical, border: Palette.criticalBorder };
      default:
        return { bg: Palette.borderLight, text: Palette.textSecondary, border: Palette.border };
    }
  };

  const colors = getColors();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg, borderColor: colors.border },
        isSmall && styles.badgeSmall,
      ]}>
      <View style={[styles.dot, { backgroundColor: colors.text }]} />
      <Text style={[styles.text, { color: colors.text }, isSmall && styles.textSmall]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
  textSmall: {
    fontSize: 11,
    fontWeight: '600',
  },
});
