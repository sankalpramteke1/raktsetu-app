import { BloodGroup } from './blood';

export type CampStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';

export type CampType =
  | 'Hospital Camp'
  | 'Corporate Camp'
  | 'College Camp'
  | 'Community Camp'
  | 'NGO Camp'
  | 'Government Camp'
  | 'Other';

export type CampParticipantStatus =
  | 'Registered'
  | 'Checked In'
  | 'Screened'
  | 'Donated'
  | 'Deferred'
  | 'Cancelled';

export interface CampParticipant {
  donorId: string;
  status: CampParticipantStatus;
  registeredAt: string;
  screenedAt?: string;
  donatedAt?: string;
  collectedUnits?: number;
  bagId?: string;
  notes?: string;
}

export type CampGroupBreakdown = Record<BloodGroup, number>;

export interface BloodDonationCamp {
  id: string; // e.g. CAMP-2026-001
  name: string;
  type: CampType;
  organizer: string;
  contactPerson: string;
  contactNumber: string;
  date: string; // e.g. "28 Sep 2026"
  startTime: string; // e.g. "09:00 AM"
  endTime: string; // e.g. "04:00 PM"
  venue: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  expectedDonors: number;
  targetUnits: number;
  unitsCollected: number;
  status: CampStatus;
  description?: string;
  participants: CampParticipant[];
  groupCollection: CampGroupBreakdown;
}

export interface CampSummaryStats {
  upcoming: number;
  ongoing: number;
  completed: number;
  totalUnits: number;
}
