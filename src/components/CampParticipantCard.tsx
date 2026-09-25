import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, GlassStyles, Palette, Spacing } from '../constants/theme';

interface Props { name: string; bloodGroup: string; status?: string; }

export const CampParticipantCard: React.FC<Props> = ({ name, bloodGroup, status }) => (
  <View style={styles.card}>
    <View style={styles.avatar}><Ionicons name="person" size={16} color={Palette.primary} /></View>
    <View style={styles.info}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.detail}>{bloodGroup} · {status || 'Registered'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { ...GlassStyles.card, padding: Spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: Palette.primarySurface, borderWidth: 1, borderColor: Palette.borderAccent, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  name: { fontSize: 13, fontWeight: '600', color: Palette.textPrimary },
  detail: { fontSize: 11, color: Palette.textMuted, marginTop: 1 },
});
