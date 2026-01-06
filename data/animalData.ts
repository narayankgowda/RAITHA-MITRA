
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

export interface WeightRecord {
    id: string;
    date: string;
    weight: number; // kg
}

export interface Animal {
  id: string;
  tagId: string;
  name: string;
  species: 'Cow' | 'Buffalo' | 'Goat' | 'Sheep' | 'Poultry' | 'Ox' | 'Pig' | 'Duck' | 'Rabbit';
  breed: string;
  birthDate: string;
  gender: 'Male' | 'Female';
  status: 'Active' | 'Sold' | 'Deceased' | 'Quarantine' | 'Sick';
  milkingStatus: 'Lactating' | 'Dry' | 'Heifer' | 'N/A';
  feedType: 'Grazing' | 'Silage' | 'Concentrate' | 'Mixed' | 'Greens';
  imageUrl: string;
  genetics: {
      sire: string; // Father
      dam: string; // Mother
  };
  weightHistory: WeightRecord[];
  healthRecords: HealthRecord[];
  milkRecords: MilkRecord[];
  breedingRecords: BreedingRecord[];
}

export const initialAnimalData: Animal[] = [
  {
    id: 'A101',
    tagId: 'YG-AD-025',
    name: 'LIKI',
    species: 'Cow',
    breed: 'Holstein Friesian',
    birthDate: '2020-05-15',
    gender: 'Female',
    status: 'Active',
    milkingStatus: 'Lactating',
    feedType: 'Mixed',
    imageUrl: 'https://cdn.britannica.com/53/157153-050-E5582B5A/Holstein-cow.jpg',
    genetics: { sire: 'HF-Bull-Alpha', dam: 'Gowri (A099)' },
    weightHistory: [
        { id: 'w1', date: '2023-01-01', weight: 450 },
        { id: 'w2', date: '2023-06-01', weight: 480 },
        { id: 'w3', date: '2024-01-01', weight: 510 }
    ],
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
    tagId: 'YG-22-037',
    name: 'RA-GU',
    species: 'Cow',
    breed: 'Gir',
    birthDate: '2019-02-20',
    gender: 'Female',
    status: 'Active',
    milkingStatus: 'Dry',
    feedType: 'Grazing',
    imageUrl: 'https://girorganic.com/cdn/shop/articles/what-is-gir-cow-453725.jpg?v=1673547600',
    genetics: { sire: 'Gir-Raja', dam: 'Kaveri' },
    weightHistory: [
        { id: 'w1', date: '2023-01-01', weight: 400 },
        { id: 'w2', date: '2024-01-01', weight: 420 }
    ],
    healthRecords: [
      { id: 'H3', date: '2023-10-12', type: 'Check-up', notes: 'Routine health check, all good.' },
    ],
    milkRecords: [
      { id: 'M3', date: '2023-11-20', yield: 10, time: 'Morning' },
    ],
    breedingRecords: [],
  },
  {
    id: 'A103',
    tagId: 'YG-AD-XXX',
    name: 'NANU',
    species: 'Buffalo',
    breed: 'Murrah',
    birthDate: '2018-08-20',
    gender: 'Female',
    status: 'Active',
    milkingStatus: 'Lactating',
    feedType: 'Concentrate',
    imageUrl: 'https://www.shutterstock.com/image-photo/mediterranean-water-buffalo-eating-bubalus-600nw-2552305077.jpg',
    genetics: { sire: 'Unknown', dam: 'Unknown' },
    weightHistory: [],
    healthRecords: [
        { id: 'H4', date: '2023-09-15', type: 'Vaccination', notes: 'HS-BQ Vaccine administered.'}
    ],
    milkRecords: [
      { id: 'M4', date: '2023-11-21', yield: 8, time: 'Morning' },
      { id: 'M5', date: '2023-11-21', yield: 7, time: 'Evening' },
    ],
    breedingRecords: [],
  },
  {
    id: 'A104',
    tagId: 'YG-AD-015',
    name: 'ಚಿ-RU',
    species: 'Goat',
    breed: 'Boer',
    birthDate: '2021-03-10',
    gender: 'Male',
    status: 'Active',
    milkingStatus: 'N/A',
    feedType: 'Grazing',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZVGHU5seYphKteXMbvgvD2IYX84EbMzAbfw&s',
    genetics: { sire: 'Boer-Max', dam: 'Rani' },
    weightHistory: [
        { id: 'w1', date: '2021-09-01', weight: 15 },
        { id: 'w2', date: '2022-03-01', weight: 35 },
        { id: 'w3', date: '2023-03-01', weight: 65 }
    ],
    healthRecords: [
        { id: 'H5', date: '2023-07-20', type: 'Vaccination', notes: 'PPR Vaccine given.'}
    ],
    milkRecords: [],
    breedingRecords: [],
  },
  {
    id: 'A105',
    tagId: 'YG-AD-033',
    name: 'PAMI',
    species: 'Sheep',
    breed: 'Bannur',
    birthDate: '2022-01-05',
    gender: 'Female',
    status: 'Active',
    milkingStatus: 'N/A',
    feedType: 'Grazing',
    imageUrl: 'https://zravi.com/images/cust_img/prS2024101052_WhatsApp%20Image%202024-10-17%20at%201.16.44%20PM.jpeg',
    genetics: { sire: 'Unknown', dam: 'Unknown' },
    weightHistory: [],
    healthRecords: [],
    milkRecords: [],
    breedingRecords: [
        { id: 'B2', date: '2023-08-10', type: 'Heat Cycle', notes: 'Observed heat cycle.'}
    ],
  },
  {
    id: 'A106',
    tagId: 'YG-AD-028',
    name: 'ME-2-N',
    species: 'Ox',
    breed: 'Hallikar',
    birthDate: '2019-11-25',
    gender: 'Male',
    status: 'Active',
    milkingStatus: 'N/A',
    feedType: 'Mixed',
    imageUrl: 'https://images.unsplash.com/photo-1532785278647-e095d4f78ae2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2lsZCUyMG94fGVufDB8fDB8fHww',
    genetics: { sire: 'Hallikar-King', dam: 'Devi' },
    weightHistory: [],
    healthRecords: [
        { id: 'H6', date: '2023-11-01', type: 'Check-up', notes: 'Hoof trimming completed.'}
    ],
    milkRecords: [],
    breedingRecords: [],
  },
  {
    id: 'A107',
    tagId: 'YG-AD-26',
    name: 'KOLI MANJA',
    species: 'Poultry',
    breed: 'chapati',
    birthDate: '2023-05-10',
    gender: 'Female',
    status: 'Active',
    milkingStatus: 'N/A',
    feedType: 'Concentrate',
    imageUrl: 'https://royalfarms.co.in/wp-content/uploads/2025/07/Poultry-Farming.webp',
    genetics: { sire: 'Unknown', dam: 'Unknown' },
    weightHistory: [
        { id: 'w1', date: '2023-06-10', weight: 0.5 },
        { id: 'w2', date: '2023-11-10', weight: 1.5 }
    ],
    healthRecords: [],
    milkRecords: [],
    breedingRecords: [],
  },
  {
    id: 'A108',
    tagId: 'YG-AD-27',
    name: 'M-NO-J',
    species: 'Pig',
    breed: 'Yorkshire',
    birthDate: '2023-02-15',
    gender: 'Male',
    status: 'Active',
    milkingStatus: 'N/A',
    feedType: 'Mixed',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfltvUz0KJV1AtQlsqZQojwt440Mg7kSrEjA&s',
    genetics: { sire: 'Big-Ben', dam: 'Peppa' },
    weightHistory: [
        { id: 'w1', date: '2023-03-15', weight: 10 },
        { id: 'w2', date: '2023-09-15', weight: 80 }
    ],
    healthRecords: [
        { id: 'H7', date: '2023-03-20', type: 'Vaccination', notes: 'Swine Fever Vaccine'}
    ],
    milkRecords: [],
    breedingRecords: [],
  },
  {
    id: 'A109',
    tagId: 'YG-AD-016',
    name: 'ಧಾ-NU',
    species: 'Rabbit',
    breed: 'New Zealand White',
    birthDate: '2023-08-01',
    gender: 'Female',
    status: 'Active',
    milkingStatus: 'N/A',
    feedType: 'Greens',
    imageUrl: 'https://www.humaneworld.org/sites/default/files/styles/responsive_1_1_500w/public/2019/03/rabbit-475261_0.jpg?h=c855054e&itok=eOJCNtca',
    genetics: { sire: 'Unknown', dam: 'Unknown' },
    weightHistory: [],
    healthRecords: [],
    milkRecords: [],
    breedingRecords: [],
  },
  {
    id: 'A110',
    tagId: 'YG-AD-007',
    name: 'BU-1',
    species: 'Duck',
    breed: 'Khaki Campbell',
    birthDate: '2023-04-12',
    gender: 'Female',
    status: 'Active',
    milkingStatus: 'N/A',
    feedType: 'Mixed',
    imageUrl: 'https://static.toiimg.com/thumb/msid-124893060,width-1280,height-720,resizemode-4/124893060.jpg',
    genetics: { sire: 'Unknown', dam: 'Unknown' },
    weightHistory: [],
    healthRecords: [],
    milkRecords: [],
    breedingRecords: [],
  }
];
