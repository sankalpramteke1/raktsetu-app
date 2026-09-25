export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type StockStatus = 'Healthy' | 'Moderate' | 'Low' | 'Critical';

export type BagStatus = 'Available' | 'Reserved' | 'Issued' | 'Expired' | 'Quarantined';

export interface BloodStockItem {
  bloodGroup: BloodGroup;
  units: number;
  status: StockStatus;
  recommendedMin: number;
  optimalLevel: number;
  lastUpdated: string;
  storageLocations: string[];
}

export interface BloodBag {
  bagId: string;
  bloodGroup: BloodGroup;
  collectionDate: string;
  expiryDate: string;
  status: BagStatus;
  storage: string;
  componentType: 'Whole Blood' | 'Packed RBC' | 'Platelet Concentrate' | 'Fresh Frozen Plasma';
  volumeMl: number;
  donorId: string;
  testedSafe: boolean;
}

export interface StockSummaryStats {
  totalUnits: number;
  criticalCount: number;
  lowCount: number;
  addedToday: number;
  issuedToday: number;
}
