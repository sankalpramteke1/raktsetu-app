import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../constants/theme';
import { DONORS } from '../data/donors';
import { CampParticipant, CampParticipantStatus } from '../types/camp';

interface Props {
  participant: CampParticipant;
  onStatusChange?: (newStatus: CampParticipantStatus) => void;
}

export const CampParticipantCard: React.FC<Props> = ({ participant, onStatusChange }) => {
  const router = useRouter();
  const donor = DONORS.find((d) => d.donorId === participant.donorId);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleOpenDonor = () => {
    if (donor) {
      router.push({
        pathname: '/donors/[id]',
        params: { id: donor.donorId },
      });
    }
  };

  const getStatusBadgeStyle = (status: CampParticipantStatus) => {
    switch (status) {
      case 'Donated':
        return { bg: Palette.healthyBg, text: Palette.healthy, border: Palette.healthyBorder };
      case 'Screened':
        return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' };
      case 'Checked In':
        return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
      case 'Deferred':
        return { bg: Palette.criticalBg, text: Palette.critical, border: Palette.criticalBorder };
      case 'Cancelled':
        return { bg: Palette.borderSubtle, text: Palette.textMuted, border: Palette.border };
      case 'Registered':
      default:
        return { bg: '#F1F5F9', text: Palette.textSecondary, border: Palette.border };
    }
  };

  const statusStyle = getStatusBadgeStyle(participant.status);

  return (
    <View style={styles.card}>
      <Pressable
        style={styles.mainRow}
        onPress={handleOpenDonor}
        android_ripple={{ color: Palette.borderSubtle }}>
        {/* Avatar with Initials */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {donor ? getInitials(donor.fullName) : '??'}
          </Text>
        </View>

        {/* Info */}
        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {donor ? donor.fullName : participant.donorId}
            </Text>
            {donor?.bloodGroup && (
              <View style={styles.bloodBadge}>
                <Text style={styles.bloodText}>{donor.bloodGroup}</Text>
              </View>
            )}
          </View>

          <Text style={styles.metaText}>
            {participant.donorId} · {donor?.mobile || 'No mobile'}
          </Text>
        </View>

        {/* Current status pill */}
        <View
          style={[
            styles.statusPill,
            { backgroundColor: statusStyle.bg, borderColor: statusStyle.border },
          ]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {participant.status}
          </Text>
        </View>
      </Pressable>

      {/* Attendance Action Progression Footer */}
      <View style={styles.actionFooter}>
        <View style={styles.stepTrack}>
          <View
            style={[
              styles.stepDot,
              participant.status !== 'Registered' && styles.stepDotDone,
            ]}
          />
          <View
            style={[
              styles.stepLine,
              (participant.status === 'Screened' || participant.status === 'Donated') &&
                styles.stepLineDone,
            ]}
          />
          <View
            style={[
              styles.stepDot,
              (participant.status === 'Screened' || participant.status === 'Donated') &&
                styles.stepDotDone,
            ]}
          />
          <View
            style={[
              styles.stepLine,
              participant.status === 'Donated' && styles.stepLineDone,
            ]}
          />
          <View
            style={[
              styles.stepDot,
              participant.status === 'Donated' && styles.stepDotDone,
            ]}
          />
        </View>

        {/* Action Button */}
        {participant.status === 'Registered' && (
          <Pressable
            style={({ pressed }) => [styles.btnAction, styles.btnPrimary, pressed && styles.btnPressed]}
            onPress={() => onStatusChange?.('Checked In')}>
            <Ionicons name="checkbox-outline" size={14} color={Palette.card} />
            <Text style={styles.btnActionText}>Check In</Text>
          </Pressable>
        )}

        {participant.status === 'Checked In' && (
          <Pressable
            style={({ pressed }) => [styles.btnAction, styles.btnAmber, pressed && styles.btnPressed]}
            onPress={() => onStatusChange?.('Screened')}>
            <Ionicons name="fitness-outline" size={14} color="#78350F" />
            <Text style={[styles.btnActionText, { color: '#78350F' }]}>Mark Screened</Text>
          </Pressable>
        )}

        {participant.status === 'Screened' && (
          <Pressable
            style={({ pressed }) => [styles.btnAction, styles.btnGreen, pressed && styles.btnPressed]}
            onPress={() => onStatusChange?.('Donated')}>
            <Ionicons name="water" size={14} color={Palette.card} />
            <Text style={styles.btnActionText}>Mark Donated</Text>
          </Pressable>
        )}

        {participant.status === 'Donated' && (
          <View style={styles.donatedTag}>
            <Ionicons name="checkmark-circle" size={15} color={Palette.healthy} />
            <Text style={styles.donatedTagText}>
              Donated 1 Unit {participant.bagId ? `(${participant.bagId})` : ''}
            </Text>
          </View>
        )}

        {participant.status === 'Deferred' && (
          <Text style={styles.deferText}>Deferred by Medical Officer</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    ...Shadows.card,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 2,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.primary,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  bloodBadge: {
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  bloodText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
  metaText: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  actionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    backgroundColor: Palette.surface,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
  },
  stepTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.border,
  },
  stepDotDone: {
    backgroundColor: Palette.primary,
  },
  stepLine: {
    width: 12,
    height: 2,
    backgroundColor: Palette.border,
  },
  stepLineDone: {
    backgroundColor: Palette.primary,
  },
  btnAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  btnPrimary: {
    backgroundColor: Palette.primary,
  },
  btnAmber: {
    backgroundColor: '#FDE68A',
  },
  btnGreen: {
    backgroundColor: Palette.healthy,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  btnActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.card,
  },
  donatedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  donatedTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.healthy,
  },
  deferText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: Palette.critical,
  },
});
