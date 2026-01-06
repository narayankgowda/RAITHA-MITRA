
import { Coordinates } from '../utils/locationUtils';

export interface Vet {
  id: string;
  name: string;
  Designation: string;
  location: Coordinates;
  city: string;
  rating: number;
  phone: string;
  email: string;
  image: string;
  experience: number; // Years of experience
  clinicAddress: string;
  consultationFee: number; // Fee in Rupees
  availability: 'Available' | 'Busy' | 'Closed';
  languages: string[];
}

export const vetData: Vet[] = [
  {
    id: 'V1',
    name: 'Dr. Madu B P',
    Designation: 'Veterinary Officer',
    location: { latitude: 14.4194, longitude: 77.1954 },
    city: 'Hubli',
    rating: 4.8,
    phone: '9741830840',
    email: 'dr.madu.bp@example.com',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/vet_female_1.jpg',
    experience: 12,
    clinicAddress: '4th Cross, Vidyanagar, Hubli',
    consultationFee: 300,
    availability: 'Available',
    languages: ['Kannada', 'English']
  },
  {
    id: 'V2',
    name: 'Dr. Bhanuprakash',
    Designation: 'Veterinary Surgeon',
    location: { latitude: 15.85, longitude: 74.50 },
    city: 'Belagavi',
    rating: 4.9,
    phone: '9761966657',
    email: 'dr.bhanuprakash@example.com',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/vet_male_1.jpg',
    experience: 15,
    clinicAddress: 'Main Road, Tilakwadi, Belagavi',
    consultationFee: 500,
    availability: 'Busy',
    languages: ['Kannada', 'Hindi', 'English']
  },
  {
    id: 'V3',
    name: 'Dr. Priya Kumar',
    Designation: 'Poultry Health Specialist',
    location: { latitude: 14.47, longitude: 75.93 },
    city: 'Davanagere',
    rating: 4.7,
    phone: '765-432-1098',
    email: 'dr.priya.kumar@example.com',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/vet_female_2.jpg',
    experience: 8,
    clinicAddress: 'Opp. City Hospital, Davanagere',
    consultationFee: 250,
    availability: 'Available',
    languages: ['Kannada', 'English']
  },
  {
    id: 'V4',
    name: 'Dr. Sameer Singh',
    Designation: 'General Veterinary Practice',
    location: { latitude: 12.32, longitude: 76.63 },
    city: 'Mysuru',
    rating: 4.6,
    phone: '654-321-0987',
    email: 'dr.sameer.singh@example.com',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/vet_male_2.jpg',
    experience: 10,
    clinicAddress: 'Vijayanagar 2nd Stage, Mysuru',
    consultationFee: 350,
    availability: 'Available',
    languages: ['Kannada', 'English', 'Hindi']
  },
  {
    id: 'V5',
    name: 'Dr. Aarav Reddy',
    Designation: 'Reproductive Health',
    location: { latitude: 13.93, longitude: 75.57 },
    city: 'Shivamogga',
    rating: 4.8,
    phone: '543-210-9876',
    email: 'dr.aarav.reddy@example.com',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/vet_connect.jpg',
    experience: 18,
    clinicAddress: 'Near Bus Stand, Shivamogga',
    consultationFee: 600,
    availability: 'Closed',
    languages: ['Kannada', 'Telugu', 'English']
  },
];
