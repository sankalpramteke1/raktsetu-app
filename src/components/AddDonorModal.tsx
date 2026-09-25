import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../constants/theme';
import { DONORS } from '../data/donors';
import { campService } from '../services/campService';
import { BloodDonationCamp } from '../types/camp';
import { Donor } from '../types/donor';

interface Props {
  visible: boolean;
  camp: BloodDonationCamp;
  onClose: () => void;
  onDonorAdded: () => void;
}

export const AddDonorModal: React.FC<Props> = ({
  visible,
  camp,
  onClose,
  onDonorAdded,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  // Set of already added donor IDs
  const registeredIds = useMemo(() => {
    return new Set(camp.participants.map((p) => p.donorId));
  }, [camp.participants]);

  // Filtered donors
  const filteredDonors = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return DONORS.slice(0, 30); // show top 30 initially
    }
    return DONORS.filter(
      (d) =>
        d.fullName.toLowerCase().includes(q) ||
        d.donorId.toLowerCase().includes(q) ||
        d.mobile.toLowerCase().includes(q) ||
        d.bloodGroup.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleAddDonor = async (donor: Donor) => {
    setAddingId(donor.donorId);
    const res = await campService.addDonorToCamp(camp.id, donor.donorId);
    setAddingId(null);
    if (res.success) {
      setBannerMessage(`Added ${donor.fullName} to camp.`);
      onDonorAdded();
      setTimeout(() => setBannerMessage(null), 3000);
    } else {
      setBannerMessage(res.message);
      setTimeout(() => setBannerMessage(null), 3000);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const renderDonorItem = ({ item }: { item: Donor }) => {
    const isAlreadyAdded = registeredIds.has(item.donorId);

    return (
      <View style={styles.donorItem}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(item.fullName)}</Text>
        </View>

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {item.fullName}
            </Text>
            <View style={styles.bloodBadge}>
              <Text style={styles.bloodText}>{item.bloodGroup}</Text>
            </View>
          </View>
          <Text style={styles.metaText}>
            {item.donorId} · {item.mobile}
          </Text>
          <Text style={styles.lastDonatedText}>
            Last donation: {item.lastDonationDate}
          </Text>
        </View>

        <View style={styles.actionCol}>
          {isAlreadyAdded ? (
            <View style={styles.addedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={Palette.healthy} />
              <Text style={styles.addedText}>Added</Text>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.addBtn,
                pressed && styles.addBtnPressed,
                addingId === item.donorId && styles.addBtnDisabled,
              ]}
              disabled={addingId === item.donorId}
              onPress={() => handleAddDonor(item)}>
              <Ionicons name="person-add-outline" size={13} color={Palette.card} />
              <Text style={styles.addBtnText}>
                {addingId === item.donorId ? 'Adding...' : 'Add'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Add Donor to Camp</Text>
              <Text style={styles.sheetSubtitle}>
                Select an existing donor from registry
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={Palette.textSecondary} />
            </Pressable>
          </View>

          {/* Feedback banner if any */}
          {bannerMessage && (
            <View style={styles.banner}>
              <Ionicons name="information-circle" size={16} color={Palette.primary} />
              <Text style={styles.bannerText}>{bannerMessage}</Text>
            </View>
          )}

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={Palette.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, ID, phone, or blood group..."
              placeholderTextColor={Palette.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} hitSlop={10}>
                <Ionicons name="close-circle" size={16} color={Palette.textMuted} />
              </Pressable>
            )}
          </View>

          {/* Donor List */}
          <FlatList
            data={filteredDonors}
            keyExtractor={(item) => item.donorId}
            renderItem={renderDonorItem}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={36} color={Palette.border} />
                <Text style={styles.emptyText}>No matching donors found</Text>
                <Text style={styles.emptySubtext}>
                  Try searching with a different name, blood group, or donor ID
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    maxHeight: '85%',
    backgroundColor: Palette.card,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.md,
    ...Shadows.raised,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    gap: 8,
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: Spacing.sm + 4,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Palette.textPrimary,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 36,
  },
  donorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 2,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.primary,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  bloodBadge: {
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  bloodText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.primary,
  },
  metaText: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 1,
  },
  lastDonatedText: {
    fontSize: 10,
    color: Palette.textMuted,
    marginTop: 1,
  },
  actionCol: {
    marginLeft: Spacing.sm,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  addBtnPressed: {
    opacity: 0.8,
  },
  addBtnDisabled: {
    opacity: 0.6,
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.card,
  },
  addedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: Palette.healthyBg,
    gap: 4,
  },
  addedText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.healthy,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  emptySubtext: {
    fontSize: 12,
    color: Palette.textMuted,
    textAlign: 'center',
    maxWidth: 240,
  },
});
