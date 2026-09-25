import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette } from '../constants/theme';
import { StockStatus } from '../types/blood';

interface Props {
  status: StockStatus;
  size?: 'small' | 'medium';
}

export const StockStatusBadge: React.FC<Props> = ({ status, size = 'medium' }) => {
  const getStyle = () => {
    switch (status) {
      case 'Healthy':
        return {
          bg: Palette.healthyBg,
          text: Palette.healthy,
          border: Palette.healthyBorder,
          label: 'Healthy',
        };
      case 'Moderate':
        return {
          bg: Palette.moderateBg,
          text: Palette.moderate,
          border: Palette.moderateBorder,
          label: 'Moderate',
        };
      case 'Low':
        return {
          bg: Palette.warningBg,
          text: Palette.warning,
          border: Palette.warningBorder,
          label: 'Low',
        };
      case 'Critical':
        return {
          bg: Palette.criticalBg,
          text: Palette.critical,
          border: Palette.criticalBorder,
          label: 'Critical',
        };
    }
  };

  const current = getStyle();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: current.bg, borderColor: current.border },
        isSmall && styles.badgeSmall,
      ]}>
      <View style={[styles.dot, { backgroundColor: current.text }]} />
      <Text style={[styles.text, { color: current.text }, isSmall && styles.textSmall]}>
        {current.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 5,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
  textSmall: {
    fontSize: 10,
  },
});
