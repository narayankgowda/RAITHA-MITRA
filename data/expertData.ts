export interface Expert {
  id: string;
  name: string;
  specialty: 'Agronomy' | 'Horticulture' | 'Soil Science' | 'Pest Management';
  experience: number; // in years
  city: string;
  rating: number;
  phone: string;
  image: string;
}

export const expertData: Expert[] = [
  {
    id: 'E1',
    name: 'Dr. Ramesh Gupta',
    specialty: 'Soil Science',
    experience: 25,
    city: 'Hubli',
    rating: 4.9,
    phone: '912-345-6780',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/expert_male_1.jpg',
  },
  {
    id: 'E2',
    name: 'Sunita Sharma',
    specialty: 'Horticulture',
    experience: 15,
    city: 'Davanagere',
    rating: 4.8,
    phone: '923-456-7891',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/expert_female_1.jpg',
  },
  {
    id: 'E3',
    name: 'Anil Kumar',
    specialty: 'Pest Management',
    experience: 20,
    city: 'Belagavi',
    rating: 4.9,
    phone: '934-567-8902',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/expert_male_2.jpg',
  },
  {
    id: 'E4',
    name: 'Dr. Meena Iyer',
    specialty: 'Agronomy',
    experience: 18,
    city: 'Mysuru',
    rating: 4.7,
    phone: '945-678-9013',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/expert_female_2.jpg',
  },
];