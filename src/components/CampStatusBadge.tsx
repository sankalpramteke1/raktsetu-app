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
        return { bg: Palette.healthyBg, text: Palette.healthy, border: Palette.healthyBorder };
      case 'Upcoming':
        return { bg: Palette.moderateBg, text: Palette.moderate, border: Palette.moderateBorder };
      case 'Completed':
        return { bg: Palette.borderSubtle, text: Palette.textSecondary, border: Palette.border };
      case 'Cancelled':
        return { bg: Palette.criticalBg, text: Palette.critical, border: Palette.criticalBorder };
    }
  };

  const style = getStyle();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: style.bg, borderColor: style.border },
        isSmall && styles.badgeSmall,
      ]}>
      {status === 'Ongoing' && <View style={styles.liveDot} />}
      <Text style={[styles.text, { color: style.text }, isSmall && styles.textSmall]}>
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
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 4,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.healthy,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  textSmall: {
    fontSize: 10,
  },
});
