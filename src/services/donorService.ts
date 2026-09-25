import { DONATION_HISTORY, getDonationsForDonor } from '../data/donationHistory';
import { DONORS } from '../data/donors';
import { BloodGroup } from '../types/blood';
import { DonationRecord, Donor, DonorStatus } from '../types/donor';

export const donorService = {
  getAllDonors: async (): Promise<Donor[]> => {
    return Promise.resolve([...DONORS]);
  },

  getDonorById: async (id: string): Promise<Donor | undefined> => {
    return Promise.resolve(DONORS.find((d) => d.donorId === id));
  },

  searchDonors: async (
    query: string,
    bloodGroupFilter?: BloodGroup | 'All',
    statusFilter?: DonorStatus | 'All'
  ): Promise<Donor[]> => {
    let result = [...DONORS];

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

    return Promise.resolve(result);
  },

  getDonationHistory: async (donorId: string): Promise<DonationRecord[]> => {
    return Promise.resolve(getDonationsForDonor(donorId));
  },
};
