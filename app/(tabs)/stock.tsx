import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BloodGroupCard } from '../../src/components/BloodGroupCard';
import { EmptyState } from '../../src/components/EmptyState';
import { FilterChips } from '../../src/components/FilterChips';
import { Header } from '../../src/components/Header';
import { BorderRadius, Palette, Shadows, Spacing } from '../../src/constants/theme';
import { bloodStockService } from '../../src/services/bloodStockService';
import { BloodStockItem, StockStatus, StockSummaryStats } from '../../src/types/blood';

type StockStatusFilter = 'All' | 'Available' | 'Low' | 'Critical';

export default function StockScreen() {
  const [items, setItems] = useState<BloodStockItem[]>([]);
  const [summary, setSummary] = useState<StockSummaryStats | null>(null);
  const [statusFilter, setStatusFilter] = useState<StockStatusFilter>('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadStock = async () => {
    try {
      const [stockData, summaryData] = await Promise.all([
        bloodStockService.getAllStock(),
        bloodStockService.getStockSummary(),
      ]);
      setItems(stockData);
      setSummary(summaryData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStock();
    setRefreshing(false);
  };

  const filterOptions: { label: string; value: StockStatusFilter }[] = [
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
            {/* Top Inventory Summary Bar */}
            <View style={styles.summaryBar}>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryVal}>{items.length} Groups</Text>
                <Text style={styles.summaryLabel}>Tested In Stock</Text>
              </View>

              <View style={styles.dividerV} />

              <View style={styles.summaryCol}>
                <Text style={[styles.summaryVal, { color: Palette.primary }]}>
                  {summary?.totalUnits ?? 219} Units
                </Text>
                <Text style={styles.summaryLabel}>Total Available</Text>
              </View>

              <View style={styles.dividerV} />

              <View style={styles.summaryCol}>
                <Text style={[styles.summaryVal, { color: Palette.critical }]}>
                  {summary?.criticalCount ?? 2} Groups
                </Text>
                <Text style={styles.summaryLabel}>Critical Level</Text>
              </View>
            </View>

            {/* Filter Chips: All | Available | Low | Critical */}
            <FilterChips
              options={filterOptions}
              selected={statusFilter}
              onSelect={setStatusFilter}
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No Blood Groups Match"
            message={`No blood groups found matching the "${statusFilter}" status filter.`}
            actionText="Show All Groups"
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
  summaryBar: {
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
    marginBottom: Spacing.sm,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  summaryLabel: {
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
});
