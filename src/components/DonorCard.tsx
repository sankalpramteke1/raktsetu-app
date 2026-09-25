import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../constants/theme';
import { Donor } from '../types/donor';

interface Props {
  donor: Donor;
}

export const DonorCard: React.FC<Props> = ({ donor }) => {
  const router = useRouter();

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handlePress = () => {
    router.push({
      pathname: '/donors/[id]',
      params: { id: donor.donorId },
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={handlePress}>
      {/* Avatar Initials */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(donor.fullName)}</Text>
      </View>

      {/* Main Info */}
      <View style={styles.infoCol}>
        <Text style={styles.nameText} numberOfLines={1}>
          {donor.fullName}
        </Text>
        <Text style={styles.metaText}>
          Last donated {donor.lastDonationDate.split(' ')[0]} {donor.lastDonationDate.split(' ')[1]} ·{' '}
          <Text style={styles.countHighlight}>{donor.totalDonations} donations</Text>
        </Text>
      </View>

      {/* Blood Group Badge & Chevron */}
      <View style={styles.rightWrap}>
        <View style={styles.bloodBadge}>
          <Text style={styles.bloodText}>{donor.bloodGroup}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={Palette.textMuted} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    ...Shadows.card,
    marginBottom: Spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.primary,
  },
  infoCol: {
    flex: 1,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  metaText: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  countHighlight: {
    color: Palette.textSecondary,
    fontWeight: '600',
  },
  rightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bloodBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: Palette.primarySurface,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  bloodText: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.primary,
  },
});
