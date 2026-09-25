import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../src/components/Header';
import { SectionHeader } from '../../src/components/SectionHeader';
import { BorderRadius, GlassStyles, Palette, Spacing } from '../../src/constants/theme';
import { reportService } from '../../src/services/reportService';

export default function ReportsScreen() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [insights, setInsights] = useState([]);
  const [trendMetric, setTrendMetric] = useState('collected');

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t, d, i] = await Promise.all([
          reportService.getSummary(),
          reportService.getWeeklyTrend(),
          reportService.getBloodGroupDistribution(),
          reportService.getInsights(),
        ]);
        setSummary(s); setTrends(t); setDistribution(d); setInsights(i);
      } catch (e) { console.error(e); }
    };
    load();
  }, []);

  const maxVal = Math.max(...trends.map((t) => Math.max(t.collected, t.issued)), 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Reports" subtitle="Analytics & Overview" />
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* KPI Grid */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={[styles.kpiVal, { color: Palette.healthy }]}>{summary?.donorsRegistered ?? 1284}</Text>
              <Text style={styles.kpiLabel}>Donors</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={[styles.kpiVal, { color: Palette.primary }]}>{summary?.bloodCollectedUnits ?? 485} U</Text>
              <Text style={styles.kpiLabel}>Collected</Text>
            </View>
          </View>
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <Text style={[styles.kpiVal, { color: Palette.issued }]}>{summary?.bloodIssuedUnits ?? 352} U</Text>
              <Text style={styles.kpiLabel}>Issued</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={[styles.kpiVal, { color: Palette.moderate }]}>{summary?.bloodRequestsCount ?? 391}</Text>
              <Text style={styles.kpiLabel}>Requests</Text>
            </View>
          </View>
        </View>

        <SectionHeader title="7-Day Trend" />
        <View style={styles.chartCard}>
          <View style={styles.chartToggle}>
            <TouchableOpacity style={[styles.toggleBtn, trendMetric === 'collected' && styles.toggleBtnActive]} onPress={() => setTrendMetric('collected')}>
              <Text style={[styles.toggleBtnText, trendMetric === 'collected' && styles.toggleBtnTextActive]}>Collected</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleBtn, trendMetric === 'issued' && styles.toggleBtnActive]} onPress={() => setTrendMetric('issued')}>
              <Text style={[styles.toggleBtnText, trendMetric === 'issued' && styles.toggleBtnTextActive]}>Issued</Text>
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
                    <View style={[styles.barFill, { height: barH, backgroundColor: color, shadowColor: color, shadowOpacity: 0.5, shadowRadius: 6, shadowOffset: { width: 0, height: 0 }, elevation: 3 }]} />
                  </View>
                  <Text style={styles.barDay}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <SectionHeader title="Group Distribution" />
        <View style={styles.distCard}>
          {distribution.slice(0, 5).map((item) => (
            <View key={item.bloodGroup} style={styles.distRow}>
              <Text style={styles.distGroup}>{item.bloodGroup}</Text>
              <View style={styles.distTrack}>
                <View style={[styles.distFill, { width: item.percentage * 2.5 + '%', backgroundColor: item.bloodGroup === 'O-' ? Palette.critical : item.bloodGroup.includes('+') ? Palette.primary : Palette.moderate }]} />
              </View>
              <Text style={styles.distPercent}>{item.percentage}%</Text>
            </View>
          ))}
        </View>

        <SectionHeader title="Key Insights" />
        <View style={[styles.insightsCard, { marginBottom: 100 }]}>
          {insights.slice(0, 3).map((ins) => (
            <View key={ins.id} style={styles.insightRow}>
              <View style={styles.insightDot} />
              <View style={styles.insightTextWrap}>
                <Text style={styles.insightTitleText}>{ins.title}: <Text style={styles.insightValText}>{ins.value}</Text></Text>
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
  safeArea: { flex: 1, backgroundColor: Palette.background },
  scrollContainer: { flex: 1, backgroundColor: Palette.background },
  contentContainer: { paddingHorizontal: Spacing.screenPadding, paddingTop: Spacing.xs, paddingBottom: 32, gap: 8 },
  kpiGrid: { gap: 8, marginTop: Spacing.xs },
  kpiRow: { flexDirection: 'row', gap: 8 },
  kpiCard: { flex: 1, ...GlassStyles.card, paddingVertical: 14, paddingHorizontal: Spacing.md },
  kpiVal: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  kpiLabel: { fontSize: 11, fontWeight: '600', color: Palette.textMuted, marginTop: 2 },
  chartCard: { ...GlassStyles.card, padding: Spacing.md },
  chartToggle: { flexDirection: 'row', backgroundColor: Palette.borderSubtle, borderRadius: BorderRadius.sm, padding: 2, alignSelf: 'flex-start', marginBottom: Spacing.md },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: BorderRadius.xs },
  toggleBtnActive: { backgroundColor: Palette.surfaceElevated },
  toggleBtnText: { fontSize: 12, color: Palette.textMuted, fontWeight: '600' },
  toggleBtnTextActive: { color: Palette.textPrimary, fontWeight: '700' },
  barChartWrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, paddingTop: 8 },
  barCol: { flex: 1, alignItems: 'center' },
  barVal: { fontSize: 10, fontWeight: '700', color: Palette.textMuted, marginBottom: 4 },
  barTrack: { width: 14, height: 90, justifyContent: 'flex-end', backgroundColor: Palette.borderSubtle, borderRadius: 7, overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 7 },
  barDay: { fontSize: 11, fontWeight: '600', color: Palette.textSecondary, marginTop: 6 },
  distCard: { ...GlassStyles.card, padding: Spacing.md, gap: 10 },
  distRow: { flexDirection: 'row', alignItems: 'center' },
  distGroup: { width: 34, fontSize: 13, fontWeight: '700', color: Palette.textPrimary },
  distTrack: { flex: 1, height: 6, backgroundColor: Palette.borderSubtle, borderRadius: 3, marginHorizontal: 10, overflow: 'hidden' },
  distFill: { height: '100%', borderRadius: 3 },
  distPercent: { width: 34, fontSize: 12, fontWeight: '700', color: Palette.textSecondary, textAlign: 'right' },
  insightsCard: { ...GlassStyles.card, padding: Spacing.md, gap: 10 },
  insightRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  insightDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Palette.primary, marginTop: 6, shadowColor: Palette.primary, shadowOpacity: 0.5, shadowRadius: 3, shadowOffset: { width: 0, height: 0 }, elevation: 2 },
  insightTextWrap: { flex: 1 },
  insightTitleText: { fontSize: 13, fontWeight: '700', color: Palette.textPrimary },
  insightValText: { color: Palette.primary, fontWeight: '800' },
  insightSubText: { fontSize: 11, color: Palette.textMuted, marginTop: 1 },
});
