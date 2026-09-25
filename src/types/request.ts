import { BloodGroup } from './blood';

export type RequestPriority = 'Normal' | 'Urgent' | 'Critical';

export type RequestStatus =
  | 'Pending'
  | 'Processing'
  | 'Cross Match'
  | 'Ready'
  | 'Issued'
  | 'Completed'
  | 'Cancelled';

export interface BloodRequest {
  requestId: string;
  patientName: string;
  patientId: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  unitsRequired: number;
  unitsIssued?: number;
  ward: string;
  department: string;
  attendingDoctor: string;
  priority: RequestPriority;
  requestDate: string;
  requestTime: string;
  status: RequestStatus;
  clinicalIndication: string;
  crossMatchStatus?: 'Not Started' | 'In Progress' | 'Compatible' | 'Incompatible';
  assignedBags?: string[];
  notes?: string;
}
