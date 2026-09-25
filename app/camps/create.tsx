import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Palette, Shadows, Spacing } from '../../src/constants/theme';
import { campService } from '../../src/services/campService';
import { CampType } from '../../src/types/camp';

const CAMP_TYPES: CampType[] = [
  'Hospital Camp',
  'Corporate Camp',
  'College Camp',
  'Community Camp',
  'NGO Camp',
  'Government Camp',
  'Other',
];

interface FormErrors {
  name?: string;
  organizer?: string;
  contactPerson?: string;
  contactNumber?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  address?: string;
  expectedDonors?: string;
  targetUnits?: string;
}

export default function CreateCampScreen() {
  const router = useRouter();

  // Basic Details
  const [name, setName] = useState('');
  const [type, setType] = useState<CampType>('Community Camp');
  const [organizer, setOrganizer] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // Schedule
  const [date, setDate] = useState('02 Oct 2026');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('04:00 PM');

  // Location
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Durg');
  const [district, setDistrict] = useState('Durg');
  const [state, setState] = useState('Chhattisgarh');
  const [pincode, setPincode] = useState('491001');

  // Targets & Notes
  const [expectedDonors, setExpectedDonors] = useState('50');
  const [targetUnits, setTargetUnits] = useState('40');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!name.trim()) errs.name = 'Camp name is required';
    if (!organizer.trim()) errs.organizer = 'Organizer is required';
    if (!contactPerson.trim()) errs.contactPerson = 'Contact person is required';

    const cleanPhone = contactNumber.replace(/\D/g, '');
    if (!contactNumber.trim()) {
      errs.contactNumber = 'Contact number is required';
    } else if (cleanPhone.length < 10) {
      errs.contactNumber = 'Enter a valid 10-digit mobile number';
    }

    if (!date.trim()) errs.date = 'Date is required';
    if (!startTime.trim()) errs.startTime = 'Start time is required';
    if (!endTime.trim()) errs.endTime = 'End time is required';

    if (!venue.trim()) errs.venue = 'Venue name is required';
    if (!address.trim()) errs.address = 'Address is required';

    const donorsNum = parseInt(expectedDonors, 10);
    if (isNaN(donorsNum) || donorsNum <= 0) {
      errs.expectedDonors = 'Expected donors must be greater than 0';
    }

    const unitsNum = parseInt(targetUnits, 10);
    if (isNaN(unitsNum) || unitsNum <= 0) {
      errs.targetUnits = 'Target blood units must be greater than 0';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) {
      Alert.alert('Required Fields', 'Please complete the highlighted required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await campService.createCamp({
        name: name.trim(),
        type,
        organizer: organizer.trim(),
        contactPerson: contactPerson.trim(),
        contactNumber: contactNumber.trim(),
        date: date.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        venue: venue.trim(),
        address: address.trim(),
        city: city.trim(),
        district: district.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        expectedDonors: parseInt(expectedDonors, 10) || 50,
        targetUnits: parseInt(targetUnits, 10) || 40,
        status: 'Upcoming',
        description: description.trim() || undefined,
      });

      setSubmitting(false);
      Alert.alert('Success', `Blood donation camp "${created.name}" created successfully!`, [
        {
          text: 'Open Camp Details',
          onPress: () => {
            router.replace({
              pathname: '/camps/[id]',
              params: { id: created.id },
            });
          },
        },
      ]);
    } catch {
      setSubmitting(false);
      Alert.alert('Error', 'Failed to create camp. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Screen Header */}
      <View style={styles.topHeader}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={Palette.textPrimary} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>New Donation Camp</Text>
          <Text style={styles.headerSubtitle}>District Hospital Blood Center</Text>
        </View>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* Section 1: Basic Details */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconCircle}>
                <Ionicons name="information" size={16} color={Palette.primary} />
              </View>
              <Text style={styles.sectionTitle}>Basic Details</Text>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>
                Camp Name <Text style={styles.req}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="e.g. Bhilai Steel Plant Mega Camp"
                placeholderTextColor={Palette.textMuted}
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
              />
              {errors.name && <Text style={styles.errText}>{errors.name}</Text>}
            </View>

            {/* Camp Type Picker */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Camp Type</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.typeScroll}>
                {CAMP_TYPES.map((t) => (
                  <Pressable
                    key={t}
                    style={[styles.typePill, type === t && styles.typePillActive]}
                    onPress={() => setType(t)}>
                    <Text
                      style={[styles.typePillText, type === t && styles.typePillTextActive]}>
                      {t}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>
                Organizer Name <Text style={styles.req}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.organizer && styles.inputError]}
                placeholder="e.g. Lions Club Bhilai / IIT Bhilai NSS"
                placeholderTextColor={Palette.textMuted}
                value={organizer}
                onChangeText={(t) => {
                  setOrganizer(t);
                  if (errors.organizer) setErrors({ ...errors, organizer: undefined });
                }}
              />
              {errors.organizer && <Text style={styles.errText}>{errors.organizer}</Text>}
            </View>

            <View style={styles.twoCol}>
              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.label}>
                  Contact Person <Text style={styles.req}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.contactPerson && styles.inputError]}
                  placeholder="Coordinator name"
                  placeholderTextColor={Palette.textMuted}
                  value={contactPerson}
                  onChangeText={(t) => {
                    setContactPerson(t);
                    if (errors.contactPerson) setErrors({ ...errors, contactPerson: undefined });
                  }}
                />
                {errors.contactPerson && <Text style={styles.errText}>{errors.contactPerson}</Text>}
              </View>

              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.label}>
                  Contact Phone <Text style={styles.req}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.contactNumber && styles.inputError]}
                  placeholder="+91 98260 00000"
                  placeholderTextColor={Palette.textMuted}
                  keyboardType="phone-pad"
                  value={contactNumber}
                  onChangeText={(t) => {
                    setContactNumber(t);
                    if (errors.contactNumber) setErrors({ ...errors, contactNumber: undefined });
                  }}
                />
                {errors.contactNumber && <Text style={styles.errText}>{errors.contactNumber}</Text>}
              </View>
            </View>
          </View>

          {/* Section 2: Schedule */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconCircle}>
                <Ionicons name="calendar-outline" size={16} color={Palette.primary} />
              </View>
              <Text style={styles.sectionTitle}>Schedule</Text>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>
                Camp Date <Text style={styles.req}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.date && styles.inputError]}
                placeholder="e.g. 02 Oct 2026"
                placeholderTextColor={Palette.textMuted}
                value={date}
                onChangeText={(t) => {
                  setDate(t);
                  if (errors.date) setErrors({ ...errors, date: undefined });
                }}
              />
              {errors.date && <Text style={styles.errText}>{errors.date}</Text>}
            </View>

            <View style={styles.twoCol}>
              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.label}>
                  Start Time <Text style={styles.req}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.startTime && styles.inputError]}
                  placeholder="09:00 AM"
                  placeholderTextColor={Palette.textMuted}
                  value={startTime}
                  onChangeText={(t) => {
                    setStartTime(t);
                    if (errors.startTime) setErrors({ ...errors, startTime: undefined });
                  }}
                />
                {errors.startTime && <Text style={styles.errText}>{errors.startTime}</Text>}
              </View>

              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.label}>
                  End Time <Text style={styles.req}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.endTime && styles.inputError]}
                  placeholder="04:00 PM"
                  placeholderTextColor={Palette.textMuted}
                  value={endTime}
                  onChangeText={(t) => {
                    setEndTime(t);
                    if (errors.endTime) setErrors({ ...errors, endTime: undefined });
                  }}
                />
                {errors.endTime && <Text style={styles.errText}>{errors.endTime}</Text>}
              </View>
            </View>
          </View>

          {/* Section 3: Location */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconCircle}>
                <Ionicons name="location-outline" size={16} color={Palette.primary} />
              </View>
              <Text style={styles.sectionTitle}>Location</Text>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>
                Venue Name <Text style={styles.req}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.venue && styles.inputError]}
                placeholder="e.g. Auditorium Hall, BIT Durg"
                placeholderTextColor={Palette.textMuted}
                value={venue}
                onChangeText={(t) => {
                  setVenue(t);
                  if (errors.venue) setErrors({ ...errors, venue: undefined });
                }}
              />
              {errors.venue && <Text style={styles.errText}>{errors.venue}</Text>}
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>
                Address / Street <Text style={styles.req}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.address && styles.inputError]}
                placeholder="e.g. G.E. Road, Padmanabhpur"
                placeholderTextColor={Palette.textMuted}
                value={address}
                onChangeText={(t) => {
                  setAddress(t);
                  if (errors.address) setErrors({ ...errors, address: undefined });
                }}
              />
              {errors.address && <Text style={styles.errText}>{errors.address}</Text>}
            </View>

            <View style={styles.twoCol}>
              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.label}>District</Text>
                <TextInput
                  style={styles.input}
                  value={district}
                  onChangeText={setDistrict}
                />
              </View>
            </View>

            <View style={styles.twoCol}>
              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  value={state}
                  onChangeText={setState}
                />
              </View>

              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.label}>PIN Code</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={pincode}
                  onChangeText={setPincode}
                />
              </View>
            </View>
          </View>

          {/* Section 4: Camp Targets & Notes */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconCircle}>
                <Ionicons name="analytics-outline" size={16} color={Palette.primary} />
              </View>
              <Text style={styles.sectionTitle}>Camp Targets & Notes</Text>
            </View>

            <View style={styles.twoCol}>
              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.label}>
                  Expected Donors <Text style={styles.req}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.expectedDonors && styles.inputError]}
                  keyboardType="numeric"
                  value={expectedDonors}
                  onChangeText={(t) => {
                    setExpectedDonors(t);
                    if (errors.expectedDonors) setErrors({ ...errors, expectedDonors: undefined });
                  }}
                />
                {errors.expectedDonors && (
                  <Text style={styles.errText}>{errors.expectedDonors}</Text>
                )}
              </View>

              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.label}>
                  Target Blood Units <Text style={styles.req}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.targetUnits && styles.inputError]}
                  keyboardType="numeric"
                  value={targetUnits}
                  onChangeText={(t) => {
                    setTargetUnits(t);
                    if (errors.targetUnits) setErrors({ ...errors, targetUnits: undefined });
                  }}
                />
                {errors.targetUnits && <Text style={styles.errText}>{errors.targetUnits}</Text>}
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Additional Information / Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Special arrangements, refreshments, or instructions..."
                placeholderTextColor={Palette.textMuted}
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          {/* Status info note */}
          <View style={styles.noteBanner}>
            <Ionicons name="sparkles" size={16} color={Palette.moderate} />
            <Text style={styles.noteText}>
              Newly created camps automatically start with status{' '}
              <Text style={styles.noteBold}>Upcoming</Text>.
            </Text>
          </View>

          {/* Submit Action */}
          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              pressed && styles.submitBtnPressed,
              submitting && styles.submitBtnDisabled,
            ]}
            disabled={submitting}
            onPress={handleCreate}>
            <Ionicons name="add-circle" size={18} color={Palette.white} />
            <Text style={styles.submitBtnText}>
              {submitting ? 'Creating Camp...' : 'Create Blood Donation Camp'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.white,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderLight,
    backgroundColor: Palette.white,
  },
  backBtn: {
    padding: 6,
    marginRight: Spacing.sm,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  headerRightPlaceholder: {
    width: 28,
  },
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl + 20,
  },
  sectionCard: {
    backgroundColor: Palette.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  fieldWrap: {
    marginBottom: Spacing.sm + 4,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
    marginBottom: 5,
  },
  req: {
    color: Palette.primary,
  },
  input: {
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 9,
    fontSize: 13,
    color: Palette.textPrimary,
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: Palette.critical,
    backgroundColor: Palette.criticalBg,
  },
  errText: {
    fontSize: 11,
    color: Palette.critical,
    marginTop: 4,
  },
  typeScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  typePillActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  typePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  typePillTextActive: {
    color: Palette.white,
  },
  noteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.moderateBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: 8,
    borderWidth: 1,
    borderColor: Palette.moderateBorder,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: Palette.textPrimary,
    lineHeight: 16,
  },
  noteBold: {
    fontWeight: '700',
    color: Palette.moderate,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: 8,
    ...Shadows.card,
  },
  submitBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.white,
  },
});
