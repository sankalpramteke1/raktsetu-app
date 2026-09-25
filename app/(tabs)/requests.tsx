import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { EmptyState } from '../../src/components/EmptyState';
import { FilterChips } from '../../src/components/FilterChips';
import { Header } from '../../src/components/Header';
import { RequestCard } from '../../src/components/RequestCard';
import { SearchBar } from '../../src/components/SearchBar';
import { Palette, Spacing } from '../../src/constants/theme';
import { requestService } from '../../src/services/requestService';
import { BloodRequest, RequestStatus } from '../../src/types/request';

type FilterStatus = 'All' | 'Pending' | 'Processing' | 'Ready' | 'Issued';

export default function RequestsScreen() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = async () => {
    try {
      const data = await requestService.getAllRequests();
      setRequests(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const filterOptions: { label: string; value: FilterStatus }[] = [
    { label: 'All', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Ready', value: 'Ready' },
    { label: 'Issued', value: 'Issued' },
  ];

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (statusFilter !== 'All' && req.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          req.patientName.toLowerCase().includes(q) ||
          req.requestId.toLowerCase().includes(q) ||
          req.patientId.toLowerCase().includes(q) ||
          req.bloodGroup.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [requests, statusFilter, searchQuery]);

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Blood Requests" subtitle="Hospital Ward Requisitions" />

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.requestId}
        renderItem={({ item }) => <RequestCard request={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={12}
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
            {/* Search */}
            <View style={styles.searchWrap}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search patient, ID, blood group..."
              />
            </View>

            {/* Filter Chips: All | Pending | Processing | Ready | Issued */}
            <FilterChips
              options={filterOptions}
              selected={statusFilter}
              onSelect={setStatusFilter}
            />

            <View style={styles.metaRow}>
              <Text style={styles.pendingText}>
                <Text style={styles.boldPending}>{pendingCount} pending</Text> requisitions
              </Text>
              <Text style={styles.totalText}>Showing {filteredRequests.length}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="No Requisitions Found"
            message={`No requisitions found matching "${statusFilter}".`}
            actionText="Show All"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('All');
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 2,
  },
  pendingText: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  boldPending: {
    fontWeight: '700',
    color: Palette.warning,
  },
  totalText: {
    fontSize: 12,
    color: Palette.textMuted,
  },
});
