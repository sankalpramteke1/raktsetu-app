import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CampCard } from '../../src/components/CampCard';
import { CampStats } from '../../src/components/CampStats';
import { EmptyState } from '../../src/components/EmptyState';
import { BorderRadius, Palette, Shadows, Spacing } from '../../src/constants/theme';
import { campService } from '../../src/services/campService';
import { BloodDonationCamp, CampStatus, CampSummaryStats, CampType } from '../../src/types/camp';

const STATUS_FILTERS: Array<CampStatus | 'All'> = [
  'All',
  'Upcoming',
  'Ongoing',
  'Completed',
  'Cancelled',
];

const CAMP_TYPES: Array<CampType | 'All Types'> = [
  'All Types',
  'Hospital Camp',
  'Corporate Camp',
  'College Camp',
  'Community Camp',
  'NGO Camp',
  'Government Camp',
];

export default function CampsScreen() {
  const router = useRouter();
  const [camps, setCamps] = useState<BloodDonationCamp[]>([]);
  const [stats, setStats] = useState<CampSummaryStats>({
    upcoming: 0,
    ongoing: 0,
    completed: 0,
    totalUnits: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<CampStatus | 'All'>('All');
  const [selectedType, setSelectedType] = useState<CampType | 'All Types'>('All Types');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [fetchedCamps, fetchedStats] = await Promise.all([
      campService.searchCamps(
        searchQuery,
        selectedStatus,
        selectedType === 'All Types' ? 'All' : selectedType
      ),
      campService.getCampStats(),
    ]);
    setCamps(fetchedCamps);
    setStats(fetchedStats);
  }, [searchQuery, selectedStatus, selectedType]);

  useEffect(() => {
    loadData();

    // Subscribe to updates from campService
    const unsubscribe = campService.subscribe(() => {
      loadData();
    });

    return unsubscribe;
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCreateCamp = () => {
    router.push('/camps/create');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Blood Donation Camps</Text>
          <Text style={styles.subtitle}>District Blood Bank · Durg</Text>
        </View>

        {/* [+ New Camp] Button */}
        <Pressable
          style={({ pressed }) => [styles.createBtn, pressed && styles.btnPressed]}
          onPress={handleCreateCamp}>
          <Ionicons name="add" size={18} color={Palette.white} />
          <Text style={styles.createBtnText}>New Camp</Text>
        </Pressable>
      </View>

      <FlatList
        data={camps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CampCard camp={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Palette.primary]}
            tintColor={Palette.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {/* Top Summary Stats Capsule */}
            <CampStats stats={stats} />

            {/* Compact Search Bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={17} color={Palette.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search camp, venue, organizer..."
                placeholderTextColor={Palette.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} hitSlop={10}>
                  <Ionicons name="close-circle" size={16} color={Palette.textMuted} />
                </Pressable>
              )}
            </View>

            {/* Status Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipScroll}>
              {STATUS_FILTERS.map((status) => {
                const isSelected = selectedStatus === status;
                return (
                  <Pressable
                    key={status}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => setSelectedStatus(status)}>
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {status}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Camp Type Sub-Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subChipScroll}>
              {CAMP_TYPES.map((type) => {
                const isSelected = selectedType === type;
                return (
                  <Pressable
                    key={type}
                    style={[styles.subChip, isSelected && styles.subChipActive]}
                    onPress={() => setSelectedType(type)}>
                    <Text style={[styles.subChipText, isSelected && styles.subChipTextActive]}>
                      {type}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Camps count indicator */}
            <View style={styles.countRow}>
              <Text style={styles.countText}>
                Showing <Text style={styles.countBold}>{camps.length}</Text> camps
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="No Camps Found"
            message={
              searchQuery || selectedStatus !== 'All' || selectedType !== 'All Types'
                ? 'Try clearing or changing your filters to see more camps.'
                : 'No blood donation camps scheduled yet. Tap "+ New Camp" to create one.'
            }
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm + 2,
    backgroundColor: Palette.white,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 1,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
    gap: 4,
    ...Shadows.subtle,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  createBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.white,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  listHeader: {
    paddingTop: Spacing.sm + 2,
    marginBottom: Spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: Spacing.sm + 4,
    height: 40,
    marginVertical: Spacing.xs,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Palette.textPrimary,
  },
  chipScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  chipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  chipTextActive: {
    color: Palette.white,
  },
  subChipScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingBottom: 6,
  },
  subChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  subChipActive: {
    backgroundColor: Palette.primaryLight,
    borderColor: Palette.primary,
  },
  subChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textSecondary,
  },
  subChipTextActive: {
    color: Palette.primary,
    fontWeight: '700',
  },
  countRow: {
    marginTop: 4,
    marginBottom: 6,
  },
  countText: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  countBold: {
    fontWeight: '700',
    color: Palette.textPrimary,
  },
});
