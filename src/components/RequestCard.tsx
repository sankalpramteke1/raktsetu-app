import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../constants/theme';
import { BloodRequest, RequestPriority, RequestStatus } from '../types/request';

interface Props {
  request: BloodRequest;
}

export const RequestCard: React.FC<Props> = ({ request }) => {
  const router = useRouter();

  const getPriorityStyle = (priority: RequestPriority) => {
    switch (priority) {
      case 'Critical':
        return { bg: Palette.criticalBg, text: Palette.critical };
      case 'Urgent':
        return { bg: Palette.warningBg, text: Palette.warning };
      case 'Normal':
        return { bg: Palette.borderSubtle, text: Palette.textSecondary };
    }
  };

  const getStatusStyle = (status: RequestStatus) => {
    switch (status) {
      case 'Pending':
        return { bg: Palette.warningBg, text: Palette.warning };
      case 'Processing':
        return { bg: Palette.moderateBg, text: Palette.moderate };
      case 'Cross Match':
        return { bg: Palette.quarantineBg, text: Palette.quarantine };
      case 'Ready':
        return { bg: Palette.healthyBg, text: Palette.healthy };
      case 'Issued':
      case 'Completed':
        return { bg: Palette.issuedBg, text: Palette.issued };
      case 'Cancelled':
        return { bg: Palette.borderSubtle, text: Palette.textMuted };
    }
  };

  const priorityStyle = getPriorityStyle(request.priority);
  const statusStyle = getStatusStyle(request.status);

  const handlePress = () => {
    router.push({
      pathname: '/requests/[id]',
      params: { id: request.requestId },
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        request.priority === 'Critical' && styles.criticalAccent,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}>
      <View style={styles.topRow}>
        <View style={styles.idGroup}>
          <Text style={styles.requestIdText}>{request.requestId}</Text>
          <View style={[styles.priorityPill, { backgroundColor: priorityStyle.bg }]}>
            <Text style={[styles.priorityText, { color: priorityStyle.text }]}>
              {request.priority}
            </Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {request.status}
          </Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        {/* Blood Group & Units */}
        <View style={styles.bloodCol}>
          <View style={styles.bloodPill}>
            <Text style={styles.bloodText}>{request.bloodGroup}</Text>
          </View>
          <Text style={styles.unitsText}>
            {request.unitsRequired} {request.unitsRequired === 1 ? 'Unit' : 'Units'}
          </Text>
        </View>

        {/* Patient Name & ID */}
        <View style={styles.patientCol}>
          <Text style={styles.patientName} numberOfLines={1}>
            {request.patientName}
          </Text>
          <Text style={styles.patientId}>ID: {request.patientId}</Text>
        </View>

        <Ionicons name="chevron-forward" size={16} color={Palette.textMuted} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
    marginBottom: Spacing.sm,
  },
  criticalAccent: {
    borderLeftWidth: 3,
    borderLeftColor: Palette.critical,
  },
  pressed: {
    opacity: 0.75,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  idGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requestIdText: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  priorityPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bloodCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bloodPill: {
    backgroundColor: Palette.primarySurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  bloodText: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.primary,
  },
  unitsText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  patientCol: {
    flex: 1,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  patientId: {
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 1,
  },
});
