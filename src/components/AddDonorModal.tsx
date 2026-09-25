import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, GlassStyles, Palette, Spacing } from '../constants/theme';

interface Props { visible: boolean; onClose: () => void; }

export const AddDonorModal: React.FC<Props> = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.content}>
        <Text style={styles.title}>Add New Donor</Text>
        <Text style={styles.desc}>Donor registration form will be available in the next update.</Text>
        <TouchableOpacity style={styles.btn} onPress={onClose}>
          <Text style={styles.btnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  content: { ...GlassStyles.cardElevated, padding: Spacing.xl, width: '100%', maxWidth: 340 },
  title: { fontSize: 18, fontWeight: '700', color: Palette.textPrimary, marginBottom: 8 },
  desc: { fontSize: 13, color: Palette.textSecondary, lineHeight: 18, marginBottom: 16 },
  btn: { backgroundColor: Palette.primary, paddingVertical: 10, borderRadius: BorderRadius.md, alignItems: 'center' },
  btnText: { fontSize: 14, fontWeight: '700', color: Palette.white },
});
