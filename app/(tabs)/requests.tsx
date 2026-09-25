import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
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
import { BorderRadius, Palette, Shadows, Spacing } from '../../src/constants/theme';
import { requestService } from '../../src/services/requestService';
import { BloodRequest, RequestStatus } from '../../src/types/request';

type StatusFilter = 'All' | RequestStatus;

export default function RequestsScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
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

  const counts = useMemo(() => {
    return {
      all: requests.length,
      pending: requests.filter((r) => r.status === 'Pending').length,
      processing: requests.filter((r) => r.status === 'Processing').length,
      ready: requests.filter((r) => r.status === 'Ready').length,
      issued: requests.filter((r) => r.status === 'Issued' || r.status === 'Completed').length,
    };
  }, [requests]);

  const filterOptions = [
    { label: 'All', value: 'All' as StatusFilter, badge: counts.all },
    { label: 'Pending', value: 'Pending' as StatusFilter, badge: counts.pending },
    { label: 'Processing', value: 'Processing' as StatusFilter, badge: counts.processing },
    { label: 'Ready', value: 'Ready' as StatusFilter, badge: counts.ready },
    { label: 'Issued', value: 'Issued' as StatusFilter, badge: counts.issued },
  ];

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (statusFilter === 'All') return true;
      if (statusFilter === 'Issued') return req.status === 'Issued' || req.status === 'Completed';
      return req.status === statusFilter;
    });
  }, [requests, statusFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Blood Requisitions" subtitle="Ward & Emergency Requests" />

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.requestId}
        renderItem={({ item }) => <RequestCard request={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
            {/* Quick Action Bar: New Request Button */}
            <Pressable
              style={({ pressed }) => [styles.newReqBtn, pressed && styles.pressed]}
              onPress={() => router.push('/requisition')}>
              <Ionicons name="add-circle" size={18} color={Palette.white} />
              <Text style={styles.newReqText}>Create New Requisition</Text>
            </Pressable>

            {/* Filter Chips */}
            <FilterChips
              options={filterOptions}
              selected={statusFilter}
              onSelect={setStatusFilter}
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No Requisitions Found"
            message={`No blood requests match the "${statusFilter}" filter right now.`}
            actionText="Clear Filter"
            onAction={() => setStatusFilter('All')}
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
    paddingBottom: 36,
    backgroundColor: Palette.background,
  },
  headerComponent: {
    marginBottom: Spacing.sm,
  },
  newReqBtn: {
    backgroundColor: Palette.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: 13,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  newReqText: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.white,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
