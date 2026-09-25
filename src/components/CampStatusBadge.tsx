import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette } from '../constants/theme';

interface Props { status: string; }

export const CampStatusBadge: React.FC<Props> = ({ status }) => {
  const isLive = status === 'Ongoing';
  const isUpcoming = status === 'Upcoming';
  const bg = isLive ? Palette.healthyBg : isUpcoming ? Palette.moderateBg : Palette.surface;
  const color = isLive ? Palette.healthy : isUpcoming ? Palette.moderate : Palette.textMuted;
  const border = isLive ? Palette.healthyBorder : isUpcoming ? Palette.moderateBorder : Palette.border;

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: border }]}>
      {isLive && <View style={[styles.dot, { backgroundColor: color, shadowColor: color, shadowOpacity: 0.6, shadowRadius: 4, elevation: 2 }]} />}
      <Text style={[styles.text, { color }]}>{isLive ? 'LIVE NOW' : status.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.xs, borderWidth: 1 },
  dot: { width: 6, height: 6, borderRadius: 3, shadowOffset: { width: 0, height: 0 } },
  text: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
});
