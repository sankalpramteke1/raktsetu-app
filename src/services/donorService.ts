import { getDonationsForDonor } from '../data/donationHistory';
import { DONORS } from '../data/donors';
import { BloodGroup } from '../types/blood';
import { DonationRecord, Donor, DonorStatus } from '../types/donor';
import { apiRequest } from './apiClient';

interface BackendDonor {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  blood_type: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  weight_kg?: number;
  blood_donor_no?: string;
  last_donation_date?: string;
  total_donations?: number;
  eligibility_status?: string;
  form9_data?: any;
}

const calculateAge = (dobString?: string): number => {
  if (!dobString) return 28;
  const birthYear = new Date(dobString).getFullYear();
  if (isNaN(birthYear)) return 28;
  return new Date().getFullYear() - birthYear;
};

const mapBackendDonor = (b: BackendDonor): Donor => {
  const status: DonorStatus =
    b.eligibility_status === 'eligible'
      ? 'Active'
      : b.eligibility_status === 'deferred'
      ? 'Inactive'
      : 'Eligible Soon';

  const lastDonation = b.last_donation_date || '2026-01-15';
  const lastDate = new Date(lastDonation);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + 90);

  return {
    donorId: b.blood_donor_no || `BD-${String(b.id).padStart(4, '0')}`,
    fullName: b.name,
    bloodGroup: (b.blood_type || 'O+') as BloodGroup,
    mobile: b.phone || '+91 94252 00000',
    email: b.email || `${b.name.toLowerCase().replace(/\s+/g, '.')}@example.org`,
    location: `${b.city || 'Durg'}, ${b.state || 'Chhattisgarh'}`,
    subLocation: b.address || undefined,
    lastDonationDate: lastDonation,
    totalDonations: b.total_donations || 1,
    status,
    gender: b.gender?.toLowerCase() === 'female' ? 'Female' : 'Male',
    age: calculateAge(b.dob) || Number(b.form9_data?.personal?.age) || 30,
    weightKg: b.weight_kg || Number(b.form9_data?.personal?.weightKg) || 68,
    nextEligibleDate: nextDate.toISOString().slice(0, 10),
  };
};

export const donorService = {
  getAllDonors: async (): Promise<Donor[]> => {
    try {
      const res = await apiRequest<{ donors: BackendDonor[] }>('/donors');
      if (res?.donors && res.donors.length > 0) {
        return res.donors.map(mapBackendDonor);
      }
    } catch (e) {
      console.warn('Using local fallback for donors list:', e);
    }
    return [...DONORS];
  },

  getDonorById: async (id: string): Promise<Donor | undefined> => {
    try {
      // If id is numeric or can be parsed
      const numericId = id.replace(/\D/g, '');
      if (numericId) {
        const res = await apiRequest<{ donor: BackendDonor }>(`/donors/${numericId}`);
        if (res?.donor) {
          return mapBackendDonor(res.donor);
        }
      }
      // Also try fetching list to find by donorId
      const all = await donorService.getAllDonors();
      const match = all.find((d) => d.donorId === id || d.donorId.endsWith(id));
      if (match) return match;
    } catch (e) {
      console.warn(`Failed to fetch donor ${id} from API:`, e);
    }
    return DONORS.find((d) => d.donorId === id);
  },

  searchDonors: async (
    query: string,
    bloodGroupFilter?: BloodGroup | 'All',
    statusFilter?: DonorStatus | 'All'
  ): Promise<Donor[]> => {
    let result = await donorService.getAllDonors();

    if (bloodGroupFilter && bloodGroupFilter !== 'All') {
      result = result.filter((d) => d.bloodGroup === bloodGroupFilter);
    }

    if (statusFilter && statusFilter !== 'All') {
      result = result.filter((d) => d.status === statusFilter);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.fullName.toLowerCase().includes(q) ||
          d.donorId.toLowerCase().includes(q) ||
          d.mobile.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          (d.subLocation && d.subLocation.toLowerCase().includes(q)) ||
          d.bloodGroup.toLowerCase().includes(q)
      );
    }

    return result;
  },

  getDonationHistory: async (donorId: string): Promise<DonationRecord[]> => {
    return Promise.resolve(getDonationsForDonor(donorId));
  },
};
