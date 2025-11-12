export interface HealthRecord {
  id: string;
  date: string;
  type: 'Vaccination' | 'Deworming' | 'Treatment' | 'Check-up';
  notes: string;
  vet?: string;
}

export interface MilkRecord {
  id: string;
  date: string;
  yield: number; // in Liters
  time: 'Morning' | 'Evening';
}

export interface BreedingRecord {
  id: string;
  date: string;
  type: 'Insemination' | 'Calving' | 'Heat Cycle';
  sire?: string;
  notes: string;
}

export interface Animal {
  id: string;
  tagId: string;
  name: string;
  species: 'Cow' | 'Buffalo' | 'Goat' | 'Sheep';
  breed: string;
  birthDate: string;
  gender: 'Male' | 'Female';
  status: 'Active' | 'Sold' | 'Deceased';
  imageUrl: string;
  healthRecords: HealthRecord[];
  milkRecords: MilkRecord[];
  breedingRecords: BreedingRecord[];
}

export const initialAnimalData: Animal[] = [
  {
    id: 'A101',
    tagId: 'KA-01-1234',
    name: 'Lakshmi',
    species: 'Cow',
    breed: 'Holstein Friesian',
    birthDate: '2020-05-15',
    gender: 'Female',
    status: 'Active',
    imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/holstein_cow.jpg',
    healthRecords: [
      { id: 'H1', date: '2023-10-10', type: 'Vaccination', notes: 'FMD Vaccination', vet: 'Dr. Sharma' },
      { id: 'H2', date: '2023-11-05', type: 'Deworming', notes: 'Administered Albendazole' },
    ],
    milkRecords: [
      { id: 'M1', date: '2023-11-20', yield: 15, time: 'Morning' },
      { id: 'M2', date: '2023-11-20', yield: 12, time: 'Evening' },
    ],
    breedingRecords: [
        { id: 'B1', date: '2023-01-20', type: 'Calving', notes: 'Delivered a healthy male calf.' },
    ],
  },
  {
    id: 'A102',
    tagId: 'KA-01-5678',
    name: 'Ganga',
    species: 'Cow',
    breed: 'Gir',
    birthDate: '2019-02-20',
    gender: 'Female',
    status: 'Active',
    imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/gir_cow.jpg',
    healthRecords: [
      { id: 'H3', date: '2023-10-12', type: 'Check-up', notes: 'Routine health check, all good.' },
    ],
    milkRecords: [
      { id: 'M3', date: '2023-11-20', yield: 10, time: 'Morning' },
    ],
    breedingRecords: [],
  },
];
