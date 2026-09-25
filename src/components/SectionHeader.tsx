import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette, Spacing } from '../constants/theme';

interface Props { title: string; subtitle?: string; }

export const SectionHeader: React.FC<Props> = ({ title, subtitle }) => (
  <View style={styles.container}>
    <View style={styles.accent} />
    <View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: Spacing.md, marginBottom: Spacing.sm },
  accent: { width: 3, height: 18, borderRadius: 2, backgroundColor: Palette.primary },
  title: { fontSize: 15, fontWeight: '700', color: Palette.textPrimary, letterSpacing: -0.2 },
  subtitle: { fontSize: 11, color: Palette.textMuted, marginTop: 1 },
});
