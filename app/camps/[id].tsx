import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddDonorModal } from '../../src/components/AddDonorModal';
import { CampLocationModal } from '../../src/components/CampLocationModal';
import { CampParticipantCard } from '../../src/components/CampParticipantCard';
import { CampStatusBadge } from '../../src/components/CampStatusBadge';
import { EmptyState } from '../../src/components/EmptyState';
import { BorderRadius, Palette, Shadows, Spacing } from '../../src/constants/theme';
import { campService } from '../../src/services/campService';
import { BloodGroup } from '../../src/types/blood';
import {
  BloodDonationCamp,
  CampParticipant,
  CampParticipantStatus,
  CampStatus,
} from '../../src/types/camp';

const BLOOD_GROUPS: BloodGroup[] = ['O+', 'B+', 'A+', 'O-', 'AB+', 'A-', 'B-', 'AB-'];

export default function CampDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [camp, setCamp] = useState<BloodDonationCamp | null>(null);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [addDonorModalVisible, setAddDonorModalVisible] = useState(false);
  const [participantFilter, setParticipantFilter] = useState<'All' | CampParticipantStatus>('All');

  const loadCamp = useCallback(async () => {
    if (!id) return;
    const found = await campService.getCampById(id);
    if (found) {
      setCamp({ ...found });
    }
  }, [id]);

  useEffect(() => {
    loadCamp();

    const unsubscribe = campService.subscribe(() => {
      loadCamp();
    });

    return unsubscribe;
  }, [loadCamp]);

  // Derived attendee counts
  const stats = useMemo(() => {
    if (!camp) return { registered: 0, checkedIn: 0, donated: 0, units: 0 };
    const registered = camp.participants.length;
    const checkedIn = camp.participants.filter(
      (p) => p.status === 'Checked In' || p.status === 'Screened' || p.status === 'Donated'
    ).length;
    const donated = camp.participants.filter((p) => p.status === 'Donated').length;
    const units = camp.unitsCollected;
    return { registered, checkedIn, donated, units };
  }, [camp]);

  // Filtered participant list
  const filteredParticipants = useMemo(() => {
    if (!camp) return [];
    if (participantFilter === 'All') return camp.participants;
    return camp.participants.filter((p) => p.status === participantFilter);
  }, [camp, participantFilter]);

  if (!camp) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Camp not found</Text>
        <Pressable style={styles.btnBack} onPress={() => router.back()}>
          <Text style={styles.btnBackText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const progressPercent = Math.min(
    100,
    Math.round((camp.unitsCollected / (camp.targetUnits || 1)) * 100)
  );

  const handleStatusChange = (newStatus: CampStatus) => {
    Alert.alert(
      'Change Camp Status',
      `Are you sure you want to mark this camp as "${newStatus}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            await campService.updateCampStatus(camp.id, newStatus);
            await loadCamp();
          },
        },
      ]
    );
  };

  const handleParticipantStatus = async (donorId: string, status: CampParticipantStatus) => {
    await campService.updateParticipantStatus(camp.id, donorId, status);
    await loadCamp();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header */}
      <View style={styles.navBar}>
        <Pressable
          style={styles.navBtn}
          onPress={() => router.back()}
          hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={Palette.textPrimary} />
        </Pressable>
        <View style={styles.navTitleWrap}>
          <Text style={styles.navTitle} numberOfLines={1}>
            {camp.name}
          </Text>
          <Text style={styles.navSub}>Camp ID: {camp.id}</Text>
        </View>
        <Pressable
          style={styles.navBtn}
          onPress={() => setLocationModalVisible(true)}
          hitSlop={10}>
          <Ionicons name="location-outline" size={22} color={Palette.primary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* 1. Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroTypeTag}>
              <Text style={styles.heroTypeText}>{camp.type}</Text>
            </View>
            <CampStatusBadge status={camp.status} />
          </View>

          <View style={styles.heroTitleRow}>
            <View style={styles.heroIconWrap}>
              <Ionicons name="water" size={18} color={Palette.primary} />
            </View>
            <Text style={styles.heroCampName}>{camp.name}</Text>
          </View>

          <View style={styles.heroMetaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={13} color={Palette.textSecondary} />
              <Text style={styles.metaText}>{camp.date}</Text>
            </View>
            <Text style={styles.dotSep}>·</Text>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={13} color={Palette.textSecondary} />
              <Text style={styles.metaText}>
                {camp.startTime} – {camp.endTime}
              </Text>
            </View>
          </View>

          <View style={styles.heroVenueRow}>
            <Ionicons name="location-sharp" size={14} color={Palette.primary} />
            <Text style={styles.venueText} numberOfLines={1}>
              {camp.venue}, {camp.city}
            </Text>
          </View>
        </View>

        {/* 2. Compact 4-Metric Statistics Bar */}
        <View style={styles.statCapsule}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.registered}</Text>
            <Text style={styles.statLabel}>Registered</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#2563EB' }]}>{stats.checkedIn}</Text>
            <Text style={styles.statLabel}>Checked In</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Palette.healthy }]}>{stats.donated}</Text>
            <Text style={styles.statLabel}>Donated</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Palette.primary }]}>{stats.units}</Text>
            <Text style={styles.statLabel}>Units Coll.</Text>
          </View>
        </View>

        {/* 3. Location Card */}
        <View style={styles.locationCard}>
          <View style={styles.locLeft}>
            <View style={styles.locIconWrap}>
              <Ionicons name="navigate-outline" size={18} color={Palette.primary} />
            </View>
            <View style={styles.locTextCol}>
              <Text style={styles.locVenue}>{camp.venue}</Text>
              <Text style={styles.locCity}>
                {camp.address}, {camp.city}, {camp.district}
              </Text>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [styles.btnViewLoc, pressed && styles.btnPressed]}
            onPress={() => setLocationModalVisible(true)}>
            <Text style={styles.btnViewLocText}>View Location</Text>
            <Ionicons name="chevron-forward" size={14} color={Palette.primary} />
          </Pressable>
        </View>

        {/* 4. Blood Collection Progress & Group Breakdown */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderTitle}>
              <Ionicons name="bar-chart-outline" size={16} color={Palette.primary} />
              <Text style={styles.sectionHeading}>Blood Collection Tracking</Text>
            </View>
            <Text style={styles.progressPercentText}>{progressPercent}% of target</Text>
          </View>

          {/* Target vs Collected Header */}
          <View style={styles.targetRow}>
            <View style={styles.targetCol}>
              <Text style={styles.targetSub}>Target Units</Text>
              <Text style={styles.targetVal}>{camp.targetUnits} units</Text>
            </View>
            <View style={[styles.targetCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.targetSub}>Collected So Far</Text>
              <Text style={[styles.targetVal, { color: Palette.primary }]}>
                {camp.unitsCollected} units
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>

          {/* Blood Group Breakdown Grid */}
          <Text style={styles.breakdownTitle}>Collection by Blood Group</Text>
          <View style={styles.groupGrid}>
            {BLOOD_GROUPS.map((grp) => {
              const count = camp.groupCollection[grp] || 0;
              return (
                <View key={grp} style={[styles.groupCell, count > 0 && styles.groupCellActive]}>
                  <Text style={[styles.groupLabel, count > 0 && styles.groupLabelActive]}>
                    {grp}
                  </Text>
                  <Text style={[styles.groupCount, count > 0 && styles.groupCountActive]}>
                    {count}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 5. Camp Information Card */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderTitle}>
            <Ionicons name="information-circle-outline" size={16} color={Palette.primary} />
            <Text style={styles.sectionHeading}>Camp Information</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Organizer</Text>
              <Text style={styles.infoVal}>{camp.organizer}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Coordinator</Text>
              <Text style={styles.infoVal}>
                {camp.contactPerson} ({camp.contactNumber})
              </Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Expected Donors</Text>
              <Text style={styles.infoVal}>{camp.expectedDonors} registered expected</Text>
            </View>
            {camp.description ? (
              <View style={[styles.infoCol, { width: '100%' }]}>
                <Text style={styles.infoLabel}>Notes / Instructions</Text>
                <Text style={styles.infoVal}>{camp.description}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* 6. Camp Status Actions */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderTitle}>
            <Ionicons name="flash-outline" size={16} color={Palette.primary} />
            <Text style={styles.sectionHeading}>Camp Operations & Status</Text>
          </View>

          <View style={styles.statusActionsWrap}>
            {camp.status === 'Upcoming' && (
              <Pressable
                style={({ pressed }) => [styles.btnStatusAction, styles.btnOngoing, pressed && styles.btnPressed]}
                onPress={() => handleStatusChange('Ongoing')}>
                <Ionicons name="play" size={14} color={Palette.white} />
                <Text style={styles.btnStatusText}>Mark Camp Ongoing</Text>
              </Pressable>
            )}

            {camp.status === 'Ongoing' && (
              <Pressable
                style={({ pressed }) => [styles.btnStatusAction, styles.btnComplete, pressed && styles.btnPressed]}
                onPress={() => handleStatusChange('Completed')}>
                <Ionicons name="checkmark-done" size={15} color={Palette.white} />
                <Text style={styles.btnStatusText}>Complete Camp</Text>
              </Pressable>
            )}

            {camp.status !== 'Cancelled' && camp.status !== 'Completed' && (
              <Pressable
                style={({ pressed }) => [styles.btnStatusAction, styles.btnCancel, pressed && styles.btnPressed]}
                onPress={() => handleStatusChange('Cancelled')}>
                <Ionicons name="close-circle-outline" size={14} color={Palette.critical} />
                <Text style={[styles.btnStatusText, { color: Palette.critical }]}>Cancel Camp</Text>
              </Pressable>
            )}

            {camp.status === 'Completed' && (
              <View style={styles.completedNotice}>
                <Ionicons name="checkmark-circle" size={16} color={Palette.healthy} />
                <Text style={styles.completedNoticeText}>
                  This donation camp was concluded and archived.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 7. Registered Donors & Attendance Section */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderTitle}>
              <Ionicons name="people-outline" size={16} color={Palette.primary} />
              <Text style={styles.sectionHeading}>Registered Donors</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{camp.participants.length}</Text>
              </View>
            </View>

            {/* [+ Add Donor] Button */}
            <Pressable
              style={({ pressed }) => [styles.btnAddDonor, pressed && styles.btnPressed]}
              onPress={() => setAddDonorModalVisible(true)}>
              <Ionicons name="person-add" size={14} color={Palette.white} />
              <Text style={styles.btnAddDonorText}>Add Donor</Text>
            </Pressable>
          </View>

          {/* Participant Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.partFilterScroll}>
            {(['All', 'Registered', 'Checked In', 'Screened', 'Donated'] as const).map((st) => (
              <Pressable
                key={st}
                style={[
                  styles.partChip,
                  participantFilter === st && styles.partChipActive,
                ]}
                onPress={() => setParticipantFilter(st)}>
                <Text
                  style={[
                    styles.partChipText,
                    participantFilter === st && styles.partChipTextActive,
                  ]}>
                  {st}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* List of participant cards */}
          {filteredParticipants.length === 0 ? (
            <View style={styles.emptyParticipants}>
              <Ionicons name="people-circle-outline" size={32} color={Palette.border} />
              <Text style={styles.emptyPartText}>
                {participantFilter === 'All'
                  ? 'No donors registered for this camp yet.'
                  : `No donors with status "${participantFilter}".`}
              </Text>
              {participantFilter === 'All' && (
                <Pressable
                  style={styles.btnRegisterFirst}
                  onPress={() => setAddDonorModalVisible(true)}>
                  <Text style={styles.btnRegisterFirstText}>+ Register First Donor</Text>
                </Pressable>
              )}
            </View>
          ) : (
            filteredParticipants.map((p) => (
              <CampParticipantCard
                key={p.donorId}
                participant={p}
                onStatusChange={(newSt) => handleParticipantStatus(p.donorId, newSt)}
              />
            ))
          )}
        </View>

      </ScrollView>

      {/* Modals */}
      <CampLocationModal
        visible={locationModalVisible}
        camp={camp}
        onClose={() => setLocationModalVisible(false)}
      />

      <AddDonorModal
        visible={addDonorModalVisible}
        camp={camp}
        onClose={() => setAddDonorModalVisible(false)}
        onDonorAdded={loadCamp}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.background,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.critical,
    marginBottom: Spacing.md,
  },
  btnBack: {
    backgroundColor: Palette.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  btnBackText: {
    color: Palette.white,
    fontWeight: '700',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    backgroundColor: Palette.white,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
  },
  navBtn: {
    padding: 6,
  },
  navTitleWrap: {
    flex: 1,
    marginHorizontal: Spacing.sm,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  navSub: {
    fontSize: 11,
    color: Palette.textMuted,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl + 24,
  },
  heroCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  heroTypeTag: {
    backgroundColor: Palette.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  heroTypeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  heroIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCampName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  dotSep: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  heroVenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
  },
  venueText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  statCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Palette.borderSubtle,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  locLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  locIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locTextCol: {
    flex: 1,
  },
  locVenue: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  locCity: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 1,
  },
  btnViewLoc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingLeft: Spacing.sm,
  },
  btnViewLocText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  cardSection: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm + 2,
  },
  sectionHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  targetCol: {},
  targetSub: {
    fontSize: 11,
    color: Palette.textMuted,
  },
  targetVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginTop: 1,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Palette.primary,
    borderRadius: 4,
  },
  breakdownTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  groupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  groupCell: {
    flexBasis: '23%',
    flexGrow: 1,
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  groupCellActive: {
    backgroundColor: Palette.primaryLight,
    borderColor: Palette.primary,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  groupLabelActive: {
    color: Palette.primary,
  },
  groupCount: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.textMuted,
    marginTop: 1,
  },
  groupCountActive: {
    color: Palette.primary,
  },
  infoGrid: {
    marginTop: Spacing.sm,
    gap: 10,
  },
  infoCol: {
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    paddingBottom: 6,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: Palette.textMuted,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '500',
    color: Palette.textPrimary,
    marginTop: 2,
  },
  statusActionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: Spacing.sm,
  },
  btnStatusAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  btnOngoing: {
    backgroundColor: Palette.healthy,
  },
  btnComplete: {
    backgroundColor: Palette.primary,
  },
  btnCancel: {
    backgroundColor: Palette.criticalBg,
    borderWidth: 1,
    borderColor: Palette.criticalBorder,
  },
  btnStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.white,
  },
  completedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  completedNoticeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Palette.healthy,
  },
  countBadge: {
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
  btnAddDonor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  btnAddDonorText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.white,
  },
  partFilterScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingBottom: Spacing.sm + 2,
  },
  partChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  partChipActive: {
    backgroundColor: Palette.primaryLight,
    borderColor: Palette.primary,
  },
  partChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textSecondary,
  },
  partChipTextActive: {
    fontWeight: '700',
    color: Palette.primary,
  },
  emptyParticipants: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 6,
  },
  emptyPartText: {
    fontSize: 12,
    color: Palette.textMuted,
    textAlign: 'center',
  },
  btnRegisterFirst: {
    marginTop: 8,
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  btnRegisterFirstText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
