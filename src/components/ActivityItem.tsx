import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Spacing } from '../constants/theme';
import { Activity } from '../types/activity';

interface Props { activity: Activity; isLast?: boolean; }

const iconMap: Record<string, { name: string; color: string; bg: string }> = {
  donation: { name: 'water', color: Palette.healthy, bg: Palette.healthyBg },
  issue: { name: 'arrow-forward-circle', color: Palette.issued, bg: Palette.issuedBg },
  request: { name: 'document-text', color: Palette.warning, bg: Palette.warningBg },
  camp: { name: 'calendar', color: Palette.moderate, bg: Palette.moderateBg },
  alert: { name: 'alert-circle', color: Palette.critical, bg: Palette.criticalBg },
};

export const ActivityItem: React.FC<Props> = ({ activity, isLast }) => {
  const cfg = iconMap[activity.type] || iconMap.donation;
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
        <Ionicons name={cfg.name as any} size={16} color={cfg.color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{activity.title}</Text>
        <Text style={styles.time}>{activity.time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Palette.borderSubtle },
  iconWrap: { width: 34, height: 34, borderRadius: BorderRadius.sm, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  title: { fontSize: 13, fontWeight: '600', color: Palette.textPrimary },
  time: { fontSize: 11, color: Palette.textMuted, marginTop: 1 },
});
