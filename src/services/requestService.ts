import { BLOOD_REQUESTS } from '../data/bloodRequests';
import { BloodGroup } from '../types/blood';
import { BloodRequest, RequestPriority, RequestStatus } from '../types/request';

export const requestService = {
  getAllRequests: async (): Promise<BloodRequest[]> => {
    return Promise.resolve([...BLOOD_REQUESTS]);
  },

  getRequestById: async (id: string): Promise<BloodRequest | undefined> => {
    return Promise.resolve(BLOOD_REQUESTS.find((r) => r.requestId === id));
  },

  filterRequests: async (
    statusFilter?: RequestStatus | 'All',
    priorityFilter?: RequestPriority | 'All',
    bloodGroupFilter?: BloodGroup | 'All',
    query?: string
  ): Promise<BloodRequest[]> => {
    let result = [...BLOOD_REQUESTS];

    if (statusFilter && statusFilter !== 'All') {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (priorityFilter && priorityFilter !== 'All') {
      result = result.filter((r) => r.priority === priorityFilter);
    }

    if (bloodGroupFilter && bloodGroupFilter !== 'All') {
      result = result.filter((r) => r.bloodGroup === bloodGroupFilter);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.patientName.toLowerCase().includes(q) ||
          r.requestId.toLowerCase().includes(q) ||
          r.patientId.toLowerCase().includes(q) ||
          r.ward.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.attendingDoctor.toLowerCase().includes(q) ||
          r.bloodGroup.toLowerCase().includes(q)
      );
    }

    return Promise.resolve(result);
  },

  getPendingRequests: async (): Promise<BloodRequest[]> => {
    return Promise.resolve(
      BLOOD_REQUESTS.filter(
        (r) => r.status === 'Pending' || r.status === 'Processing' || r.status === 'Cross Match'
      )
    );
  },
};
