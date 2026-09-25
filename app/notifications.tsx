import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { EmptyState } from '../src/components/EmptyState';
import { FilterChips } from '../src/components/FilterChips';
import { BorderRadius, Palette, Shadows, Spacing } from '../src/constants/theme';
import { notificationService } from '../src/services/notificationService';
import { AppNotification } from '../src/types/notification';

type CategoryFilter = 'All' | 'stock' | 'request' | 'donor' | 'expiry';

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');

  useEffect(() => {
    notificationService.getNotifications().then(setNotifications);
  }, []);

  const filterOptions: { label: string; value: CategoryFilter }[] = [
    { label: 'All Alerts', value: 'All' },
    { label: 'Stock Alerts', value: 'stock' },
    { label: 'Requests', value: 'request' },
    { label: 'Expiry Alerts', value: 'expiry' },
    { label: 'Donors', value: 'donor' },
  ];

  const filtered = notifications.filter((n) => {
    if (categoryFilter === 'All') return true;
    return n.category === categoryFilter;
  });

  const getSeverityConfig = (severity: AppNotification['severity']) => {
    switch (severity) {
      case 'critical':
        return { icon: 'alert-circle', color: Palette.critical, bg: Palette.criticalBg };
      case 'warning':
        return { icon: 'warning', color: Palette.warning, bg: Palette.warningBg };
      case 'success':
        return { icon: 'checkmark-circle', color: Palette.healthy, bg: Palette.healthyBg };
      case 'info':
        return { icon: 'information-circle', color: Palette.info, bg: Palette.infoBg };
    }
  };

  const handleNotificationPress = (notif: AppNotification) => {
    if (notif.actionRoute) {
      router.push(notif.actionRoute as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          onPress={() => router.back()}
          accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={22} color={Palette.textPrimary} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Operational Alerts</Text>
          <Text style={styles.headerSubtitle}>Durg District Blood Center</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
          }>
          <Text style={styles.markAllRead}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.filterWrapper}>
            <FilterChips
              options={filterOptions}
              selected={categoryFilter}
              onSelect={setCategoryFilter}
            />
          </View>
        }
        renderItem={({ item }) => {
          const config = getSeverityConfig(item.severity);
          return (
            <TouchableOpacity
              style={[
                styles.notifCard,
                !item.read && styles.unreadCard,
              ]}
              onPress={() => handleNotificationPress(item)}
              activeOpacity={0.8}>
              <View style={[styles.iconCircle, { backgroundColor: config.bg }]}>
                <Ionicons name={config.icon as any} size={20} color={config.color} />
              </View>

              <View style={styles.cardContent}>
                <View style={styles.topRow}>
                  <Text style={[styles.cardTitle, !item.read && styles.unreadTitle]}>
                    {item.title}
                  </Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>

                <Text style={styles.messageText}>{item.message}</Text>

                {item.actionRoute && (
                  <View style={styles.actionRow}>
                    <Text style={styles.actionPrompt}>Tap to review action</Text>
                    <Ionicons name="arrow-forward" size={12} color={Palette.primary} />
                  </View>
                )}
              </View>

              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-outline"
            title="No Alerts Found"
            message="There are no notifications matching your selected alert category."
            actionText="Show All Alerts"
            onAction={() => setCategoryFilter('All')}
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
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
    backgroundColor: Palette.white,
    ...Shadows.subtle,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Palette.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Palette.textMuted,
  },
  markAllRead: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  listContent: {
    padding: Spacing.screenPadding,
    paddingBottom: 32,
    backgroundColor: Palette.background,
  },
  filterWrapper: {
    marginBottom: Spacing.xs,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderLight,
    ...Shadows.subtle,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  unreadCard: {
    backgroundColor: '#FFFBFB',
    borderColor: Palette.primarySoft,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '800',
    color: Palette.primary,
  },
  timeText: {
    fontSize: 11,
    color: Palette.textMuted,
  },
  messageText: {
    fontSize: 12,
    color: Palette.textSecondary,
    lineHeight: 17,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  actionPrompt: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.primary,
    marginLeft: 6,
    marginTop: 4,
  },
});
