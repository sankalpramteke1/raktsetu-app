import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette } from '../constants/theme';
import { CampStatus } from '../types/camp';

interface Props {
  status: CampStatus;
  size?: 'small' | 'medium';
}

export const CampStatusBadge: React.FC<Props> = ({ status, size = 'medium' }) => {
  const getStyle = () => {
    switch (status) {
      case 'Ongoing':
        return {
          bg: Palette.healthyBg,
          text: Palette.healthy,
          border: Palette.healthyBorder,
          label: 'Live Now',
          isLive: true,
        };
      case 'Upcoming':
        return {
          bg: Palette.moderateBg,
          text: Palette.moderate,
          border: Palette.moderateBorder,
          label: 'Upcoming',
          isLive: false,
        };
      case 'Completed':
        return {
          bg: Palette.backgroundSubtle,
          text: Palette.textSecondary,
          border: Palette.border,
          label: 'Completed',
          isLive: false,
        };
      case 'Cancelled':
        return {
          bg: Palette.criticalBg,
          text: Palette.critical,
          border: Palette.criticalBorder,
          label: 'Cancelled',
          isLive: false,
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
      {current.isLive && <View style={styles.livePulse} />}
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
    gap: 4,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.healthy,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
  textSmall: {
    fontSize: 10,
  },
});
