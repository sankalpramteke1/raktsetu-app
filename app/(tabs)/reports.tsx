import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FilterChips } from '../../src/components/FilterChips';
import { Header } from '../../src/components/Header';
import { SectionHeader } from '../../src/components/SectionHeader';
import { BorderRadius, Palette, Shadows, Spacing } from '../../src/constants/theme';
import { reportService } from '../../src/services/reportService';
import {
  BloodGroupDistributionItem,
  DailyTrendItem,
  ReportInsight,
  ReportSummary,
  ReportTimeframe,
} from '../../src/types/report';

export default function ReportsScreen() {
  const [timeframe, setTimeframe] = useState<ReportTimeframe>('This Month');
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [trends, setTrends] = useState<DailyTrendItem[]>([]);
  const [distribution, setDistribution] = useState<BloodGroupDistributionItem[]>([]);
  const [insights, setInsights] = useState<ReportInsight[]>([]);
  const [trendMetric, setTrendMetric] = useState<'collected' | 'issued'>('collected');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (tf: ReportTimeframe) => {
    try {
      const [s, t, d, ins] = await Promise.all([
        reportService.getSummary(tf),
        reportService.getTrend(),
        reportService.getBloodGroupDistribution(),
        reportService.getInsights(),
      ]);
      setSummary(s);
      setTrends(t);
      setDistribution(d);
      setInsights(ins);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData(timeframe);
  }, [timeframe]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(timeframe);
    setRefreshing(false);
  };

  const timeframeOptions: { label: string; value: ReportTimeframe }[] = [
    { label: 'Today', value: 'Today' },
    { label: 'Week', value: 'This Week' },
    { label: 'Month', value: 'This Month' },
    { label: 'Custom', value: 'Custom' },
  ];

  const maxVal = Math.max(...trends.map((t) => Math.max(t.collected, t.issued)), 65);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Reports" subtitle="Operational Analytics" />

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
        {/* Period Selector */}
        <FilterChips
          options={timeframeOptions}
          selected={timeframe}
          onSelect={setTimeframe}
        />

        {/* 4 Important KPI Cards */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiVal}>{summary?.totalDonations ?? 486}</Text>
              <Text style={styles.kpiLabel}>Donations</Text>
            </View>

            <View style={styles.kpiCard}>
              <Text style={[styles.kpiVal, { color: Palette.healthy }]}>
                {summary?.bloodCollectedUnits ?? 512} U
              </Text>
              <Text style={styles.kpiLabel}>Collected</Text>
            </View>
          </View>

          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={[styles.kpiVal, { color: Palette.issued }]}>
                {summary?.bloodIssuedUnits ?? 352} U
              </Text>
              <Text style={styles.kpiLabel}>Issued</Text>
            </View>

            <View style={styles.kpiCard}>
              <Text style={[styles.kpiVal, { color: Palette.moderate }]}>
                {summary?.bloodRequestsCount ?? 391}
              </Text>
              <Text style={styles.kpiLabel}>Requests</Text>
            </View>
          </View>
        </View>

        {/* Chart 1: 7-Day Trend Chart */}
        <SectionHeader title="7-Day Trend" />

        <View style={styles.chartCard}>
          <View style={styles.chartToggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, trendMetric === 'collected' && styles.toggleBtnActive]}
              onPress={() => setTrendMetric('collected')}>
              <Text
                style={[
                  styles.toggleBtnText,
                  trendMetric === 'collected' && styles.toggleBtnTextActive,
                ]}>
                Collected
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, trendMetric === 'issued' && styles.toggleBtnActive]}
              onPress={() => setTrendMetric('issued')}>
              <Text
                style={[
                  styles.toggleBtnText,
                  trendMetric === 'issued' && styles.toggleBtnTextActive,
                ]}>
                Issued
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.barChartWrap}>
            {trends.map((item) => {
              const val = trendMetric === 'collected' ? item.collected : item.issued;
              const barH = Math.max(Math.round((val / maxVal) * 90), 10);
              const color = trendMetric === 'collected' ? Palette.healthy : Palette.issued;

              return (
                <View key={item.day} style={styles.barCol}>
                  <Text style={styles.barVal}>{val}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: barH, backgroundColor: color }]} />
                  </View>
                  <Text style={styles.barDay}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Chart 2: Blood Group Distribution */}
        <SectionHeader title="Group Distribution" />

        <View style={styles.distCard}>
          {distribution.slice(0, 5).map((item) => (
            <View key={item.bloodGroup} style={styles.distRow}>
              <Text style={styles.distGroup}>{item.bloodGroup}</Text>
              <View style={styles.distTrack}>
                <View
                  style={[
                    styles.distFill,
                    {
                      width: `${item.percentage * 2.5}%`,
                      backgroundColor:
                        item.bloodGroup === 'O-'
                          ? Palette.critical
                          : item.bloodGroup.includes('+')
                          ? Palette.primary
                          : Palette.moderate,
                    },
                  ]}
                />
              </View>
              <Text style={styles.distPercent}>{item.percentage}%</Text>
            </View>
          ))}
        </View>

        {/* Key Insights (2–3 short insights) */}
        <SectionHeader title="Key Insights" />

        <View style={styles.insightsCard}>
          {insights.slice(0, 3).map((ins) => (
            <View key={ins.id} style={styles.insightRow}>
              <View style={styles.insightDot} />
              <View style={styles.insightTextWrap}>
                <Text style={styles.insightTitleText}>
                  {ins.title}: <Text style={styles.insightValText}>{ins.value}</Text>
                </Text>
                <Text style={styles.insightSubText}>{ins.subtitle}</Text>
              </View>
            </View>
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
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.xs,
    paddingBottom: 32,
    gap: 8,
  },
  kpiGrid: {
    gap: 8,
    marginTop: Spacing.xs,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
  },
  kpiVal: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textMuted,
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
  },
  chartToggle: {
    flexDirection: 'row',
    backgroundColor: Palette.borderSubtle,
    borderRadius: BorderRadius.sm,
    padding: 2,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.xs,
  },
  toggleBtnActive: {
    backgroundColor: Palette.white,
    ...Shadows.subtle,
  },
  toggleBtnText: {
    fontSize: 12,
    color: Palette.textMuted,
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    color: Palette.textPrimary,
    fontWeight: '700',
  },
  barChartWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 8,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barVal: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.textMuted,
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 90,
    justifyContent: 'flex-end',
    backgroundColor: Palette.borderSubtle,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  barDay: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textSecondary,
    marginTop: 6,
  },
  distCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
    gap: 10,
  },
  distRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distGroup: {
    width: 34,
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  distTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Palette.borderSubtle,
    borderRadius: 3,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  distFill: {
    height: '100%',
    borderRadius: 3,
  },
  distPercent: {
    width: 34,
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textSecondary,
    textAlign: 'right',
  },
  insightsCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
    gap: 10,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.primary,
    marginTop: 6,
  },
  insightTextWrap: {
    flex: 1,
  },
  insightTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  insightValText: {
    color: Palette.primary,
    fontWeight: '800',
  },
  insightSubText: {
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 1,
  },
});
