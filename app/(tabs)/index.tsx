import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActivityItem } from '../../src/components/ActivityItem';
import { BloodGroupCard } from '../../src/components/BloodGroupCard';
import { Header } from '../../src/components/Header';
import { RequestCard } from '../../src/components/RequestCard';
import { BorderRadius, GlassStyles, Palette, Shadows, Spacing } from '../../src/constants/theme';
import { activityService } from '../../src/services/activityService';
import { bloodStockService } from '../../src/services/bloodStockService';
import { campService } from '../../src/services/campService';
import { requestService } from '../../src/services/requestService';

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [stockItems, setStockItems] = useState([]);
  const [stockStats, setStockStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [featuredCamp, setFeaturedCamp] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const [stock, stats, requests, camps, activities] = await Promise.all([
        bloodStockService.getAllStock(),
        bloodStockService.getStockSummary(),
        requestService.getRecentRequests(3),
        campService.getFeaturedCamp(),
        activityService.getRecentActivities(5),
      ]);
      setStockItems(stock);
      setStockStats(stats);
      setPendingRequests(requests);
      setFeaturedCamp(camps);
      setRecentActivities(activities);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const topStockGroups = stockItems.filter((i) => ['A+', 'B+', 'O+', 'AB+'].includes(i.bloodGroup));
  const criticalStock = stockItems.filter((i) => i.status === 'Critical' || i.status === 'Low');

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showGreeting={true} />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Palette.primary]} tintColor={Palette.primary} />}>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { val: stockStats?.addedToday ?? 24, label: 'Units\nCollected', color: Palette.healthy },
            { val: stockStats?.issuedToday ?? 17, label: 'Units\nIssued', color: Palette.issued },
            { val: stockStats?.totalUnits ?? 219, label: 'Total\nStock', color: Palette.moderate },
            { val: pendingRequests.length || 7, label: 'Pending\nRequests', color: Palette.warning },
          ].map((s, i) => (
            <View key={i} style={styles.statBox}>
              <View style={[styles.statGlow, { backgroundColor: s.color + '20' }]} />
              <Text style={[styles.statNumber, { color: s.color }]}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {[
              { icon: 'document-text', label: 'Requisition\nForm', color: Palette.primary, bg: Palette.primarySurface, route: '/requisition' },
              { icon: 'hourglass', label: 'Blood\nRequests', color: Palette.warning, bg: Palette.warningBg, route: '/(tabs)/requests' },
              { icon: 'water', label: 'Blood\nStock', color: Palette.moderate, bg: Palette.moderateBg, route: '/(tabs)/stock' },
              { icon: 'calendar', label: 'Donation\nCamps', color: Palette.healthy, bg: Palette.healthyBg, route: '/(tabs)/camps' },
            ].map((a, i) => (
              <Pressable key={i} style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressed]} onPress={() => router.push(a.route)}>
                <View style={[styles.quickActionIcon, { backgroundColor: a.bg }]}>
                  <Ionicons name={a.icon} size={22} color={a.color} />
                </View>
                <Text style={styles.quickActionLabel}>{a.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Critical Alerts */}
        {criticalStock.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.alertDot} />
              <Text style={[styles.sectionTitle, { color: Palette.critical }]}>Critical Alerts</Text>
            </View>
            <View style={styles.alertsBanner}>
              {criticalStock.slice(0, 3).map((item) => (
                <Pressable key={item.bloodGroup} style={({ pressed }) => [styles.alertItem, pressed && styles.pressed]}
                  onPress={() => router.push({ pathname: '/stock/[bloodGroup]', params: { bloodGroup: encodeURIComponent(item.bloodGroup) } })}>
                  <View style={styles.alertBloodBadge}>
                    <Text style={styles.alertBloodText}>{item.bloodGroup}</Text>
                  </View>
                  <View style={styles.alertInfo}>
                    <Text style={styles.alertUnits}>{item.units} units</Text>
                    <Text style={styles.alertStatus}>{item.status} level</Text>
                  </View>
                  <View style={[styles.alertStatusDot, { backgroundColor: item.status === 'Critical' ? Palette.critical : Palette.warning, shadowColor: item.status === 'Critical' ? Palette.critical : Palette.warning, shadowOpacity: 0.6, shadowRadius: 4, elevation: 2 }]} />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Blood Stock Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Blood Stock</Text>
            <Pressable onPress={() => router.push('/(tabs)/stock')} style={({ pressed }) => [styles.viewAllBtn, pressed && styles.pressed]}>
              <Text style={styles.viewAllText}>View all</Text>
              <Ionicons name="chevron-forward" size={13} color={Palette.primary} />
            </Pressable>
          </View>
          <View style={styles.stockGrid}>
            {topStockGroups.map((item) => (<BloodGroupCard key={item.bloodGroup} item={item} compact={true} />))}
          </View>
        </View>

        {/* Featured Camp */}
        {featuredCamp && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Donation Camp</Text>
              <Pressable onPress={() => router.push('/(tabs)/camps')} style={({ pressed }) => [styles.viewAllBtn, pressed && styles.pressed]}>
                <Text style={styles.viewAllText}>View all</Text>
                <Ionicons name="chevron-forward" size={13} color={Palette.primary} />
              </Pressable>
            </View>
            <Pressable style={({ pressed }) => [styles.campCard, featuredCamp.status === 'Ongoing' && styles.campCardOngoing, pressed && styles.pressed]}
              onPress={() => router.push({ pathname: '/camps/[id]', params: { id: featuredCamp.id } })}>
              <View style={styles.campCardTop}>
                <View style={[styles.campStatusTag, featuredCamp.status === 'Ongoing' && styles.campStatusTagLive]}>
                  {featuredCamp.status === 'Ongoing' && <View style={styles.pulseDot} />}
                  <Text style={[styles.campStatusText, featuredCamp.status === 'Ongoing' && styles.campStatusTextLive]}>
                    {featuredCamp.status === 'Ongoing' ? 'LIVE NOW' : featuredCamp.status.toUpperCase()}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Palette.textMuted} />
              </View>
              <Text style={styles.campName} numberOfLines={1}>{featuredCamp.name}</Text>
              <View style={styles.campMeta}>
                <Ionicons name="calendar-outline" size={13} color={Palette.textSecondary} />
                <Text style={styles.campMetaText}>{featuredCamp.date}</Text>
                <Text style={styles.campMetaDot}>·</Text>
                <Ionicons name="location-outline" size={13} color={Palette.textSecondary} />
                <Text style={styles.campMetaText} numberOfLines={1}>{featuredCamp.venue}</Text>
              </View>
            </Pressable>
          </View>
        )}

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Recent Requests</Text>
              <Pressable onPress={() => router.push('/(tabs)/requests')} style={({ pressed }) => [styles.viewAllBtn, pressed && styles.pressed]}>
                <Text style={styles.viewAllText}>View all</Text>
                <Ionicons name="chevron-forward" size={13} color={Palette.primary} />
              </Pressable>
            </View>
            {pendingRequests.map((req) => (<RequestCard key={req.requestId} request={req} />))}
          </View>
        )}

        {/* Recent Activity */}
        <View style={[styles.section, { marginBottom: 80 }]}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivities.map((act, index) => (
              <ActivityItem key={act.id} activity={act} isLast={index === recentActivities.length - 1} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Palette.background },
  scrollContainer: { flex: 1, backgroundColor: Palette.background },
  contentContainer: { paddingBottom: 32 },
  statsRow: { flexDirection: 'row', paddingHorizontal: Spacing.screenPadding, paddingTop: Spacing.md, gap: 8 },
  statBox: {
    flex: 1,
    ...GlassStyles.card,
    padding: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  statGlow: { position: 'absolute', top: -10, right: -10, width: 40, height: 40, borderRadius: 20 },
  statNumber: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: 10, color: Palette.textMuted, fontWeight: '600', marginTop: 3, lineHeight: 13 },
  section: { paddingHorizontal: Spacing.screenPadding, paddingTop: Spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Palette.textPrimary, letterSpacing: -0.2, marginBottom: Spacing.sm },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAllText: { fontSize: 12, fontWeight: '600', color: Palette.primary },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  quickActionsGrid: { flexDirection: 'row', gap: 8 },
  quickActionBtn: {
    flex: 1,
    ...GlassStyles.card,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  quickActionIcon: { width: 44, height: 44, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickActionLabel: { fontSize: 11, fontWeight: '600', color: Palette.textSecondary, textAlign: 'center', lineHeight: 15 },
  alertDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Palette.critical, marginRight: 6, marginBottom: Spacing.sm, shadowColor: Palette.critical, shadowOpacity: 0.6, shadowRadius: 4, elevation: 2, shadowOffset: { width: 0, height: 0 } },
  alertsBanner: { ...GlassStyles.card, borderColor: Palette.criticalBorder, overflow: 'hidden' },
  alertItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Palette.borderSubtle, gap: 12 },
  alertBloodBadge: { width: 44, height: 44, borderRadius: BorderRadius.sm, backgroundColor: Palette.primarySurface, borderWidth: 1, borderColor: Palette.borderAccent, justifyContent: 'center', alignItems: 'center' },
  alertBloodText: { fontSize: 15, fontWeight: '800', color: Palette.primary },
  alertInfo: { flex: 1 },
  alertUnits: { fontSize: 15, fontWeight: '700', color: Palette.textPrimary },
  alertStatus: { fontSize: 12, color: Palette.textMuted, marginTop: 1, textTransform: 'capitalize' },
  alertStatusDot: { width: 8, height: 8, borderRadius: 4, shadowOffset: { width: 0, height: 0 } },
  stockGrid: { flexDirection: 'row', gap: 8 },
  campCard: { ...GlassStyles.card, padding: Spacing.md },
  campCardOngoing: { borderColor: Palette.healthyBorder, backgroundColor: 'rgba(0,230,118,0.05)' },
  campCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  campStatusTag: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Palette.surface, paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.xs },
  campStatusTagLive: { backgroundColor: Palette.healthyBg },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Palette.healthy, shadowColor: Palette.healthy, shadowOpacity: 0.6, shadowRadius: 4, elevation: 2, shadowOffset: { width: 0, height: 0 } },
  campStatusText: { fontSize: 10, fontWeight: '700', color: Palette.textMuted, letterSpacing: 0.3 },
  campStatusTextLive: { color: Palette.healthy },
  campName: { fontSize: 15, fontWeight: '700', color: Palette.textPrimary, marginBottom: 6 },
  campMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  campMetaText: { fontSize: 12, color: Palette.textSecondary },
  campMetaDot: { fontSize: 12, color: Palette.textMuted, marginHorizontal: 2 },
  activityList: { ...GlassStyles.card, overflow: 'hidden', paddingHorizontal: Spacing.md, paddingVertical: 4 },
});
