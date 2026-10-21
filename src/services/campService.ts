import { INITIAL_CAMPS } from '../data/camps';
import { DONORS } from '../data/donors';
import { BloodGroup } from '../types/blood';
import {
  BloodDonationCamp,
  CampParticipant,
  CampParticipantStatus,
  CampStatus,
  CampSummaryStats,
  CampType,
} from '../types/camp';
import { apiRequest } from './apiClient';

interface BackendCampRequest {
  id: number;
  organization_name?: string;
  organizer?: string;
  camp_name?: string;
  name?: string;
  venue?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  camp_date?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  contact_person?: string;
  contact_number?: string;
  contact_phone?: string;
  expected_donors?: number;
  target_units?: number;
  units_collected?: number;
  status?: string;
  description?: string;
  camp_type?: string;
}

const mapBackendStatus = (status?: string): CampStatus => {
  switch (status?.toLowerCase()) {
    case 'ongoing':
    case 'in_progress':
      return 'Ongoing';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Upcoming';
  }
};

const mapBackendCamp = (c: BackendCampRequest): BloodDonationCamp => {
  return {
    id: `CAMP-${c.id}`,
    name: c.camp_name || c.name || `${c.organization_name || 'Community'} Blood Donation Camp`,
    type: (c.camp_type as CampType) || 'Community Camp',
    organizer: c.organization_name || c.organizer || 'Local Organization',
    contactPerson: c.contact_person || 'Coordinator',
    contactNumber: c.contact_number || c.contact_phone || '+91 94252 00000',
    date: (c.camp_date || c.date || new Date().toISOString().slice(0, 10)),
    startTime: c.start_time || '09:00 AM',
    endTime: c.end_time || '04:00 PM',
    venue: c.venue || 'City Community Hall',
    address: c.address || 'Civil Lines',
    city: c.city || 'Durg',
    district: c.district || 'Durg',
    state: c.state || 'Chhattisgarh',
    pincode: c.pincode || '491001',
    expectedDonors: c.expected_donors || 50,
    targetUnits: c.target_units || 40,
    unitsCollected: c.units_collected || 0,
    status: mapBackendStatus(c.status),
    description: c.description || 'Voluntary blood donation camp.',
    participants: [],
    groupCollection: {
      'O+': 0, 'B+': 0, 'A+': 0, 'O-': 0, 'AB+': 0, 'A-': 0, 'B-': 0, 'AB-': 0,
    },
  };
};

// In-memory state holding the camps
let campsState: BloodDonationCamp[] = [...INITIAL_CAMPS];
const listeners: Array<() => void> = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const campService = {
  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  },

  getAllCamps: async (): Promise<BloodDonationCamp[]> => {
    try {
      const res = await apiRequest<{ requests?: BackendCampRequest[]; camps?: BackendCampRequest[] }>('/camp-requests/scheduled');
      const list = res?.requests || res?.camps || (Array.isArray(res) ? res : null);
      if (list && list.length > 0) {
        return list.map(mapBackendCamp);
      }
    } catch (e) {
      console.warn('Using local fallback for camps list:', e);
    }
    return Promise.resolve([...campsState]);
  },

  getCampById: async (id: string): Promise<BloodDonationCamp | undefined> => {
    try {
      const all = await campService.getAllCamps();
      const found = all.find((c) => c.id === id || c.id.endsWith(id));
      if (found) return found;
    } catch (e) {
      console.warn(`Failed to fetch camp ${id} from API:`, e);
    }
    return Promise.resolve(campsState.find((c) => c.id === id));
  },

  getCampStats: async (): Promise<CampSummaryStats> => {
    const upcoming = campsState.filter((c) => c.status === 'Upcoming').length;
    const ongoing = campsState.filter((c) => c.status === 'Ongoing').length;
    const completed = campsState.filter((c) => c.status === 'Completed').length;
    const totalUnits = campsState.reduce((acc, c) => acc + (c.unitsCollected || 0), 0);

    return Promise.resolve({
      upcoming,
      ongoing,
      completed,
      totalUnits,
    });
  },

  createCamp: async (
    newCampData: Omit<BloodDonationCamp, 'id' | 'unitsCollected' | 'participants' | 'groupCollection'>
  ): Promise<BloodDonationCamp> => {
    const nextId = `CAMP-2026-${String(campsState.length + 1).padStart(3, '0')}`;
    const newCamp: BloodDonationCamp = {
      ...newCampData,
      id: nextId,
      unitsCollected: 0,
      participants: [],
      groupCollection: {
        'O+': 0, 'B+': 0, 'A+': 0, 'O-': 0, 'AB+': 0, 'A-': 0, 'B-': 0, 'AB-': 0,
      },
    };

    campsState = [newCamp, ...campsState];
    notifyListeners();
    return Promise.resolve(newCamp);
  },

  updateCamp: async (
    id: string,
    updates: Partial<BloodDonationCamp>
  ): Promise<BloodDonationCamp | undefined> => {
    const idx = campsState.findIndex((c) => c.id === id);
    if (idx === -1) return Promise.resolve(undefined);

    campsState[idx] = { ...campsState[idx], ...updates };
    notifyListeners();
    return Promise.resolve(campsState[idx]);
  },

  updateCampStatus: async (
    id: string,
    status: CampStatus
  ): Promise<BloodDonationCamp | undefined> => {
    return campService.updateCamp(id, { status });
  },

  addDonorToCamp: async (
    campId: string,
    donorId: string
  ): Promise<{ success: boolean; message: string }> => {
    const camp = campsState.find((c) => c.id === campId);
    if (!camp) return Promise.resolve({ success: false, message: 'Camp not found' });

    // Check if donor is already registered
    const exists = camp.participants.some((p) => p.donorId === donorId);
    if (exists) {
      return Promise.resolve({ success: false, message: 'Donor is already registered in this camp' });
    }

    const donor = DONORS.find((d) => d.donorId === donorId);
    if (!donor) return Promise.resolve({ success: false, message: 'Donor not found' });

    const newParticipant: CampParticipant = {
      donorId,
      status: 'Registered',
      registeredAt: 'Just now',
    };

    camp.participants = [newParticipant, ...camp.participants];
    notifyListeners();
    return Promise.resolve({ success: true, message: `${donor.fullName} registered for camp` });
  },

  updateParticipantStatus: async (
    campId: string,
    donorId: string,
    status: CampParticipantStatus
  ): Promise<{ success: boolean; camp?: BloodDonationCamp }> => {
    const camp = campsState.find((c) => c.id === campId);
    if (!camp) return Promise.resolve({ success: false });

    const participant = camp.participants.find((p) => p.donorId === donorId);
    if (!participant) return Promise.resolve({ success: false });

    const prevStatus = participant.status;
    participant.status = status;

    if (status === 'Donated' && prevStatus !== 'Donated') {
      participant.donatedAt = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      participant.collectedUnits = 1;
      participant.bagId = `BAG-2026-${8400 + Math.floor(Math.random() * 900)}`;

      camp.unitsCollected += 1;

      // Update group collection count based on donor's blood group
      const donor = DONORS.find((d) => d.donorId === donorId);
      if (donor && donor.bloodGroup) {
        camp.groupCollection[donor.bloodGroup] = (camp.groupCollection[donor.bloodGroup] || 0) + 1;
      }
    } else if (prevStatus === 'Donated' && status !== 'Donated') {
      camp.unitsCollected = Math.max(0, camp.unitsCollected - 1);
      const donor = DONORS.find((d) => d.donorId === donorId);
      if (donor && donor.bloodGroup) {
        camp.groupCollection[donor.bloodGroup] = Math.max(0, (camp.groupCollection[donor.bloodGroup] || 1) - 1);
      }
    }

    notifyListeners();
    return Promise.resolve({ success: true, camp });
  },

  searchCamps: async (
    query: string,
    statusFilter: CampStatus | 'All',
    typeFilter: CampType | 'All' = 'All'
  ): Promise<BloodDonationCamp[]> => {
    let result = [...campsState];

    if (statusFilter !== 'All') {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (typeFilter !== 'All') {
      result = result.filter((c) => c.type === typeFilter);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.venue.toLowerCase().includes(q) ||
          c.organizer.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }

    return Promise.resolve(result);
  },
};
