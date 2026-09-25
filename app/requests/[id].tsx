import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../../src/constants/theme';
import { requestService } from '../../src/services/requestService';
import { BloodRequest, RequestPriority, RequestStatus } from '../../src/types/request';

const STAGES: { key: RequestStatus; label: string }[] = [
  { key: 'Pending', label: 'Requested' },
  { key: 'Processing', label: 'Processing' },
  { key: 'Cross Match', label: 'Cross Match' },
  { key: 'Ready', label: 'Ready' },
  { key: 'Issued', label: 'Issued' },
];

export default function RequestDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const requestId = params.id;

  const [request, setRequest] = useState<BloodRequest | undefined>();

  useEffect(() => {
    if (requestId) {
      requestService.getRequestById(requestId).then(setRequest);
    }
  }, [requestId]);

  if (!request) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.notFoundText}>Requisition not found.</Text>
          <TouchableOpacity style={styles.returnBtn} onPress={() => router.back()}>
            <Text style={styles.returnBtnText}>Return to Requests</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

  const priorityStyle = getPriorityStyle(request.priority);

  const getStageIndex = (status: RequestStatus): number => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Processing':
        return 1;
      case 'Cross Match':
        return 2;
      case 'Ready':
        return 3;
      case 'Issued':
      case 'Completed':
        return 4;
      case 'Cancelled':
        return -1;
    }
  };

  const currentStageIndex = getStageIndex(request.status);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          onPress={() => router.back()}
          hitSlop={8}>
          <Ionicons name="arrow-back" size={20} color={Palette.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>{request.requestId}</Text>
        <View style={[styles.priorityPill, { backgroundColor: priorityStyle.bg }]}>
          <Text style={[styles.priorityText, { color: priorityStyle.text }]}>
            {request.priority}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Patient & Blood Info Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewRow}>
            <View style={styles.patientCol}>
              <Text style={styles.patientName}>{request.patientName}</Text>
              <Text style={styles.patientMeta}>
                ID: {request.patientId} · {request.gender}, {request.age} yrs
              </Text>
            </View>

            <View style={styles.bloodCol}>
              <View style={styles.bloodBadge}>
                <Text style={styles.bloodBadgeText}>{request.bloodGroup}</Text>
              </View>
              <Text style={styles.unitsReq}>
                {request.unitsRequired} {request.unitsRequired === 1 ? 'Unit' : 'Units'}
              </Text>
            </View>
          </View>
        </View>

        {/* 5-Stage Status Progress Tracker */}
        <View style={styles.trackerCard}>
          <Text style={styles.trackerTitle}>Status Progress</Text>

          <View style={styles.stepperWrap}>
            {STAGES.map((stage, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = currentStageIndex === idx;

              return (
                <View key={stage.key} style={styles.stepRow}>
                  <View style={styles.stepGutter}>
                    <View
                      style={[
                        styles.stepDot,
                        isPast && styles.stepDotPast,
                        isCurrent && styles.stepDotCurrent,
                      ]}>
                      {isPast ? (
                        <Ionicons name="checkmark" size={11} color={Palette.white} />
                      ) : (
                        <View
                          style={[
                            styles.innerDot,
                            isCurrent && { backgroundColor: Palette.white },
                          ]}
                        />
                      )}
                    </View>
                    {idx !== STAGES.length - 1 && (
                      <View
                        style={[
                          styles.stepStem,
                          isPast ? styles.stepStemPast : styles.stepStemFuture,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stepInfo}>
                    <Text
                      style={[
                        styles.stepLabel,
                        isCurrent && styles.stepLabelCurrent,
                        isPast && styles.stepLabelPast,
                      ]}>
                      {stage.label}
                    </Text>
                    {isCurrent && (
                      <View style={styles.currentTag}>
                        <Text style={styles.currentTagText}>In progress</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Compact Clinical & Ward Info */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Requisition Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ward / Unit</Text>
            <Text style={styles.detailVal}>{request.ward}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Department</Text>
            <Text style={styles.detailVal}>{request.department}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Doctor</Text>
            <Text style={styles.detailVal}>{request.attendingDoctor}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Requested</Text>
            <Text style={styles.detailVal}>
              {request.requestDate}, {request.requestTime}
            </Text>
          </View>

          {request.clinicalIndication && (
            <View style={styles.indicationRow}>
              <Text style={styles.detailLabel}>Indication</Text>
              <Text style={styles.indicationVal}>{request.clinicalIndication}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cross-Match</Text>
            <Text
              style={[
                styles.detailVal,
                {
                  color:
                    request.crossMatchStatus === 'Compatible'
                      ? Palette.healthy
                      : Palette.warning,
                },
              ]}>
              {request.crossMatchStatus || 'In Progress'}
            </Text>
          </View>

          {request.assignedBags && request.assignedBags.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Assigned Bags</Text>
              <Text style={styles.detailVal}>{request.assignedBags.join(', ')}</Text>
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    backgroundColor: Palette.white,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  priorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  contentContainer: {
    padding: Spacing.screenPadding,
    paddingBottom: 32,
    gap: 10,
  },
  overviewCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientCol: {
    flex: 1,
    marginRight: 10,
  },
  patientName: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  patientMeta: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 2,
  },
  bloodCol: {
    alignItems: 'center',
  },
  bloodBadge: {
    backgroundColor: Palette.primarySurface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  bloodBadgeText: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.primary,
  },
  unitsReq: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textSecondary,
    marginTop: 3,
  },
  trackerCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
  },
  trackerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: Spacing.md,
  },
  stepperWrap: {
    paddingLeft: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepGutter: {
    width: 22,
    alignItems: 'center',
    marginRight: 10,
  },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Palette.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  stepDotPast: {
    backgroundColor: Palette.healthy,
    borderColor: Palette.healthy,
  },
  stepDotCurrent: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.textMuted,
  },
  stepStem: {
    width: 2,
    height: 24,
    marginVertical: 1,
  },
  stepStemPast: {
    backgroundColor: Palette.healthy,
  },
  stepStemFuture: {
    backgroundColor: Palette.borderSubtle,
  },
  stepInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 1,
    flex: 1,
  },
  stepLabel: {
    fontSize: 13,
    color: Palette.textMuted,
    fontWeight: '500',
  },
  stepLabelPast: {
    color: Palette.textPrimary,
    fontWeight: '600',
  },
  stepLabelCurrent: {
    color: Palette.primary,
    fontWeight: '800',
  },
  currentTag: {
    backgroundColor: Palette.primarySurface,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  currentTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: Palette.primary,
  },
  detailsCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.subtle,
    gap: 10,
  },
  detailsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  indicationRow: {
    paddingVertical: 4,
  },
  indicationVal: {
    fontSize: 12,
    color: Palette.textPrimary,
    marginTop: 2,
    lineHeight: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 15,
    color: Palette.textSecondary,
    marginBottom: 12,
  },
  returnBtn: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  returnBtnText: {
    color: Palette.white,
    fontWeight: '700',
  },
});
