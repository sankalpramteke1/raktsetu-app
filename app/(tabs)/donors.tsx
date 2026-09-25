import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DonorCard } from '../../src/components/DonorCard';
import { EmptyState } from '../../src/components/EmptyState';
import { FilterChips } from '../../src/components/FilterChips';
import { Header } from '../../src/components/Header';
import { SearchBar } from '../../src/components/SearchBar';
import { Palette, Spacing } from '../../src/constants/theme';
import { donorService } from '../../src/services/donorService';
import { Donor } from '../../src/types/donor';

type GroupFilter = 'All' | 'A+' | 'B+' | 'O+' | 'AB+' | 'O-' | 'A-' | 'B-' | 'AB-';

export default function DonorsScreen() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadDonors = async () => {
    try {
      const data = await donorService.getAllDonors();
      setDonors(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDonors();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDonors();
    setRefreshing(false);
  };

  const filterOptions: { label: string; value: GroupFilter }[] = [
    { label: 'All', value: 'All' },
    { label: 'O+', value: 'O+' },
    { label: 'B+', value: 'B+' },
    { label: 'A+', value: 'A+' },
    { label: 'AB+', value: 'AB+' },
    { label: 'O-', value: 'O-' },
    { label: 'A-', value: 'A-' },
    { label: 'B-', value: 'B-' },
    { label: 'AB-', value: 'AB-' },
  ];

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      if (groupFilter !== 'All' && donor.bloodGroup !== groupFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          donor.fullName.toLowerCase().includes(q) ||
          donor.donorId.toLowerCase().includes(q) ||
          donor.location.toLowerCase().includes(q) ||
          donor.bloodGroup.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [donors, groupFilter, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Regular Donors" subtitle="Voluntary Donor Directory" />

      <FlatList
        data={filteredDonors}
        keyExtractor={(item) => item.donorId}
        renderItem={({ item }) => <DonorCard donor={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        maxToRenderPerBatch={15}
        windowSize={5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Palette.primary]}
            tintColor={Palette.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerComponent}>
            {/* Search Bar */}
            <View style={styles.searchWrap}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search donor name, city, group..."
              />
            </View>

            {/* Filter Chips: All | A+ | B+ | O+ | AB+ */}
            <FilterChips
              options={filterOptions}
              selected={groupFilter}
              onSelect={setGroupFilter}
            />

            <View style={styles.metaRow}>
              <Text style={styles.countText}>{filteredDonors.length} registered donors</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="No Donors Found"
            message="No donor records match your search or blood group filter."
            actionText="Clear Filter"
            onAction={() => {
              setSearchQuery('');
              setGroupFilter('All');
            }}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.white,
  },
  listContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.sm,
    paddingBottom: 32,
    backgroundColor: Palette.background,
  },
  headerComponent: {
    marginBottom: Spacing.xs,
  },
  searchWrap: {
    marginBottom: 4,
  },
  metaRow: {
    marginVertical: 4,
    paddingHorizontal: 2,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textMuted,
  },
});
