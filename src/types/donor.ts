import { BloodGroup } from './blood';

export type DonorStatus = 'Active' | 'Inactive' | 'Eligible Soon' | 'Recently Donated';

export interface DonationRecord {
  donationId: string;
  donorId: string;
  donationDate: string;
  bloodGroup: BloodGroup;
  units: number;
  bagId: string;
  campOrCenter: string;
  hemoglobin: number; // in g/dL
  bloodPressure: string;
  vitalsApproved: boolean;
}

export interface Donor {
  donorId: string;
  fullName: string;
  bloodGroup: BloodGroup;
  mobile: string;
  email: string;
  location: string;
  subLocation?: string;
  lastDonationDate: string;
  totalDonations: number;
  status: DonorStatus;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  weightKg: number;
  nextEligibleDate: string;
}
