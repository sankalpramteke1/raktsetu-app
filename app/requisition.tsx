import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BorderRadius, Palette, Shadows, Spacing } from '../src/constants/theme';

type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-' | '';
type ProductType = 'Whole Blood' | 'Packed Cell' | 'Platelets' | 'FFP' | '';
type Priority = 'Routine' | 'Emergency' | '';

interface RequisitionForm {
  // Patient Info
  hospitalName: string;
  patientName: string;
  relativeName: string;
  relationshipType: 'S/O' | 'D/O' | 'W/O';
  patientRegdNo: string;
  age: string;
  sex: 'Male' | 'Female' | 'Other' | '';
  ward: string;
  bedNo: string;
  doctorIncharge: string;
  clinicalDiagnosis: string;
  hb: string;
  gm: string;

  // Transfusion Details
  priority: Priority;
  emergencyJustification: string;
  previousTransfusion: 'Yes' | 'No' | '';
  aboGroup: string;
  rhFactor: string;
  transfusionReaction: 'Yes' | 'No' | '';

  // For Female Patients
  everPregnant: 'Yes' | 'No' | 'N/A' | '';
  parasInfo: string;
  haemolyticsDisease: 'Yes' | 'No' | 'N/A' | '';

  // Product
  productType: ProductType;
  bloodGroup: BloodGroup;
  unitsRequired: string;
  date: string;
  time: string;

  // Staff collecting blood
  collectorName: string;
  collectorDesignation: string;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const PRODUCT_TYPES: ProductType[] = ['Whole Blood', 'Packed Cell', 'Platelets', 'FFP'];

function SelectChip<T extends string>({
  options,
  value,
  onSelect,
  label,
}: {
  options: T[];
  value: T;
  onSelect: (v: T) => void;
  label?: string;
}) {
  return (
    <View>
      {label && <Text style={chipStyles.fieldLabel}>{label}</Text>}
      <View style={chipStyles.row}>
        {options.map((opt) => (
          <Pressable
            key={opt}
            style={[chipStyles.chip, value === opt && chipStyles.chipActive]}
            onPress={() => onSelect(opt)}>
            <Text style={[chipStyles.chipText, value === opt && chipStyles.chipTextActive]}>
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Palette.border,
    backgroundColor: Palette.white,
  },
  chipActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.primarySurface,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  chipTextActive: {
    color: Palette.primary,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  required = false,
  flex,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  required?: boolean;
  flex?: number;
}) {
  return (
    <View style={[fieldStyles.wrap, flex !== undefined && { flex }]}>
      <Text style={fieldStyles.label}>
        {label}
        {required && <Text style={{ color: Palette.critical }}> *</Text>}
      </Text>
      <TextInput
        style={[fieldStyles.input, multiline && fieldStyles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor={Palette.textMuted}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: Palette.background,
    borderWidth: 1.5,
    borderColor: Palette.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: Palette.textPrimary,
    fontWeight: '500',
  },
  inputMultiline: {
    paddingTop: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.card}>
      <View style={sectionStyles.header}>
        <View style={sectionStyles.iconWrap}>
          <Ionicons name={icon as any} size={16} color={Palette.primary} />
        </View>
        <Text style={sectionStyles.title}>{title}</Text>
      </View>
      <View style={sectionStyles.body}>{children}</View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  card: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    backgroundColor: Palette.background,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.sm,
    backgroundColor: Palette.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  body: {
    padding: Spacing.lg,
  },
});

export default function RequisitionScreen() {
  const router = useRouter();

  const now = new Date();
  const defaultDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
  const defaultTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const [form, setForm] = useState<RequisitionForm>({
    hospitalName: '',
    patientName: '',
    relativeName: '',
    relationshipType: 'S/O',
    patientRegdNo: '',
    age: '',
    sex: '',
    ward: '',
    bedNo: '',
    doctorIncharge: '',
    clinicalDiagnosis: '',
    hb: '',
    gm: '',
    priority: '',
    emergencyJustification: '',
    previousTransfusion: '',
    aboGroup: '',
    rhFactor: '',
    transfusionReaction: '',
    everPregnant: '',
    parasInfo: '',
    haemolyticsDisease: '',
    productType: '',
    bloodGroup: '',
    unitsRequired: '',
    date: defaultDate,
    time: defaultTime,
    collectorName: '',
    collectorDesignation: '',
  });

  const set = (field: keyof RequisitionForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const required = [
      form.hospitalName,
      form.patientName,
      form.patientRegdNo,
      form.age,
      form.sex,
      form.ward,
      form.doctorIncharge,
      form.clinicalDiagnosis,
      form.bloodGroup,
      form.unitsRequired,
      form.productType,
      form.priority,
    ];

    if (required.some((f) => !f)) {
      Alert.alert(
        'Incomplete Form',
        'Please fill in all required fields marked with *.',
        [{ text: 'OK' }]
      );
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <View style={styles.successIconWrap}>
            <Ionicons name="checkmark-circle" size={72} color={Palette.healthy} />
          </View>
          <Text style={styles.successTitle}>Requisition Submitted</Text>
          <Text style={styles.successSubtitle}>
            Your blood requisition has been submitted to{'\n'}Durg District Blood Center.
          </Text>

          <View style={styles.successCard}>
            <View style={styles.successRow}>
              <Text style={styles.successRowLabel}>Patient</Text>
              <Text style={styles.successRowValue}>{form.patientName}</Text>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successRow}>
              <Text style={styles.successRowLabel}>Blood Group</Text>
              <Text style={[styles.successRowValue, { color: Palette.primary, fontWeight: '800' }]}>
                {form.bloodGroup}
              </Text>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successRow}>
              <Text style={styles.successRowLabel}>Product</Text>
              <Text style={styles.successRowValue}>{form.productType}</Text>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successRow}>
              <Text style={styles.successRowLabel}>Units Required</Text>
              <Text style={styles.successRowValue}>{form.unitsRequired}</Text>
            </View>
            <View style={styles.successDivider} />
            <View style={styles.successRow}>
              <Text style={styles.successRowLabel}>Priority</Text>
              <Text
                style={[
                  styles.successRowValue,
                  { color: form.priority === 'Emergency' ? Palette.critical : Palette.textPrimary },
                ]}>
                {form.priority}
              </Text>
            </View>
          </View>

          <Text style={styles.successNote}>
            Please bring 2ml blood in plain glass vial and 2ml blood in EDTA anticoagulant solution. Label both vials with patient's full name, registration number and date.
          </Text>

          <Pressable
            style={({ pressed }) => [styles.newFormBtn, pressed && { opacity: 0.8 }]}
            onPress={() => setSubmitted(false)}>
            <Ionicons name="add-circle-outline" size={18} color={Palette.white} />
            <Text style={styles.newFormBtnText}>New Requisition</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.backHomeBtn, pressed && { opacity: 0.8 }]}
            onPress={() => router.back()}>
            <Text style={styles.backHomeBtnText}>Back to Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header */}
      <View style={styles.headerBar}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
          onPress={() => router.back()}
          hitSlop={8}>
          <Ionicons name="arrow-back" size={20} color={Palette.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Blood Requisition</Text>
          <Text style={styles.headerSubtitle}>Durg District Blood Center</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>Form</Text>
        </View>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle" size={16} color={Palette.info} />
        <Text style={styles.infoBannerText}>
          Fields marked <Text style={{ color: Palette.critical, fontWeight: '700' }}>*</Text> are mandatory. Incomplete forms will not be accepted.
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* Blood Product Selection */}
          <SectionCard title="Blood Product Required" icon="water">
            <SelectChip<ProductType>
              label="Product Type *"
              options={PRODUCT_TYPES}
              value={form.productType}
              onSelect={(v) => setForm((p) => ({ ...p, productType: v }))}
            />

            <View style={{ height: 16 }} />

            <Text style={chipStyles.fieldLabel}>Blood Group *</Text>
            <View style={chipStyles.row}>
              {BLOOD_GROUPS.map((g) => (
                <Pressable
                  key={g}
                  style={[
                    styles.bloodGroupChip,
                    form.bloodGroup === g && styles.bloodGroupChipActive,
                  ]}
                  onPress={() => setForm((p) => ({ ...p, bloodGroup: g }))}>
                  <Text
                    style={[
                      styles.bloodGroupChipText,
                      form.bloodGroup === g && styles.bloodGroupChipTextActive,
                    ]}>
                    {g}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={{ height: 16 }} />

            <View style={styles.row2}>
              <FormField
                label="Units Required"
                value={form.unitsRequired}
                onChangeText={set('unitsRequired')}
                placeholder="No. of units"
                keyboardType="numeric"
                required
                flex={1}
              />
              <View style={{ width: 12 }} />
              <FormField
                label="Date"
                value={form.date}
                onChangeText={set('date')}
                placeholder="DD/MM/YYYY"
                flex={1}
              />
              <View style={{ width: 12 }} />
              <FormField
                label="Time"
                value={form.time}
                onChangeText={set('time')}
                placeholder="HH:MM"
                flex={1}
              />
            </View>
          </SectionCard>

          {/* Hospital & Patient Info */}
          <SectionCard title="Patient Information" icon="person">
            <FormField
              label="Name of Hospital"
              value={form.hospitalName}
              onChangeText={set('hospitalName')}
              placeholder="Enter hospital name"
              required
            />

            <View style={styles.row2}>
              <FormField
                label="Patient's Name"
                value={form.patientName}
                onChangeText={set('patientName')}
                placeholder="Full name"
                required
                flex={2}
              />
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={fieldStyles.label}>Relation</Text>
                <View style={styles.relationRow}>
                  {(['S/O', 'D/O', 'W/O'] as const).map((rel) => (
                    <Pressable
                      key={rel}
                      style={[
                        styles.relChip,
                        form.relationshipType === rel && styles.relChipActive,
                      ]}
                      onPress={() => setForm((p) => ({ ...p, relationshipType: rel }))}>
                      <Text
                        style={[
                          styles.relChipText,
                          form.relationshipType === rel && styles.relChipTextActive,
                        ]}>
                        {rel}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <FormField
              label="Relative's Name"
              value={form.relativeName}
              onChangeText={set('relativeName')}
              placeholder="Father / Husband / Guardian name"
            />

            <View style={styles.row2}>
              <FormField
                label="Regd./Admn. No."
                value={form.patientRegdNo}
                onChangeText={set('patientRegdNo')}
                placeholder="Registration No."
                required
                flex={1}
              />
              <View style={{ width: 12 }} />
              <FormField
                label="Age"
                value={form.age}
                onChangeText={set('age')}
                placeholder="Years"
                keyboardType="numeric"
                required
                flex={1}
              />
            </View>

            <View style={{ marginBottom: 14 }}>
              <SelectChip<'Male' | 'Female' | 'Other'>
                label="Sex *"
                options={['Male', 'Female', 'Other']}
                value={form.sex as any}
                onSelect={(v) => setForm((p) => ({ ...p, sex: v }))}
              />
            </View>

            <View style={styles.row2}>
              <FormField
                label="Ward"
                value={form.ward}
                onChangeText={set('ward')}
                placeholder="Ward name/no."
                required
                flex={1}
              />
              <View style={{ width: 12 }} />
              <FormField
                label="Bed No."
                value={form.bedNo}
                onChangeText={set('bedNo')}
                placeholder="Bed number"
                flex={1}
              />
            </View>
          </SectionCard>

          {/* Clinical Details */}
          <SectionCard title="Clinical Details" icon="medkit">
            <FormField
              label="Doctor Incharge"
              value={form.doctorIncharge}
              onChangeText={set('doctorIncharge')}
              placeholder="Doctor's name"
              required
            />

            <FormField
              label="Clinical Diagnosis"
              value={form.clinicalDiagnosis}
              onChangeText={set('clinicalDiagnosis')}
              placeholder="Enter clinical diagnosis"
              required
            />

            <View style={styles.row2}>
              <FormField
                label="Hb% (g/dL)"
                value={form.hb}
                onChangeText={set('hb')}
                placeholder="e.g. 8.5"
                keyboardType="numeric"
                flex={1}
              />
              <View style={{ width: 12 }} />
              <FormField
                label="Gm%"
                value={form.gm}
                onChangeText={set('gm')}
                placeholder="e.g. 6.2"
                keyboardType="numeric"
                flex={1}
              />
            </View>

            <View style={{ marginBottom: 14 }}>
              <SelectChip<Priority>
                label="Request Type *"
                options={['Routine', 'Emergency']}
                value={form.priority}
                onSelect={(v) => setForm((p) => ({ ...p, priority: v }))}
              />
            </View>

            {form.priority === 'Emergency' && (
              <FormField
                label="Emergency Justification"
                value={form.emergencyJustification}
                onChangeText={set('emergencyJustification')}
                placeholder="Provide justification for emergency request"
                multiline
              />
            )}
          </SectionCard>

          {/* Transfusion History */}
          <SectionCard title="Transfusion History" icon="flask">
            <View style={{ marginBottom: 14 }}>
              <SelectChip<'Yes' | 'No'>
                label="History of Previous Transfusion?"
                options={['Yes', 'No']}
                value={form.previousTransfusion as any}
                onSelect={(v) => setForm((p) => ({ ...p, previousTransfusion: v }))}
              />
            </View>

            {form.previousTransfusion === 'Yes' && (
              <View style={styles.row2}>
                <FormField
                  label="ABO Group"
                  value={form.aboGroup}
                  onChangeText={set('aboGroup')}
                  placeholder="e.g. A+"
                  flex={1}
                />
                <View style={{ width: 12 }} />
                <FormField
                  label="Rh Factor"
                  value={form.rhFactor}
                  onChangeText={set('rhFactor')}
                  placeholder="e.g. Positive"
                  flex={1}
                />
                <View style={{ width: 12 }} />
                <View style={{ flex: 1, marginBottom: 14 }}>
                  <SelectChip<'Yes' | 'No'>
                    label="Reaction?"
                    options={['Yes', 'No']}
                    value={form.transfusionReaction as any}
                    onSelect={(v) =>
                      setForm((p) => ({ ...p, transfusionReaction: v }))
                    }
                  />
                </View>
              </View>
            )}

            {/* Female Patient Section */}
            {(form.sex === 'Female' || form.sex === '') && (
              <View style={styles.femaleSection}>
                <View style={styles.femaleSectionHeader}>
                  <Ionicons name="person" size={13} color={Palette.moderate} />
                  <Text style={styles.femaleSectionTitle}>For Female Patients</Text>
                </View>
                <View style={{ height: 12 }} />
                <View style={{ marginBottom: 14 }}>
                  <SelectChip<'Yes' | 'No' | 'N/A'>
                    label="Ever been pregnant?"
                    options={['Yes', 'No', 'N/A']}
                    value={form.everPregnant as any}
                    onSelect={(v) => setForm((p) => ({ ...p, everPregnant: v }))}
                  />
                </View>
                {form.everPregnant === 'Yes' && (
                  <FormField
                    label="Para (No. of deliveries)"
                    value={form.parasInfo}
                    onChangeText={set('parasInfo')}
                    placeholder="e.g. P3"
                  />
                )}
                <View style={{ marginBottom: 4 }}>
                  <SelectChip<'Yes' | 'No' | 'N/A'>
                    label="History of Haemolytic Disease? (Newborn/Still Birth/Miscarriage)"
                    options={['Yes', 'No', 'N/A']}
                    value={form.haemolyticsDisease as any}
                    onSelect={(v) => setForm((p) => ({ ...p, haemolyticsDisease: v }))}
                  />
                </View>
              </View>
            )}
          </SectionCard>

          {/* Blood Collector Staff */}
          <SectionCard title="Authorized Staff (Blood Collection)" icon="people">
            <Text style={styles.collectNote}>
              Staff member collecting blood samples from patient:
            </Text>
            <View style={styles.row2}>
              <FormField
                label="Name"
                value={form.collectorName}
                onChangeText={set('collectorName')}
                placeholder="Staff name"
                flex={1}
              />
              <View style={{ width: 12 }} />
              <FormField
                label="Designation"
                value={form.collectorDesignation}
                onChangeText={set('collectorDesignation')}
                placeholder="e.g. Nurse"
                flex={1}
              />
            </View>
          </SectionCard>

          {/* Instructions */}
          <View style={styles.instructionsCard}>
            <View style={styles.instructionsHeader}>
              <Ionicons name="alert-circle" size={16} color={Palette.warning} />
              <Text style={styles.instructionsTitle}>Important Instructions</Text>
            </View>
            {[
              'Along with requisition form, send 2ml blood in plain glass vial and 2ml blood in EDTA anticoagulant solution with patient\'s full name, registration number and date.',
              'Staff collecting blood from patient must fill and sign this form.',
              'Fill form completely. Incomplete forms will not be accepted. Once issued, blood cannot be returned to the blood bank.',
              'Blood bank will perform Cross Matching before issuing. Responsibility of adverse reactions lies with the patient\'s doctor.',
            ].map((instruction, i) => (
              <View key={i} style={styles.instructionRow}>
                <View style={styles.instructionNum}>
                  <Text style={styles.instructionNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Submit Button */}
          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }]}
            onPress={handleSubmit}>
            <Ionicons name="send" size={18} color={Palette.white} />
            <Text style={styles.submitBtnText}>Submit Requisition</Text>
          </Pressable>

          <Text style={styles.footerNote}>
            आदेशानुसार — रक्त कोष अधिकारी{'\n'}
            Durg District Blood Center (C.G.) · Licence No. 28C/5/96
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },

  // Header
  headerBar: {
    backgroundColor: Palette.white,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    ...Shadows.subtle,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 1,
    fontWeight: '500',
  },
  headerBadge: {
    backgroundColor: Palette.primarySurface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Palette.primary + '30',
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
  },

  // Info Banner
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Palette.infoBg,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Palette.infoBorder,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: Palette.info,
    fontWeight: '500',
    lineHeight: 18,
  },

  // Scroll
  scrollContent: {
    padding: Spacing.screenPadding,
    paddingBottom: 40,
  },

  // Blood Group Chips (special style)
  bloodGroupChip: {
    width: 56,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Palette.border,
    backgroundColor: Palette.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodGroupChipActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.primarySurface,
  },
  bloodGroupChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  bloodGroupChipTextActive: {
    color: Palette.primary,
  },

  // Row helpers
  row2: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // Relation chips
  relationRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  relChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Palette.border,
    backgroundColor: Palette.white,
  },
  relChipActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.primarySurface,
  },
  relChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  relChipTextActive: {
    color: Palette.primary,
  },

  // Female section
  femaleSection: {
    backgroundColor: Palette.moderateBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.moderateBorder,
    marginTop: 8,
  },
  femaleSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  femaleSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.moderate,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  // Collector note
  collectNote: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },

  // Instructions
  instructionsCard: {
    backgroundColor: Palette.warningBg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.warningBorder,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.warning,
  },
  instructionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  instructionNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Palette.warning + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  instructionNumText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.warning,
  },
  instructionText: {
    flex: 1,
    fontSize: 12,
    color: Palette.textSecondary,
    lineHeight: 18,
  },

  // Submit
  submitBtn: {
    backgroundColor: Palette.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    ...Shadows.card,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.white,
    letterSpacing: -0.2,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    color: Palette.textMuted,
    lineHeight: 18,
    marginBottom: 16,
  },

  // Success state
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Palette.background,
  },
  successIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Palette.healthyBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Palette.healthyBorder,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  successSubtitle: {
    fontSize: 14,
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  successCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    width: '100%',
    marginBottom: 20,
    ...Shadows.card,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
  },
  successDivider: {
    height: 1,
    backgroundColor: Palette.borderSubtle,
    marginHorizontal: Spacing.lg,
  },
  successRowLabel: {
    fontSize: 13,
    color: Palette.textMuted,
    fontWeight: '500',
  },
  successRowValue: {
    fontSize: 14,
    color: Palette.textPrimary,
    fontWeight: '700',
  },
  successNote: {
    fontSize: 12,
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  newFormBtn: {
    backgroundColor: Palette.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
    ...Shadows.card,
  },
  newFormBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.white,
  },
  backHomeBtn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Palette.border,
    backgroundColor: Palette.white,
  },
  backHomeBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
});
