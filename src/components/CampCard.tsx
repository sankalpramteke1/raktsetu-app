import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, GlassStyles, Palette, Spacing } from '../constants/theme';
import { Camp } from '../types/camp';
import { CampStatusBadge } from './CampStatusBadge';

interface Props { camp: Camp; }

export const CampCard: React.FC<Props> = ({ camp }) => {
  const router = useRouter();
  const isLive = camp.status === 'Ongoing';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, isLive && styles.liveCard, pressed && styles.pressed]}
      onPress={() => router.push({ pathname: '/camps/[id]', params: { id: camp.id } })}>
      <View style={styles.topRow}>
        <CampStatusBadge status={camp.status} />
        <Text style={styles.dateText}>{camp.date}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>{camp.name}</Text>
      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={13} color={Palette.textMuted} />
        <Text style={styles.metaText} numberOfLines={1}>{camp.venue}</Text>
      </View>
      {camp.organizer && (
        <View style={styles.metaRow}>
          <Ionicons name="people-outline" size={13} color={Palette.textMuted} />
          <Text style={styles.metaText}>{camp.organizer}</Text>
        </View>
      )}
      <View style={styles.footer}>
        <View style={styles.statPill}>
          <Ionicons name="water" size={12} color={Palette.primary} />
          <Text style={styles.statText}>{camp.unitsCollected ?? 0} units</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Palette.textMuted} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: { ...GlassStyles.card, padding: Spacing.md, marginBottom: Spacing.sm },
  liveCard: { borderColor: Palette.healthyBorder, backgroundColor: 'rgba(0,230,118,0.05)' },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  dateText: { fontSize: 11, color: Palette.textMuted, fontWeight: '500' },
  name: { fontSize: 15, fontWeight: '700', color: Palette.textPrimary, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 },
  metaText: { fontSize: 12, color: Palette.textSecondary, flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: Palette.borderSubtle },
  statPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Palette.primarySurface, paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  statText: { fontSize: 11, fontWeight: '700', color: Palette.primary },
});
