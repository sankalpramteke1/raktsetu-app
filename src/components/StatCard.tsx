import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, GlassStyles, Palette, Spacing } from '../constants/theme';

interface Props { value: string | number; label: string; color?: string; }

export const StatCard: React.FC<Props> = ({ value, label, color }) => (
  <View style={styles.card}>
    <Text style={[styles.value, color ? { color } : null]}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { flex: 1, ...GlassStyles.card, paddingVertical: 14, paddingHorizontal: Spacing.md },
  value: { fontSize: 22, fontWeight: '800', color: Palette.textPrimary, letterSpacing: -0.4 },
  label: { fontSize: 10, color: Palette.textMuted, fontWeight: '600', marginTop: 3, lineHeight: 13 },
});
