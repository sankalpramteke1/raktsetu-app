import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { BorderRadius, Palette, Spacing } from '../constants/theme';

interface Props<T extends string> {
  options: { label: string; value: T }[];
  selected: T;
  onSelect: (v: T) => void;
}

export function FilterChips<T extends string>({ options, selected, onSelect }: Props<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      {options.map((opt) => {
        const isActive = selected === opt.value;
        return (
          <Pressable key={opt.value} style={[styles.chip, isActive && styles.chipActive]} onPress={() => onSelect(opt.value)}>
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexDirection: 'row', gap: 6, paddingVertical: 6 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  chipActive: {
    backgroundColor: Palette.primarySurface,
    borderColor: Palette.borderAccent,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: Palette.textSecondary },
  chipTextActive: { color: Palette.primary, fontWeight: '700' },
});
