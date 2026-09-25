import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../constants/theme';

interface FilterOption<T> {
  label: string;
  value: T;
  badge?: number;
}

interface FilterChipsProps<T> {
  options: FilterOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

export function FilterChips<T extends string>({
  options,
  selected,
  onSelect,
}: FilterChipsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <Pressable
            key={option.value}
            style={({ pressed }) => [
              styles.chip,
              isSelected ? styles.chipSelected : styles.chipUnselected,
              pressed && styles.pressed,
            ]}
            onPress={() => onSelect(option.value)}>
            <Text
              style={[
                styles.chipLabel,
                isSelected ? styles.chipLabelSelected : styles.chipLabelUnselected,
              ]}>
              {option.label}
            </Text>
            {option.badge !== undefined && (
              <View
                style={[
                  styles.badge,
                  isSelected ? styles.badgeSelected : styles.badgeUnselected,
                ]}>
                <Text
                  style={[
                    styles.badgeText,
                    isSelected ? styles.badgeTextSelected : styles.badgeTextUnselected,
                  ]}>
                  {option.badge}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
    ...Shadows.subtle,
  },
  chipUnselected: {
    backgroundColor: Palette.white,
    borderColor: Palette.border,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  chipLabelSelected: {
    color: Palette.white,
  },
  chipLabelUnselected: {
    color: Palette.textSecondary,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
  },
  badgeSelected: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  badgeUnselected: {
    backgroundColor: Palette.backgroundSubtle,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextSelected: {
    color: Palette.white,
  },
  badgeTextUnselected: {
    color: Palette.textSecondary,
  },
  pressed: {
    opacity: 0.8,
  },
});
