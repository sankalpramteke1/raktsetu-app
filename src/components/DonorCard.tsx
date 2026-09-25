import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, GlassStyles, Palette, Spacing } from '../constants/theme';
import { Donor } from '../types/donor';

interface Props { donor: Donor; }

export const DonorCard: React.FC<Props> = ({ donor }) => {
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push({ pathname: '/donors/[id]', params: { id: donor.id } })}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{donor.name.charAt(0)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{donor.name}</Text>
        <Text style={styles.details}>{donor.bloodGroup} · {donor.city || 'Durg'}</Text>
      </View>
      <View style={styles.bloodPill}>
        <Text style={styles.bloodText}>{donor.bloodGroup}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={Palette.textMuted} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: { ...GlassStyles.card, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.sm },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: Palette.primarySurface, borderWidth: 1, borderColor: Palette.borderAccent, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 16, fontWeight: '800', color: Palette.primary },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '700', color: Palette.textPrimary },
  details: { fontSize: 12, color: Palette.textMuted, marginTop: 1 },
  bloodPill: { backgroundColor: Palette.primarySurface, paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Palette.borderAccent },
  bloodText: { fontSize: 12, fontWeight: '800', color: Palette.primary },
});
