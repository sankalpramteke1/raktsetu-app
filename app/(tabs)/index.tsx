import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ActivityItem } from '../../src/components/ActivityItem';
import { BloodGroupCard } from '../../src/components/BloodGroupCard';
import { Header } from '../../src/components/Header';
import { RequestCard } from '../../src/components/RequestCard';
import { BorderRadius, Palette, Shadows, Spacing } from '../../src/constants/theme';
import { activityService } from '../../src/services/activityService';
import { bloodStockService } from '../../src/services/bloodStockService';
import { campService } from '../../src/services/campService';
import { requestService } from '../../src/services/requestService';
import { ActivityItemType } from '../../src/types/activity';
import { BloodStockItem, StockSummaryStats } from '../../src/types/blood';
import { BloodDonationCamp } from '../../src/types/camp';
import { BloodRequest } from '../../src/types/request';

export default function DashboardScreen() {
  const router = useRouter();
  const [stockItems, setStockItems] = useState<BloodStockItem[]>([]);
  const [stockStats, setStockStats] = useState<StockSummaryStats | null>(null);
  const [pendingRequests, setPendingRequests] = useState<BloodRequest[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItemType[]>([]);
  const [featuredCamp, setFeaturedCamp] = useState<BloodDonationCamp | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [stock, stats, requests, acts, camps] = await Promise.all([
        bloodStockService.getAllStock(),
        bloodStockService.getStockSummary(),
        requestService.getPendingRequests(),
        activityService.getRecentActivities(3),
        campService.getAllCamps(),
      ]);
      setStockItems(stock);
      setStockStats(stats);
      setPendingRequests(requests.slice(0, 2));
      setRecentActivities(acts);
      const featured =
        camps.find((c) => c.status === 'Ongoing') ||
        camps.find((c) => c.status === 'Upcoming') ||
        camps[0];
      setFeaturedCamp(featured || null);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const topStockGroups = stockItems.filter((i) =>
    ['A+', 'B+', 'O+', 'AB+'].includes(i.bloodGroup)
  );

  const criticalStock = stockItems.filter((i) => i.status === 'Critical' || i.status === 'Low');

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showGreeting={true} />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Palette.primary]}
            tintColor={Palette.primary}
          />
        }>

        {/* Hero Operational Banner */}
        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <View style={styles.heroBadge}>
                <Ionicons name="shield-checkmark" size={13} color={Palette.healthy} />
                <Text style={styles.heroBadgeText}>Optimal Operations</Text>
              </View>
              <Text style={styles.heroSubText}>Durg District Central Hub</Text>
            </View>

            <View style={styles.heroMainRow}>
              <View>
                <Text style={styles.heroMetricLabel}>Total Tested Reserve</Text>
                <View style={styles.heroMetricValueRow}>
                  <Text style={styles.heroMetricValue}>{stockStats?.totalUnits ?? 219}</Text>
                  <Text style={styles.heroMetricUnits}>Units Ready</Text>
                </View>
              </View>
              <View style={styles.heroDropIcon}>
                <Ionicons name="water" size={28} color={Palette.primary} />
              </View>
            </View>

            {/* 3 Metric Pills inside Hero */}
            <View style={styles.heroMetricsGrid}>
              <View style={styles.heroMetricPill}>
                <Text style={styles.heroMetricPillVal}>{stockStats?.addedToday ?? 14}</Text>
                <Text style={styles.heroMetricPillLbl}>Collected Today</Text>
              </View>
              <View style={styles.heroMetricPillDivider} />
              <View style={styles.heroMetricPill}>
                <Text style={[styles.heroMetricPillVal, { color: Palette.critical }]}>
                  {stockStats?.criticalCount ?? 2}
                </Text>
                <Text style={styles.heroMetricPillLbl}>Critical Low</Text>
              </View>
              <View style={styles.heroMetricPillDivider} />
              <View style={styles.heroMetricPill}>
                <Text style={[styles.heroMetricPillVal, { color: Palette.moderate }]}>
                  {pendingRequests.length}
                </Text>
                <Text style={styles.heroMetricPillLbl}>Pending Req.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Action Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <Pressable
              style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressed]}
              onPress={() => router.push('/requisition')}>
              <View style={[styles.quickActionIcon, { backgroundColor: Palette.primarySurface }]}>
                <Ionicons name="add-circle" size={22} color={Palette.primary} />
              </View>
              <Text style={styles.quickActionLabel}>Request Blood</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressed]}
              onPress={() => router.push('/(tabs)/stock')}>
              <View style={[styles.quickActionIcon, { backgroundColor: Palette.healthyBg }]}>
                <Ionicons name="water" size={22} color={Palette.healthy} />
              </View>
              <Text style={styles.quickActionLabel}>Stock Level</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressed]}
              onPress={() => router.push('/(tabs)/camps')}>
              <View style={[styles.quickActionIcon, { backgroundColor: Palette.moderateBg }]}>
                <Ionicons name="calendar" size={22} color={Palette.moderate} />
              </View>
              <Text style={styles.quickActionLabel}>Blood Camps</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressed]}
              onPress={() => router.push('/(tabs)/reports')}>
              <View style={[styles.quickActionIcon, { backgroundColor: Palette.warningBg }]}>
                <Ionicons name="bar-chart" size={22} color={Palette.warning} />
              </View>
              <Text style={styles.quickActionLabel}>Analytics</Text>
            </Pressable>
          </View>
        </View>

        {/* Critical Stock Alerts */}
        {criticalStock.length > 0 && (
          <View style={styles.section}>
            <View style={styles.alertHeaderRow}>
              <View style={styles.alertDot} />
              <Text style={styles.sectionTitleAlert}>Critical Restock Alert</Text>
            </View>

            <View style={styles.alertsBanner}>
              {criticalStock.slice(0, 2).map((item) => (
                <Pressable
                  key={item.bloodGroup}
                  style={({ pressed }) => [styles.alertItem, pressed && styles.pressed]}
                  onPress={() =>
                    router.push({
                      pathname: '/stock/[bloodGroup]',
                      params: { bloodGroup: encodeURIComponent(item.bloodGroup) },
                    })
                  }>
                  <View style={styles.alertBloodBadge}>
                    <Text style={styles.alertBloodText}>{item.bloodGroup}</Text>
                  </View>

                  <View style={styles.alertInfo}>
                    <Text style={styles.alertUnits}>{item.units} units remaining</Text>
                    <Text style={styles.alertStatus}>
                      Target: {item.optimalLevel} units • {item.status}
                    </Text>
                  </View>

                  <View style={styles.restockBadge}>
                    <Text style={styles.restockText}>Restock</Text>
                    <Ionicons name="chevron-forward" size={13} color={Palette.primary} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Blood Stock Quick Snapshot */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Blood Reserve Snapshot</Text>
            <Pressable
              onPress={() => router.push('/(tabs)/stock')}
              style={({ pressed }) => [styles.viewAllBtn, pressed && styles.pressed]}>
              <Text style={styles.viewAllText}>All groups</Text>
              <Ionicons name="chevron-forward" size={13} color={Palette.primary} />
            </Pressable>
          </View>

          <View style={styles.stockGrid}>
            {topStockGroups.map((item) => (
              <BloodGroupCard key={item.bloodGroup} item={item} compact={true} />
            ))}
          </View>
        </View>

        {/* Featured Donation Camp */}
        {featuredCamp && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Featured Blood Drive</Text>
              <Pressable
                onPress={() => router.push('/(tabs)/camps')}
                style={({ pressed }) => [styles.viewAllBtn, pressed && styles.pressed]}>
                <Text style={styles.viewAllText}>All drives</Text>
                <Ionicons name="chevron-forward" size={13} color={Palette.primary} />
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.campCard,
                featuredCamp.status === 'Ongoing' && styles.campCardOngoing,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                router.push({
                  pathname: '/camps/[id]',
                  params: { id: featuredCamp.id },
                })
              }>
              <View style={styles.campCardTop}>
                <View
                  style={[
                    styles.campStatusTag,
                    featuredCamp.status === 'Ongoing' && styles.campStatusTagLive,
                  ]}>
                  {featuredCamp.status === 'Ongoing' && <View style={styles.pulseDot} />}
                  <Text
                    style={[
                      styles.campStatusText,
                      featuredCamp.status === 'Ongoing' && styles.campStatusTextLive,
                    ]}>
                    {featuredCamp.status === 'Ongoing' ? 'LIVE NOW' : featuredCamp.status.toUpperCase()}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Palette.textMuted} />
              </View>
              <Text style={styles.campName} numberOfLines={1}>
                {featuredCamp.name}
              </Text>
              <View style={styles.campMeta}>
                <Ionicons name="calendar-outline" size={13} color={Palette.textSecondary} />
                <Text style={styles.campMetaText}>{featuredCamp.date}</Text>
                <Text style={styles.campMetaDot}>•</Text>
                <Ionicons name="location-outline" size={13} color={Palette.textSecondary} />
                <Text style={styles.campMetaText} numberOfLines={1}>
                  {featuredCamp.venue}
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Recent Requests</Text>
              <Pressable
                onPress={() => router.push('/(tabs)/requests')}
                style={({ pressed }) => [styles.viewAllBtn, pressed && styles.pressed]}>
                <Text style={styles.viewAllText}>View all</Text>
                <Ionicons name="chevron-forward" size={13} color={Palette.primary} />
              </Pressable>
            </View>
            {pendingRequests.map((req) => (
              <RequestCard key={req.requestId} request={req} />
            ))}
          </View>
        )}

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity Log</Text>
          <View style={styles.activityList}>
            {recentActivities.map((act, index) => (
              <ActivityItem
                key={act.id}
                activity={act}
                isLast={index === recentActivities.length - 1}
              />
            ))}
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
  scrollContainer: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  contentContainer: {
    paddingBottom: 36,
  },

  // Hero Section
  heroSection: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
  },
  heroCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    ...Shadows.card,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Palette.healthyBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Palette.healthyBorder,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.healthy,
  },
  heroSubText: {
    fontSize: 11,
    color: Palette.textMuted,
    fontWeight: '500',
  },
  heroMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroMetricLabel: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  heroMetricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  heroMetricValue: {
    fontSize: 32,
    fontWeight: '900',
    color: Palette.textPrimary,
    letterSpacing: -0.8,
  },
  heroMetricUnits: {
    fontSize: 14,
    color: Palette.primary,
    fontWeight: '700',
  },
  heroDropIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Palette.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  heroMetricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.background,
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  heroMetricPill: {
    flex: 1,
    alignItems: 'center',
  },
  heroMetricPillVal: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  heroMetricPillLbl: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.textMuted,
    marginTop: 1,
  },
  heroMetricPillDivider: {
    width: 1,
    height: 22,
    backgroundColor: Palette.border,
  },

  // Section
  section: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
    marginBottom: Spacing.sm,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs + 2,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.critical,
  },
  sectionTitleAlert: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.critical,
    letterSpacing: -0.2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderLight,
    ...Shadows.card,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textPrimary,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Critical Alerts
  alertsBanner: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.criticalBorder,
    overflow: 'hidden',
    ...Shadows.card,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    gap: 12,
  },
  alertBloodBadge: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Palette.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  alertBloodText: {
    fontSize: 16,
    fontWeight: '900',
    color: Palette.primary,
  },
  alertInfo: {
    flex: 1,
  },
  alertUnits: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  alertStatus: {
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 2,
  },
  restockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Palette.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  restockText: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.primary,
  },

  // Stock Grid
  stockGrid: {
    flexDirection: 'row',
    gap: 8,
  },

  // Camp Card
  campCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    ...Shadows.card,
  },
  campCardOngoing: {
    borderColor: Palette.healthyBorder,
    backgroundColor: '#FAFDFB',
  },
  campCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  campStatusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Palette.borderSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  campStatusTagLive: {
    backgroundColor: Palette.healthyBg,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.healthy,
  },
  campStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.textMuted,
    letterSpacing: 0.3,
  },
  campStatusTextLive: {
    color: Palette.healthy,
  },
  campName: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  campMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  campMetaText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  campMetaDot: {
    fontSize: 12,
    color: Palette.textMuted,
    marginHorizontal: 2,
  },

  // Activity
  activityList: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    overflow: 'hidden',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    ...Shadows.card,
  },
});
