import { DonationRecord } from '../types/donor';
import { DONORS } from './donors';

export const DONATION_HISTORY: DonationRecord[] = [
  // Realistic histories for top donors
  {
    donationId: 'HIST-2026-901',
    donorId: 'DON-3401',
    donationDate: '12 Aug 2026',
    bloodGroup: 'O+',
    units: 1,
    bagId: 'BAG-2026-07110',
    campOrCenter: 'District Hospital Blood Center, Durg',
    hemoglobin: 14.2,
    bloodPressure: '120/80',
    vitalsApproved: true,
  },
  {
    donationId: 'HIST-2026-902',
    donorId: 'DON-3401',
    donationDate: '18 Apr 2026',
    bloodGroup: 'O+',
    units: 1,
    bagId: 'BAG-2026-05421',
    campOrCenter: 'Red Cross Voluntary Camp, Padmanabhpur',
    hemoglobin: 14.0,
    bloodPressure: '118/78',
    vitalsApproved: true,
  },
  {
    donationId: 'HIST-2026-903',
    donorId: 'DON-3401',
    donationDate: '22 Dec 2025',
    bloodGroup: 'O+',
    units: 1,
    bagId: 'BAG-2025-09880',
    campOrCenter: 'District Hospital Blood Center, Durg',
    hemoglobin: 13.8,
    bloodPressure: '122/82',
    vitalsApproved: true,
  },
  {
    donationId: 'HIST-2026-904',
    donorId: 'DON-3401',
    donationDate: '10 Aug 2025',
    bloodGroup: 'O+',
    units: 1,
    bagId: 'BAG-2025-06712',
    campOrCenter: 'Rotary Blood Donation Camp, Durg',
    hemoglobin: 14.5,
    bloodPressure: '120/80',
    vitalsApproved: true,
  },
  {
    donationId: 'HIST-2026-905',
    donorId: 'DON-3401',
    donationDate: '14 Mar 2025',
    bloodGroup: 'O+',
    units: 1,
    bagId: 'BAG-2025-03210',
    campOrCenter: 'District Hospital Blood Center, Durg',
    hemoglobin: 14.1,
    bloodPressure: '118/76',
    vitalsApproved: true,
  },

  // Donor 3404 (Rohit Patel)
  {
    donationId: 'HIST-2026-910',
    donorId: 'DON-3404',
    donationDate: '24 Sep 2026',
    bloodGroup: 'B+',
    units: 1,
    bagId: 'BAG-2026-08490',
    campOrCenter: 'District Hospital Blood Center, Durg',
    hemoglobin: 15.1,
    bloodPressure: '124/82',
    vitalsApproved: true,
  },
  {
    donationId: 'HIST-2026-911',
    donorId: 'DON-3404',
    donationDate: '20 Jun 2026',
    bloodGroup: 'B+',
    units: 1,
    bagId: 'BAG-2026-06890',
    campOrCenter: 'Bhilai Steel Plant Blood Camp',
    hemoglobin: 14.8,
    bloodPressure: '122/80',
    vitalsApproved: true,
  },
  {
    donationId: 'HIST-2026-912',
    donorId: 'DON-3404',
    donationDate: '15 Mar 2026',
    bloodGroup: 'B+',
    units: 1,
    bagId: 'BAG-2026-03410',
    campOrCenter: 'District Hospital Blood Center, Durg',
    hemoglobin: 15.0,
    bloodPressure: '120/80',
    vitalsApproved: true,
  },
  {
    donationId: 'HIST-2026-913',
    donorId: 'DON-3404',
    donationDate: '02 Dec 2025',
    bloodGroup: 'B+',
    units: 1,
    bagId: 'BAG-2025-09511',
    campOrCenter: 'Civic Centre Voluntary Camp, Bhilai',
    hemoglobin: 14.6,
    bloodPressure: '118/78',
    vitalsApproved: true,
  },

  // Donor 3409 (Sanjay Singh Bais - Rare O- champion)
  {
    donationId: 'HIST-2026-920',
    donorId: 'DON-3409',
    donationDate: '23 Sep 2026',
    bloodGroup: 'O-',
    units: 1,
    bagId: 'BAG-2026-08461',
    campOrCenter: 'Emergency Replacement, Durg Blood Center',
    hemoglobin: 14.9,
    bloodPressure: '120/80',
    vitalsApproved: true,
  },
  {
    donationId: 'HIST-2026-921',
    donorId: 'DON-3409',
    donationDate: '15 Jun 2026',
    bloodGroup: 'O-',
    units: 1,
    bagId: 'BAG-2026-06512',
    campOrCenter: 'World Blood Donor Day Camp, Durg',
    hemoglobin: 15.2,
    bloodPressure: '122/80',
    vitalsApproved: true,
  },
  {
    donationId: 'HIST-2026-922',
    donorId: 'DON-3409',
    donationDate: '10 Feb 2026',
    bloodGroup: 'O-',
    units: 1,
    bagId: 'BAG-2026-02199',
    campOrCenter: 'District Hospital Blood Center, Durg',
    hemoglobin: 14.8,
    bloodPressure: '124/84',
    vitalsApproved: true,
  },
  {
    donationId: 'HIST-2026-923',
    donorId: 'DON-3409',
    donationDate: '18 Oct 2025',
    bloodGroup: 'O-',
    units: 1,
    bagId: 'BAG-2025-08711',
    campOrCenter: 'District Hospital Blood Center, Durg',
    hemoglobin: 15.0,
    bloodPressure: '120/80',
    vitalsApproved: true,
  },
];

// Helper to retrieve donation history for any donor dynamically if needed
export const getDonationsForDonor = (donorId: string): DonationRecord[] => {
  const direct = DONATION_HISTORY.filter((d) => d.donorId === donorId);
  if (direct.length > 0) return direct;

  const donor = DONORS.find((d) => d.donorId === donorId);
  if (!donor) return [];

  // Generate believable historic donation timeline for this donor
  const list: DonationRecord[] = [];
  const count = Math.min(donor.totalDonations, 5);

  const months = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];
  const years = [2026, 2025, 2024];

  for (let i = 0; i < count; i++) {
    const yr = i === 0 ? 2026 : years[Math.min(Math.floor(i / 2), years.length - 1)];
    const m = months[(i * 2 + 1) % months.length];
    const d = 10 + ((i * 7) % 18);
    const dateStr = i === 0 ? donor.lastDonationDate : `${d < 10 ? '0' + d : d} ${m} ${yr}`;

    list.push({
      donationId: `HIST-AUTO-${donorId}-${i + 1}`,
      donorId,
      donationDate: dateStr,
      bloodGroup: donor.bloodGroup,
      units: 1,
      bagId: `BAG-${yr}-0${7000 + i * 115}`,
      campOrCenter:
        i % 2 === 0
          ? 'District Hospital Blood Center, Durg'
          : `Voluntary Blood Drive, ${donor.location}`,
      hemoglobin: +(13.5 + (i * 0.3) % 2).toFixed(1),
      bloodPressure: i % 2 === 0 ? '120/80' : '118/78',
      vitalsApproved: true,
    });
  }

  return list;
};
