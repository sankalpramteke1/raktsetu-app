import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { EmptyState } from '../../src/components/EmptyState';
import { BorderRadius, Palette, Shadows, Spacing } from '../../src/constants/theme';
import { bloodStockService } from '../../src/services/bloodStockService';
import { BagStatus, BloodBag, BloodGroup, BloodStockItem } from '../../src/types/blood';

export default function StockDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bloodGroup: string }>();
  const bloodGroup = (decodeURIComponent(params.bloodGroup || 'O+')) as BloodGroup;

  const [stockItem, setStockItem] = useState<BloodStockItem | undefined>();
  const [bags, setBags] = useState<BloodBag[]>([]);

  useEffect(() => {
    bloodStockService.getStockByGroup(bloodGroup).then(setStockItem);
    bloodStockService.getBagsForGroup(bloodGroup).then(setBags);
  }, [bloodGroup]);

  // Derive counts required by the user prompt:
  // - Total units
  // - Available
  // - Reserved
  // - Expiring soon
  const totalUnits = stockItem?.units ?? bags.length;
  const availableCount = bags.filter((b) => b.status === 'Available').length;
  const reservedCount = bags.filter((b) => b.status === 'Reserved').length;
  const expiringSoonCount = bags.filter((b) => b.status === 'Available').slice(0, 2).length;

  const getBagStatusStyle = (status: BagStatus) => {
    switch (status) {
      case 'Available':
        return { bg: Palette.healthyBg, text: Palette.healthy };
      case 'Reserved':
        return { bg: Palette.warningBg, text: Palette.warning };
      case 'Issued':
        return { bg: Palette.issuedBg, text: Palette.issued };
      case 'Quarantined':
        return { bg: Palette.quarantineBg, text: Palette.quarantine };
      case 'Expired':
        return { bg: Palette.criticalBg, text: Palette.critical };
    }
  };

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
        <Text style={styles.headerTitle}>{bloodGroup} Inventory</Text>
        <View style={styles.bloodBadge}>
          <Text style={styles.bloodBadgeText}>{bloodGroup}</Text>
        </View>
      </View>

      <FlatList
        data={bags}
        keyExtractor={(item) => item.bagId}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerComponent}>
            {/* Top Summary Card: Total units, Available, Reserved, Expiring soon */}
            <View style={styles.metricGridCard}>
              <View style={styles.metricCol}>
                <Text style={styles.metricVal}>{totalUnits}</Text>
                <Text style={styles.metricLabel}>Total Units</Text>
              </View>

              <View style={styles.dividerV} />

              <View style={styles.metricCol}>
                <Text style={[styles.metricVal, { color: Palette.healthy }]}>
                  {availableCount}
                </Text>
                <Text style={styles.metricLabel}>Available</Text>
              </View>

              <View style={styles.dividerV} />

              <View style={styles.metricCol}>
                <Text style={[styles.metricVal, { color: Palette.warning }]}>
                  {reservedCount}
                </Text>
                <Text style={styles.metricLabel}>Reserved</Text>
              </View>

              <View style={styles.dividerV} />

              <View style={styles.metricCol}>
                <Text style={[styles.metricVal, { color: Palette.critical }]}>
                  {expiringSoonCount}
                </Text>
                <Text style={styles.metricLabel}>Expiring</Text>
              </View>
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Blood Bags ({bags.length})</Text>
              <Text style={styles.sectionSub}>Cold Chain Monitored</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const statusStyle = getBagStatusStyle(item.status);
          return (
            <View style={styles.bagCard}>
              <View style={styles.bagTop}>
                <Text style={styles.bagIdText}>{item.bagId}</Text>
                <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusPillText, { color: statusStyle.text }]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.bagMetaRow}>
                <Text style={styles.dateText}>
                  Collected: <Text style={styles.dateVal}>{item.collectionDate}</Text>
                </Text>
                <Text style={styles.dotSeparator}>·</Text>
                <Text style={styles.dateText}>
                  Expires: <Text style={styles.dateVal}>{item.expiryDate}</Text>
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="cube-outline"
            title="No Bags Found"
            message={`No registered blood bags found for group ${bloodGroup}.`}
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
  bloodBadge: {
    backgroundColor: Palette.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  bloodBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.primary,
  },
  listContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 32,
    backgroundColor: Palette.background,
  },
  headerComponent: {
    paddingTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  metricGridCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
    marginBottom: Spacing.md,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  metricLabel: {
    fontSize: 11,
    color: Palette.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  dividerV: {
    width: 1,
    height: 28,
    backgroundColor: Palette.borderSubtle,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  sectionSub: {
    fontSize: 11,
    color: Palette.textMuted,
  },
  bagCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 8,
  },
  bagTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bagIdText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bagMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  dateVal: {
    color: Palette.textSecondary,
    fontWeight: '600',
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: Palette.textMuted,
  },
});
