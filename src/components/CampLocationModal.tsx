import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../constants/theme';
import { BloodDonationCamp } from '../types/camp';

interface Props {
  visible: boolean;
  camp: BloodDonationCamp;
  onClose: () => void;
}

export const CampLocationModal: React.FC<Props> = ({ visible, camp, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <Ionicons name="location" size={20} color={Palette.primary} />
              <Text style={styles.headerTitle}>Camp Venue Location</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Palette.textSecondary} />
            </Pressable>
          </View>

          {/* Map Preview Placeholder Card */}
          <View style={styles.mapGraphic}>
            {/* Grid styling */}
            <View style={styles.gridLineH1} />
            <View style={styles.gridLineH2} />
            <View style={styles.gridLineV1} />
            <View style={styles.gridLineV2} />

            {/* Radar / Pin graphic */}
            <View style={styles.pulseRing} />
            <View style={styles.pinWrapper}>
              <Ionicons name="location" size={28} color={Palette.primary} />
            </View>

            <View style={styles.mockOverlay}>
              <Text style={styles.mapLabel}>DURG DISTRICT · CG HEALTH ZONE</Text>
              <Text style={styles.gpsLabel}>Lat: 21.1904° N · Long: 81.2849° E</Text>
            </View>
          </View>

          {/* Venue Details */}
          <View style={styles.detailsBody}>
            <Text style={styles.venueName}>{camp.venue}</Text>
            <Text style={styles.addressLine}>{camp.address}</Text>
            <Text style={styles.cityLine}>
              {camp.city}, {camp.district}, {camp.state} - {camp.pincode}
            </Text>

            <View style={styles.infoDivider} />

            {/* Organizer & Coordinator Info */}
            <View style={styles.metaRow}>
              <Ionicons name="business-outline" size={16} color={Palette.textSecondary} />
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>Organizer</Text>
                <Text style={styles.metaValue}>{camp.organizer}</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="person-outline" size={16} color={Palette.textSecondary} />
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>Camp Coordinator</Text>
                <Text style={styles.metaValue}>
                  {camp.contactPerson} · {camp.contactNumber}
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={16} color={Palette.textSecondary} />
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>Camp Schedule</Text>
                <Text style={styles.metaValue}>
                  {camp.date} ({camp.startTime} – {camp.endTime})
                </Text>
              </View>
            </View>
          </View>

          {/* Dismiss button */}
          <Pressable
            style={({ pressed }) => [styles.doneBtn, pressed && styles.doneBtnPressed]}
            onPress={onClose}>
            <Text style={styles.doneBtnText}>Close Location Details</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Palette.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.raised,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  mapGraphic: {
    height: 140,
    backgroundColor: '#E2E8F0',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gridLineH1: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  gridLineH2: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  gridLineV1: {
    position: 'absolute',
    left: 100,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#CBD5E1',
  },
  gridLineV2: {
    position: 'absolute',
    right: 100,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#CBD5E1',
  },
  pulseRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(225, 29, 72, 0.15)',
  },
  pinWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  mockOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  mapLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  gpsLabel: {
    fontSize: 9,
    color: Palette.textMuted,
  },
  detailsBody: {
    padding: Spacing.md,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
  cityLine: {
    fontSize: 13,
    fontWeight: '500',
    color: Palette.textPrimary,
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Palette.borderSubtle,
    marginVertical: Spacing.sm + 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: Palette.textMuted,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textPrimary,
    marginTop: 1,
  },
  doneBtn: {
    margin: Spacing.md,
    marginTop: 0,
    backgroundColor: Palette.primary,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  doneBtnPressed: {
    opacity: 0.85,
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.card,
  },
});
