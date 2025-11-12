import { Coordinates } from '../utils/locationUtils';

export interface Vet {
  id: string;
  name: string;
  specialty: string;
  location: Coordinates;
  city: string;
  rating: number;
  phone: string;
  image: string;
}

export const vetData: Vet[] = [
  {
    id: 'V1',
    name: 'Dr. Anjali Sharma',
    specialty: 'Large Animal Medicine',
    location: { latitude: 15.37, longitude: 75.13 },
    city: 'Hubli',
    rating: 4.8,
    phone: '987-654-3210',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/vet_female_1.jpg',
  },
  {
    id: 'V2',
    name: 'Dr. Rohan Patel',
    specialty: 'Livestock Surgery',
    location: { latitude: 15.85, longitude: 74.50 },
    city: 'Belagavi',
    rating: 4.9,
    phone: '876-543-2109',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/vet_male_1.jpg',
  },
  {
    id: 'V3',
    name: 'Dr. Priya Kumar',
    specialty: 'Poultry Health',
    location: { latitude: 14.47, longitude: 75.93 },
    city: 'Davanagere',
    rating: 4.7,
    phone: '765-432-1098',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/vet_female_2.jpg',
  },
  {
    id: 'V4',
    name: 'Dr. Sameer Singh',
    specialty: 'General Veterinary Practice',
    location: { latitude: 12.32, longitude: 76.63 },
    city: 'Mysuru',
    rating: 4.6,
    phone: '654-321-0987',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/vet_male_2.jpg',
  },
];
