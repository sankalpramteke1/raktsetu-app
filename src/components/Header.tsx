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
              <Text style={styles.centerTag}>· Durg Blood Center</Text>
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
          <Ionicons name="notifications-outline" size={20} color={Palette.textPrimary} />
          {unreadCount > 0 && <View style={styles.badgeDot} />}
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.avatarBtn, pressed && styles.pressed]}
          onPress={() => router.push('/profile')}
          accessibilityLabel="Profile"
          hitSlop={8}>
          <Ionicons name="person-outline" size={17} color={Palette.primary} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.white,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.sm + 2,
    paddingBottom: Spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  leftCol: {
    flex: 1,
    marginRight: 12,
  },
  greetingText: {
    fontSize: 12,
    color: Palette.textMuted,
    fontWeight: '500',
    marginBottom: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Palette.primary,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  centerTag: {
    fontSize: 12,
    color: Palette.textMuted,
    fontWeight: '500',
  },
  subText: {
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Palette.primary,
    borderWidth: 1.5,
    borderColor: Palette.white,
  },
  pressed: {
    opacity: 0.6,
  },
});
