import { BLOOD_REQUESTS } from '../data/bloodRequests';
import { BloodGroup } from '../types/blood';
import { BloodRequest, RequestPriority, RequestStatus } from '../types/request';
import { apiRequest } from './apiClient';

interface BackendRequisition {
  id: number;
  hospital_name?: string;
  patient_name: string;
  relation_type?: string;
  relation_name?: string;
  regd_admn_no?: string;
  age?: number | string;
  sex?: string;
  ward?: string;
  bed_no?: string;
  doctor_incharge?: string;
  clinical_diagnosis?: string;
  hb_percent?: string;
  routine_or_emergency?: string;
  blood_type: string;
  units_required: number;
  needed_by_date?: string;
  needed_by_time?: string;
  request_datetime?: string;
  status?: string;
  created_at?: string;
  collecting_staff_name?: string;
  collecting_staff_designation?: string;
}

const mapStatus = (status?: string): RequestStatus => {
  switch (status?.toLowerCase()) {
    case 'cross_matched':
      return 'Cross Match';
    case 'issued':
      return 'Issued';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Pending';
  }
};

const mapBackendRequisition = (r: BackendRequisition): BloodRequest => {
  const priority: RequestPriority =
    r.routine_or_emergency === 'emergency' ? 'Urgent' : 'Normal';

  return {
    requestId: `REQ-${String(r.id).padStart(4, '0')}`,
    patientName: r.patient_name,
    patientId: r.regd_admn_no || `PT-${r.id}`,
    age: Number(r.age) || 35,
    gender: (r.sex?.toLowerCase() === 'female' ? 'Female' : 'Male') as 'Male' | 'Female',
    bloodGroup: (r.blood_type || 'O+') as BloodGroup,
    unitsRequired: r.units_required || 1,
    unitsIssued: r.status === 'issued' ? r.units_required : 0,
    ward: r.ward || 'General Ward',
    department: 'General Ward / Surgery',
    attendingDoctor: r.doctor_incharge || 'Dr. S. K. Verma',
    priority,
    requestDate: (r.request_datetime || r.created_at || new Date().toISOString()).slice(0, 10),
    requestTime: '10:30 AM',
    status: mapStatus(r.status),
    clinicalIndication: r.clinical_diagnosis || 'Severe Anemia',
  };
};

export const requestService = {
  getAllRequests: async (): Promise<BloodRequest[]> => {
    try {
      const res = await apiRequest<{ requisitions: BackendRequisition[] }>('/requisitions');
      if (res?.requisitions && res.requisitions.length > 0) {
        return res.requisitions.map(mapBackendRequisition);
      }
    } catch (e) {
      console.warn('Using local fallback for blood requests:', e);
    }
    return [...BLOOD_REQUESTS];
  },

  getRequestById: async (id: string): Promise<BloodRequest | undefined> => {
    try {
      const numericId = id.replace(/\D/g, '');
      if (numericId) {
        const res = await apiRequest<{ requisition: BackendRequisition }>(`/requisitions/${numericId}`);
        if (res?.requisition) {
          return mapBackendRequisition(res.requisition);
        }
      }
      const all = await requestService.getAllRequests();
      const found = all.find((r) => r.requestId === id || r.requestId.endsWith(id));
      if (found) return found;
    } catch (e) {
      console.warn(`Failed to fetch requisition ${id} from API:`, e);
    }
    return BLOOD_REQUESTS.find((r) => r.requestId === id);
  },

  createRequisition: async (payload: Partial<BackendRequisition>): Promise<BloodRequest> => {
    const res = await apiRequest<{ requisition: BackendRequisition }>('/requisitions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapBackendRequisition(res.requisition);
  },

  filterRequests: async (
    statusFilter?: RequestStatus | 'All',
    priorityFilter?: RequestPriority | 'All',
    bloodGroupFilter?: BloodGroup | 'All',
    query?: string
  ): Promise<BloodRequest[]> => {
    let result = await requestService.getAllRequests();

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

    return result;
  },

  getPendingRequests: async (): Promise<BloodRequest[]> => {
    const all = await requestService.getAllRequests();
    return all.filter(
      (r) => r.status === 'Pending' || r.status === 'Processing' || r.status === 'Cross Match'
    );
  },
};
