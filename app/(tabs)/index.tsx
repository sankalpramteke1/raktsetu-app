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
import { LowStockAlertCard } from '../../src/components/LowStockAlertCard';
import { RequestCard } from '../../src/components/RequestCard';
import { SectionHeader } from '../../src/components/SectionHeader';
import { TodayOverviewCard } from '../../src/components/TodayOverviewCard';
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
        activityService.getRecentActivities(4),
        campService.getAllCamps(),
      ]);
      setStockItems(stock);
      setStockStats(stats);
      setPendingRequests(requests.slice(0, 3));
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

  // Top 4 representative groups for the compact dashboard stock pills
  const topStockGroups = stockItems.filter((i) =>
    ['A+', 'B+', 'O+', 'AB+'].includes(i.bloodGroup)
  );

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
        {/* Hero Section: Today's Overview (Icons + Large Numbers + Tiny Labels) */}
        <TodayOverviewCard
          collectedUnits={stockStats?.addedToday ?? 24}
          issuedUnits={stockStats?.issuedToday ?? 17}
          newDonors={8}
          pendingRequests={7}
        />

        {/* Low Stock Alert (One compact banner) */}
        <LowStockAlertCard group="O-" units={6} />

        {/* Blood Stock (Compact visual section with 4 pill cards + View all) */}
        <SectionHeader
          title="Blood Stock"
          count="8 groups"
          actionText="View all"
          onActionPress={() => router.push('/(tabs)/stock')}
        />

        <View style={styles.stockPillGrid}>
          {topStockGroups.map((item) => (
            <BloodGroupCard key={item.bloodGroup} item={item} compact={true} />
          ))}
        </View>

        {/* Blood Donation Camps Spotlight */}
        {featuredCamp && (
          <>
            <SectionHeader
              title="Donation Camps"
              count={featuredCamp.status === 'Ongoing' ? '1 ongoing' : 'Upcoming'}
              actionText="View all"
              onActionPress={() => router.push('/(tabs)/camps')}
            />
            <Pressable
              style={({ pressed }) => [
                styles.campSpotlightCard,
                featuredCamp.status === 'Ongoing' && styles.campOngoingBorder,
                pressed && styles.cardPressed,
              ]}
              onPress={() =>
                router.push({
                  pathname: '/camps/[id]',
                  params: { id: featuredCamp.id },
                })
              }>
              <View style={styles.campSpotlightHeader}>
                <View
                  style={[
                    styles.campLiveTag,
                    featuredCamp.status === 'Ongoing' && styles.campLiveTagActive,
                  ]}>
                  {featuredCamp.status === 'Ongoing' && <View style={styles.campPulseDot} />}
                  <Text
                    style={[
                      styles.campLiveText,
                      featuredCamp.status === 'Ongoing' && styles.campLiveTextActive,
                    ]}>
                    {featuredCamp.status === 'Ongoing' ? 'LIVE NOW' : featuredCamp.status}
                  </Text>
                </View>
                <Text style={styles.campTypeLabel}>{featuredCamp.type}</Text>
              </View>

              <Text style={styles.campSpotlightTitle} numberOfLines={1}>
                {featuredCamp.name}
              </Text>

              <View style={styles.campSpotlightMeta}>
                <View style={styles.campMetaItem}>
                  <Ionicons name="calendar-outline" size={13} color={Palette.textSecondary} />
                  <Text style={styles.campMetaText}>{featuredCamp.date}</Text>
                </View>
                <Text style={styles.campDot}>·</Text>
                <View style={[styles.campMetaItem, { flex: 1 }]}>
                  <Ionicons name="location-outline" size={13} color={Palette.textSecondary} />
                  <Text style={styles.campMetaText} numberOfLines={1}>
                    {featuredCamp.venue}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={15} color={Palette.textMuted} />
              </View>
            </Pressable>
          </>
        )}

        {/* Urgent Pending Requests (2–3 items only) */}
        <SectionHeader
          title="Recent Requests"
          count={pendingRequests.length}
          actionText="View all"
          onActionPress={() => router.push('/(tabs)/requests')}
        />

        {pendingRequests.map((req) => (
          <RequestCard key={req.requestId} request={req} />
        ))}

        {/* Recent Activity (Compact 3–4 items) */}
        <SectionHeader
          title="Recent Activity"
          actionText="View all"
          onActionPress={() => router.push('/(tabs)/requests')}
        />

        <View style={styles.activityCard}>
          {recentActivities.map((act, index) => (
            <ActivityItem
              key={act.id}
              activity={act}
              isLast={index === recentActivities.length - 1}
            />
          ))}
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
    padding: Spacing.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: 32,
    gap: 8,
  },
  stockPillGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  activityCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
    marginBottom: Spacing.md,
  },
  campSpotlightCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
  },
  campOngoingBorder: {
    borderColor: Palette.healthyBorder,
    backgroundColor: '#FAFDFB',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  campSpotlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  campLiveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Palette.surface,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  campLiveTagActive: {
    backgroundColor: Palette.healthyBg,
    borderColor: Palette.healthyBorder,
  },
  campPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.healthy,
  },
  campLiveText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.textSecondary,
    textTransform: 'uppercase',
  },
  campLiveTextActive: {
    color: Palette.healthy,
  },
  campTypeLabel: {
    fontSize: 11,
    color: Palette.textMuted,
    fontWeight: '500',
  },
  campSpotlightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 6,
  },
  campSpotlightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  campMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  campMetaText: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  campDot: {
    fontSize: 12,
    color: Palette.textMuted,
  },
});
