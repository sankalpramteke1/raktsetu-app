import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../src/components/EmptyState';
import { FilterChips } from '../../src/components/FilterChips';
import { Header } from '../../src/components/Header';
import { RequestCard } from '../../src/components/RequestCard';
import { SearchBar } from '../../src/components/SearchBar';
import { BorderRadius, GlassStyles, Palette, Shadows, Spacing } from '../../src/constants/theme';
import { requestService } from '../../src/services/requestService';

export default function RequestsScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = async () => { try { setRequests(await requestService.getAllRequests()); } catch (e) { console.error(e); } };
  useEffect(() => { loadRequests(); }, []);
  const handleRefresh = async () => { setRefreshing(true); await loadRequests(); setRefreshing(false); };

  const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Ready', value: 'Ready' },
    { label: 'Issued', value: 'Issued' },
  ];

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (statusFilter !== 'All' && req.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return req.patientName.toLowerCase().includes(q) || req.requestId.toLowerCase().includes(q) || req.patientId.toLowerCase().includes(q) || req.bloodGroup.toLowerCase().includes(q);
      }
      return true;
    });
  }, [requests, statusFilter, searchQuery]);

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Blood Requests" subtitle="Requisitions & Tracking" />
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.requestId}
        renderItem={({ item }) => <RequestCard request={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Palette.primary]} tintColor={Palette.primary} />}
        ListHeaderComponent={
          <View style={styles.headerComponent}>
            <Pressable style={({ pressed }) => [styles.newReqBtn, pressed && { opacity: 0.85 }]} onPress={() => router.push('/requisition')}>
              <View style={styles.newReqBtnLeft}>
                <View style={styles.newReqIcon}><Ionicons name="document-text" size={20} color={Palette.white} /></View>
                <View>
                  <Text style={styles.newReqBtnTitle}>New Blood Requisition</Text>
                  <Text style={styles.newReqBtnSub}>Fill form for hospital ward</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Palette.white} />
            </Pressable>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}><Text style={styles.summaryNumber}>{requests.length}</Text><Text style={styles.summaryLabel}>Total</Text></View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}><Text style={[styles.summaryNumber, { color: Palette.warning }]}>{pendingCount}</Text><Text style={styles.summaryLabel}>Pending</Text></View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}><Text style={[styles.summaryNumber, { color: Palette.healthy }]}>{requests.filter((r) => r.status === 'Issued' || r.status === 'Completed').length}</Text><Text style={styles.summaryLabel}>Done</Text></View>
            </View>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search patient, ID, blood group..." />
            <FilterChips options={filterOptions} selected={statusFilter} onSelect={setStatusFilter} />
            <View style={styles.countRow}>
              <Text style={styles.countText}>Showing <Text style={{ fontWeight: '700', color: Palette.textPrimary }}>{filteredRequests.length}</Text> requisitions</Text>
              {pendingCount > 0 && <View style={styles.pendingBadge}><Text style={styles.pendingBadgeText}>{pendingCount} pending</Text></View>}
            </View>
          </View>
        }
        ListEmptyComponent={<EmptyState icon="document-text-outline" title="No Requisitions Found" message={'No requisitions found matching "' + statusFilter + '".'} actionText="Show All" onAction={() => { setSearchQuery(''); setStatusFilter('All'); }} />}
        ListFooterComponent={<View style={{ height: 80 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.background },
  listContent: { paddingHorizontal: Spacing.screenPadding, paddingTop: Spacing.sm, paddingBottom: 32, backgroundColor: Palette.background },
  headerComponent: { marginBottom: Spacing.xs, gap: Spacing.sm },
  newReqBtn: { backgroundColor: Palette.primary, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.lg, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xs, ...Shadows.glow },
  newReqBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  newReqIcon: { width: 40, height: 40, borderRadius: BorderRadius.md, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  newReqBtnTitle: { fontSize: 15, fontWeight: '700', color: Palette.white },
  newReqBtnSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  summaryRow: { ...GlassStyles.card, flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNumber: { fontSize: 20, fontWeight: '800', color: Palette.textPrimary, letterSpacing: -0.4 },
  summaryLabel: { fontSize: 11, color: Palette.textMuted, fontWeight: '600', marginTop: 2 },
  summaryDivider: { width: 1, height: 28, backgroundColor: Palette.borderSubtle },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 2, marginTop: 2 },
  countText: { fontSize: 12, color: Palette.textMuted },
  pendingBadge: { backgroundColor: Palette.warningBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Palette.warningBorder },
  pendingBadgeText: { fontSize: 11, fontWeight: '700', color: Palette.warning },
});
