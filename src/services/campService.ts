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
    const res = await apiRequest<{ requests?: BackendCampRequest[]; camps?: BackendCampRequest[] }>('/camp-requests/scheduled');
    const list = res?.requests || res?.camps || (Array.isArray(res) ? res : null);
    if (list && list.length > 0) {
      return list.map(mapBackendCamp);
    }
    return [];
  },

  getCampById: async (id: string): Promise<BloodDonationCamp | undefined> => {
    const all = await campService.getAllCamps();
    return all.find((c) => c.id === id || c.id.endsWith(id));
  },

  getCampStats: async (): Promise<CampSummaryStats> => {
    const camps = await campService.getAllCamps();
    const upcoming = camps.filter((c) => c.status === 'Upcoming').length;
    const ongoing = camps.filter((c) => c.status === 'Ongoing').length;
    const completed = camps.filter((c) => c.status === 'Completed').length;
    const totalUnits = camps.reduce((acc, c) => acc + (c.unitsCollected || 0), 0);

    return {
      upcoming,
      ongoing,
      completed,
      totalUnits,
    };
  },

  createCamp: async (
    newCampData: Omit<BloodDonationCamp, 'id' | 'unitsCollected' | 'participants' | 'groupCollection'>
  ): Promise<BloodDonationCamp> => {
    // TODO: POST to backend API when camp creation endpoint is available
    const nextId = `CAMP-2026-${String(Date.now()).slice(-6)}`;
    const newCamp: BloodDonationCamp = {
      ...newCampData,
      id: nextId,
      unitsCollected: 0,
      participants: [],
      groupCollection: {
        'O+': 0, 'B+': 0, 'A+': 0, 'O-': 0, 'AB+': 0, 'A-': 0, 'B-': 0, 'AB-': 0,
      },
    };

    notifyListeners();
    return newCamp;
  },

  updateCamp: async (
    _id: string,
    _updates: Partial<BloodDonationCamp>
  ): Promise<BloodDonationCamp | undefined> => {
    // TODO: PATCH to backend API when camp update endpoint is available
    return undefined;
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
    // TODO: POST to backend API when camp participant endpoint is available
    const camp = await campService.getCampById(campId);
    if (!camp) return { success: false, message: 'Camp not found' };

    // Check if donor is already registered
    const exists = camp.participants.some((p) => p.donorId === donorId);
    if (exists) {
      return { success: false, message: 'Donor is already registered in this camp' };
    }

    const newParticipant: CampParticipant = {
      donorId,
      status: 'Registered',
      registeredAt: 'Just now',
    };

    camp.participants = [newParticipant, ...camp.participants];
    notifyListeners();
    return { success: true, message: `Donor registered for camp` };
  },

  updateParticipantStatus: async (
    campId: string,
    donorId: string,
    status: CampParticipantStatus
  ): Promise<{ success: boolean; camp?: BloodDonationCamp }> => {
    const camp = await campService.getCampById(campId);
    if (!camp) return { success: false };

    const participant = camp.participants.find((p) => p.donorId === donorId);
    if (!participant) return { success: false };

    const prevStatus = participant.status;
    participant.status = status;

    if (status === 'Donated' && prevStatus !== 'Donated') {
      participant.donatedAt = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      participant.collectedUnits = 1;
      participant.bagId = `BAG-2026-${8400 + Math.floor(Math.random() * 900)}`;
      camp.unitsCollected += 1;
    } else if (prevStatus === 'Donated' && status !== 'Donated') {
      camp.unitsCollected = Math.max(0, camp.unitsCollected - 1);
    }

    notifyListeners();
    return { success: true, camp };
  },

  searchCamps: async (
    query: string,
    statusFilter: CampStatus | 'All',
    typeFilter: CampType | 'All' = 'All'
  ): Promise<BloodDonationCamp[]> => {
    let result = await campService.getAllCamps();

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

    return result;
  },
};
