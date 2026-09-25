import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { BorderRadius, Palette, Spacing } from '../constants/theme';

interface Props { value: string; onChangeText: (t: string) => void; placeholder?: string; }

export const SearchBar: React.FC<Props> = ({ value, onChangeText, placeholder }) => (
  <View style={styles.bar}>
    <Ionicons name="search" size={17} color={Palette.textMuted} />
    <TextInput
      style={styles.input}
      placeholder={placeholder || 'Search...'}
      placeholderTextColor={Palette.textMuted}
      value={value}
      onChangeText={onChangeText}
      clearButtonMode="while-editing"
    />
    {value.length > 0 && (
      <Pressable onPress={() => onChangeText('')} hitSlop={10}>
        <Ionicons name="close-circle" size={16} color={Palette.textMuted} />
      </Pressable>
    )}
  </View>
);

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: Spacing.md,
    height: 42,
    gap: 8,
  },
  input: { flex: 1, fontSize: 13, color: Palette.textPrimary },
});
