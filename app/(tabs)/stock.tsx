import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { BloodGroupCard } from '../../src/components/BloodGroupCard';
import { EmptyState } from '../../src/components/EmptyState';
import { FilterChips } from '../../src/components/FilterChips';
import { Header } from '../../src/components/Header';
import { BorderRadius, GlassStyles, Palette, Spacing } from '../../src/constants/theme';
import { bloodStockService } from '../../src/services/bloodStockService';

export default function StockScreen() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadStock = async () => {
    try {
      const [s, sum] = await Promise.all([bloodStockService.getAllStock(), bloodStockService.getStockSummary()]);
      setItems(s);
      setSummary(sum);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadStock(); }, []);

  const handleRefresh = async () => { setRefreshing(true); await loadStock(); setRefreshing(false); };

  const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Available', value: 'Available' },
    { label: 'Low', value: 'Low' },
    { label: 'Critical', value: 'Critical' },
  ];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter === 'All') return true;
      if (statusFilter === 'Available') return item.status === 'Healthy' || item.status === 'Moderate';
      if (statusFilter === 'Low') return item.status === 'Low';
      if (statusFilter === 'Critical') return item.status === 'Critical';
      return true;
    });
  }, [items, statusFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Blood Stock" subtitle="District Hospital, Durg" />
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.bloodGroup}
        renderItem={({ item }) => <BloodGroupCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Palette.primary]} tintColor={Palette.primary} />}
        ListHeaderComponent={
          <View style={styles.headerComponent}>
            <View style={styles.summaryBar}>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryVal}>{items.length} Groups</Text>
                <Text style={styles.summaryLabel}>In Stock</Text>
              </View>
              <View style={styles.dividerV} />
              <View style={styles.summaryCol}>
                <Text style={[styles.summaryVal, { color: Palette.primary }]}>{summary?.totalUnits ?? 219} U</Text>
                <Text style={styles.summaryLabel}>Total</Text>
              </View>
              <View style={styles.dividerV} />
              <View style={styles.summaryCol}>
                <Text style={[styles.summaryVal, { color: Palette.critical }]}>{summary?.criticalCount ?? 2}</Text>
                <Text style={styles.summaryLabel}>Critical</Text>
              </View>
            </View>
            <FilterChips options={filterOptions} selected={statusFilter} onSelect={setStatusFilter} />
          </View>
        }
        ListEmptyComponent={<EmptyState title="No Blood Groups Match" message={'No groups found for "' + statusFilter + '" filter.'} actionText="Show All" onAction={() => setStatusFilter('All')} />}
        ListFooterComponent={<View style={{ height: 80 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.background },
  listContent: { paddingHorizontal: Spacing.screenPadding, paddingTop: Spacing.sm, paddingBottom: 32, backgroundColor: Palette.background },
  headerComponent: { marginBottom: Spacing.sm },
  summaryBar: { ...GlassStyles.card, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  summaryCol: { flex: 1, alignItems: 'center' },
  summaryVal: { fontSize: 16, fontWeight: '800', color: Palette.textPrimary },
  summaryLabel: { fontSize: 10, color: Palette.textMuted, fontWeight: '500', marginTop: 2 },
  dividerV: { width: 1, height: 24, backgroundColor: Palette.borderSubtle },
});
