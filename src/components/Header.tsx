import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Spacing } from '../constants/theme';
import { notificationService } from '../services/notificationService';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showGreeting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, showGreeting = false }) => {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(3);

  useEffect(() => {
    notificationService.getUnreadCount().then(setUnreadCount);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        {showGreeting ? (
          <>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <View style={styles.brandRow}>
              <View style={styles.brandDot} />
              <Text style={styles.brandName}>RaktSetu</Text>
              <View style={styles.centerBadge}>
                <Text style={styles.centerTag}>Durg</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.brandRow}>
              <View style={styles.brandDot} />
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
    backgroundColor: Palette.background,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.sm + 2,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  leftCol: { flex: 1, marginRight: 12 },
  greetingText: {
    fontSize: 12,
    color: Palette.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.primary,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  centerBadge: {
    backgroundColor: Palette.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
  },
  centerTag: {
    fontSize: 10,
    color: Palette.primary,
    fontWeight: '700',
  },
  subText: {
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 2,
    marginLeft: 16,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Palette.primarySurface,
    borderWidth: 1,
    borderColor: Palette.borderAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Palette.background,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
  },
  pressed: { opacity: 0.6 },
});
