import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../constants/theme';
import { notificationService } from '../services/notificationService';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showGreeting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showGreeting = false,
}) => {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(3);

  useEffect(() => {
    notificationService.getUnreadCount().then(setUnreadCount);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 17) return 'Good afternoon ☀️';
    return 'Good evening 🌙';
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        {showGreeting ? (
          <>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <View style={styles.brandRow}>
              <View style={styles.brandBadge}>
                <Ionicons name="water" size={14} color={Palette.white} />
              </View>
              <Text style={styles.brandName}>RaktSetu</Text>
              <View style={styles.liveTag}>
                <View style={styles.liveDot} />
                <Text style={styles.liveTagText}>Durg Blood Center</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.brandRow}>
              <View style={styles.brandBadge}>
                <Ionicons name="water" size={14} color={Palette.white} />
              </View>
              <Text style={styles.brandName}>{title || 'RaktSetu'}</Text>
            </View>
            <Text style={styles.subText}>{subtitle || 'Durg District Blood Center'}</Text>
          </>
        )}
      </View>

      <View style={styles.rightActions}>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          onPress={() => router.push('/notifications')}
          accessibilityLabel="Notifications"
          hitSlop={8}>
          <Ionicons name="notifications-outline" size={19} color={Palette.textPrimary} />
          {unreadCount > 0 && (
            <View style={styles.badgeDot}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.avatarBtn, pressed && styles.pressed]}
          onPress={() => router.push('/profile')}
          accessibilityLabel="Profile"
          hitSlop={8}>
          <Ionicons name="person" size={16} color={Palette.primary} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.white,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.sm + 4,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
    ...Shadows.subtle,
  },
  leftCol: {
    flex: 1,
    marginRight: 12,
  },
  greetingText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '600',
    marginBottom: 3,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  brandBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.subtle,
  },
  brandName: {
    fontSize: 19,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.healthyBg,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Palette.healthyBorder,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.healthy,
  },
  liveTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.healthy,
  },
  subText: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.backgroundSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderLight,
    position: 'relative',
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Palette.primary,
    borderWidth: 2,
    borderColor: Palette.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    fontSize: 9,
    color: Palette.white,
    fontWeight: '800',
    lineHeight: 11,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
});
