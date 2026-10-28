import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../../src/constants/theme';
import { donorService } from '../../src/services/donorService';
import { Donor } from '../../src/types/donor';

export default function DonorDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const donorId = params.id;

  const [donor, setDonor] = useState<Donor | undefined>();

  useEffect(() => {
    let isMounted = true;
    if (donorId) {
      donorService
        .getDonorById(donorId)
        .then((d) => {
          if (isMounted) setDonor(d);
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [donorId]);

  const handleCall = () => {
    if (donor?.mobile) {
      Linking.openURL(`tel:${donor.mobile.replace(/\s+/g, '')}`).catch(() => {
        Alert.alert('Phone Call', `Simulating call to ${donor.fullName} (${donor.mobile})`);
      });
    }
  };

  const handleMessage = () => {
    if (donor?.mobile) {
      Linking.openURL(`sms:${donor.mobile.replace(/\s+/g, '')}`).catch(() => {
        Alert.alert('SMS', `Simulating SMS to ${donor.fullName}`);
      });
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (!donor) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.notFoundText}>Donor profile not found.</Text>
          <TouchableOpacity style={styles.returnBtn} onPress={() => router.back()}>
            <Text style={styles.returnBtnText}>Return to Donors</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          onPress={() => router.back()}
          hitSlop={8}>
          <Ionicons name="arrow-back" size={20} color={Palette.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Donor Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          {/* Clean Profile Header */}
          <View style={styles.profileCard}>
            <View style={styles.profileTop}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>{getInitials(donor.fullName)}</Text>
              </View>

              <View style={styles.nameCol}>
                <Text style={styles.donorName}>{donor.fullName}</Text>
                <View style={styles.badgeRow}>
                  <View style={styles.bloodBadge}>
                    <Text style={styles.bloodBadgeText}>{donor.bloodGroup}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>{donor.status}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons: Call & Message */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.callBtn]}
                onPress={handleCall}
                activeOpacity={0.8}>
                <Ionicons name="call" size={15} color={Palette.white} />
                <Text style={styles.callBtnText}>Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.messageBtn]}
                onPress={handleMessage}
                activeOpacity={0.8}>
                <Ionicons name="chatbubble-outline" size={15} color={Palette.textPrimary} />
                <Text style={styles.messageBtnText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Compact Statistics: Total Donations, Last Donation */}
          <View style={styles.statsCard}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{donor.totalDonations}</Text>
              <Text style={styles.statLabel}>Total Donations</Text>
            </View>

            <View style={styles.dividerV} />

            <View style={styles.statCol}>
              <Text style={styles.statValSm}>{donor.lastDonationDate}</Text>
              <Text style={styles.statLabel}>Last Donation</Text>
            </View>

            <View style={styles.dividerV} />

            <View style={styles.statCol}>
              <Text style={styles.statValSm}>{donor.nextEligibleDate || 'N/A'}</Text>
              <Text style={styles.statLabel}>Next Eligible</Text>
            </View>
          </View>

          {/* Donor Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Donor Information</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Donor ID</Text>
              <Text style={styles.detailValue}>{donor.donorId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>{donor.gender}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Age</Text>
              <Text style={styles.detailValue}>{donor.age} years</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Weight</Text>
              <Text style={styles.detailValue}>{donor.weightKg} kg</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{donor.mobile}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{donor.email}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{donor.location}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    backgroundColor: Palette.white,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  headerSpacer: {
    width: 36,
  },
  listContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 32,
    backgroundColor: Palette.background,
  },
  headerSection: {
    paddingTop: Spacing.md,
  },
  profileCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
    marginBottom: Spacing.sm,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.md,
  },
  avatarLarge: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLargeText: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.primary,
  },
  nameCol: {
    flex: 1,
  },
  donorName: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  bloodBadge: {
    backgroundColor: Palette.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  bloodBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.primary,
  },
  statusBadge: {
    backgroundColor: Palette.healthyBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.healthy,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
    gap: 5,
  },
  callBtn: {
    backgroundColor: Palette.primary,
  },
  callBtnText: {
    color: Palette.white,
    fontSize: 13,
    fontWeight: '700',
  },
  messageBtn: {
    backgroundColor: Palette.borderSubtle,
  },
  messageBtnText: {
    color: Palette.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
    marginBottom: Spacing.md,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  statValSm: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: Palette.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  dividerV: {
    width: 1,
    height: 24,
    backgroundColor: Palette.borderSubtle,
  },
  detailsCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
    marginTop: Spacing.sm,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  detailLabel: {
    fontSize: 12,
    color: Palette.textMuted,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    color: Palette.textPrimary,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 15,
    color: Palette.textSecondary,
    marginBottom: 12,
  },
  returnBtn: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  returnBtnText: {
    color: Palette.white,
    fontWeight: '700',
  },
});
