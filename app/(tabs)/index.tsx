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

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { borderLeftColor: Palette.healthy }]}>
            <Text style={styles.statNumber}>{stockStats?.addedToday ?? 24}</Text>
            <Text style={styles.statLabel}>Units{'\n'}Collected</Text>
          </View>
          <View style={[styles.statBox, { borderLeftColor: Palette.issued }]}>
            <Text style={styles.statNumber}>{stockStats?.issuedToday ?? 17}</Text>
            <Text style={styles.statLabel}>Units{'\n'}Issued</Text>
          </View>
          <View style={[styles.statBox, { borderLeftColor: Palette.moderate }]}>
            <Text style={styles.statNumber}>{stockStats?.totalUnits ?? 219}</Text>
            <Text style={styles.statLabel}>Total{'\n'}Stock</Text>
          </View>
          <View style={[styles.statBox, { borderLeftColor: Palette.warning }]}>
            <Text style={[styles.statNumber, { color: Palette.warning }]}>
              {pendingRequests.length || 7}
            </Text>
            <Text style={styles.statLabel}>Pending{'\n'}Requests</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <Pressable
              style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressed]}
              onPress={() => router.push('/requisition' as any)}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="document-text" size={22} color={Palette.primary} />
              </View>
              <Text style={styles.quickActionLabel}>Requisition{'\n'}Form</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressed]}
              onPress={() => router.push('/(tabs)/requests')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="hourglass" size={22} color={Palette.warning} />
              </View>
              <Text style={styles.quickActionLabel}>Blood{'\n'}Requests</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressed]}
              onPress={() => router.push('/(tabs)/stock')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="water" size={22} color={Palette.moderate} />
              </View>
              <Text style={styles.quickActionLabel}>Blood{'\n'}Stock</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressed]}
              onPress={() => router.push('/(tabs)/camps')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="calendar" size={22} color={Palette.healthy} />
              </View>
              <Text style={styles.quickActionLabel}>Donation{'\n'}Camps</Text>
            </Pressable>
          </View>
        </View>

        {/* Critical Alerts */}
        {criticalStock.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.alertDot} />
              <Text style={[styles.sectionTitle, { color: Palette.critical }]}>
                Critical Alerts
              </Text>
            </View>
            <View style={styles.alertsBanner}>
              {criticalStock.slice(0, 3).map((item) => (
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
                    <Text style={styles.alertUnits}>{item.units} units</Text>
                    <Text style={styles.alertStatus}>{item.status} level</Text>
                  </View>
                  <View
                    style={[
                      styles.alertStatusDot,
                      {
                        backgroundColor:
                          item.status === 'Critical' ? Palette.critical : Palette.warning,
                      },
                    ]}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Blood Stock Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Blood Stock</Text>
            <Pressable
              onPress={() => router.push('/(tabs)/stock')}
              style={({ pressed }) => [styles.viewAllBtn, pressed && styles.pressed]}>
              <Text style={styles.viewAllText}>View all</Text>
              <Ionicons name="chevron-forward" size={13} color={Palette.primary} />
            </Pressable>
          </View>
          <View style={styles.stockGrid}>
            {topStockGroups.map((item) => (
              <BloodGroupCard key={item.bloodGroup} item={item} compact={true} />
            ))}
          </View>
        </View>

        {/* Featured Camp */}
        {featuredCamp && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Donation Camp</Text>
              <Pressable
                onPress={() => router.push('/(tabs)/camps')}
                style={({ pressed }) => [styles.viewAllBtn, pressed && styles.pressed]}>
                <Text style={styles.viewAllText}>View all</Text>
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
                <Text style={styles.campMetaDot}>·</Text>
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
          <Text style={styles.sectionTitle}>Recent Activity</Text>
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
    paddingBottom: 32,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.md,
    padding: 12,
    borderLeftWidth: 3,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Palette.border,
    borderRightColor: Palette.border,
    borderBottomColor: Palette.border,
    ...Shadows.subtle,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    color: Palette.textMuted,
    fontWeight: '600',
    marginTop: 3,
    lineHeight: 13,
  },

  // Section
  section: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
    marginBottom: Spacing.sm,
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
    fontWeight: '600',
    color: Palette.primary,
  },
  pressed: {
    opacity: 0.75,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
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
    fontWeight: '600',
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },

  // Critical Alerts
  alertDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Palette.critical,
    marginRight: 6,
    marginBottom: Spacing.sm,
  },
  alertsBanner: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    overflow: 'hidden',
    ...Shadows.subtle,
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
    borderRadius: BorderRadius.sm,
    backgroundColor: Palette.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBloodText: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.primary,
  },
  alertInfo: {
    flex: 1,
  },
  alertUnits: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  alertStatus: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 1,
    textTransform: 'capitalize',
  },
  alertStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
    borderColor: Palette.border,
    ...Shadows.subtle,
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
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 6,
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
  },
  campMetaDot: {
    fontSize: 12,
    color: Palette.textMuted,
    marginHorizontal: 2,
  },

  // Activity
  activityList: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    ...Shadows.subtle,
  },
});
