import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, GlassStyles, Palette, Spacing } from '../constants/theme';

interface Props { icon?: string; title: string; message: string; actionText?: string; onAction?: () => void; }

export const EmptyState: React.FC<Props> = ({ icon = 'file-tray-outline', title, message, actionText, onAction }) => (
  <View style={styles.container}>
    <View style={styles.iconCircle}>
      <Ionicons name={icon as any} size={32} color={Palette.textMuted} />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {actionText && onAction && (
      <Pressable style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]} onPress={onAction}>
        <Text style={styles.btnText}>{actionText}</Text>
      </Pressable>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 32, marginTop: 24 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '700', color: Palette.textPrimary, marginBottom: 4 },
  message: { fontSize: 13, color: Palette.textMuted, textAlign: 'center', lineHeight: 18, maxWidth: 260 },
  btn: { marginTop: 16, backgroundColor: Palette.primarySurface, borderWidth: 1, borderColor: Palette.borderAccent, paddingHorizontal: 20, paddingVertical: 8, borderRadius: BorderRadius.full },
  btnText: { fontSize: 13, fontWeight: '700', color: Palette.primary },
});
