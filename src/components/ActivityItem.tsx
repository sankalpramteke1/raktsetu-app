import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Spacing } from '../constants/theme';
import { ActivityItemType, ActivityType } from '../types/activity';

interface Props {
  activity: ActivityItemType;
  isLast?: boolean;
}

export const ActivityItem: React.FC<Props> = ({ activity, isLast = false }) => {
  const getIconConfig = (type: ActivityType): { name: keyof typeof Ionicons.glyphMap; color: string; bg: string } => {
    switch (type) {
      case 'issue':
        return { name: 'arrow-redo', color: Palette.issued, bg: Palette.issuedBg };
      case 'donor':
        return { name: 'person-add', color: Palette.healthy, bg: Palette.healthyBg };
      case 'crossmatch':
        return { name: 'flask', color: Palette.quarantine, bg: Palette.quarantineBg };
      case 'inventory':
        return { name: 'cube', color: Palette.moderate, bg: Palette.moderateBg };
      case 'request':
        return { name: 'document-text', color: Palette.warning, bg: Palette.warningBg };
      case 'alert':
        return { name: 'alert-circle', color: Palette.critical, bg: Palette.criticalBg };
    }
  };

  const iconConfig = getIconConfig(activity.type);

  return (
    <View style={[styles.row, !isLast && styles.borderBottom]}>
      <View style={[styles.iconWrap, { backgroundColor: iconConfig.bg }]}>
        <Ionicons name={iconConfig.name} size={13} color={iconConfig.color} />
      </View>

      <View style={styles.textCol}>
        <Text style={styles.titleText} numberOfLines={1}>
          {activity.title}
        </Text>
        <Text style={styles.descText} numberOfLines={1}>
          {activity.description}
        </Text>
      </View>

      <Text style={styles.timeText}>{activity.time.split(',')[0]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCol: {
    flex: 1,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  descText: {
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 1,
  },
  timeText: {
    fontSize: 11,
    color: Palette.textMuted,
    fontWeight: '500',
  },
});
