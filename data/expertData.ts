
export interface Expert {
  id: string;
  name: string;
  specialty: 'Agronomy' | 'Horticulture' | 'Soil Science' | 'Pest Management';
  experience: number; // in years
  city: string;
  rating: number;
  phone: string;
  email: string;
  image: string;
  languages: string[];
  onlineStatus: 'Online' | 'Offline' | 'Busy';
  videoCallAvailable: boolean;
  bio: string;
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
    email: 'dr.ramesh.gupta@example.com',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/expert_male_1.jpg',
    languages: ['Kannada', 'Hindi', 'English'],
    onlineStatus: 'Online',
    videoCallAvailable: true,
    bio: 'Expert in soil rehabilitation and organic composting techniques. PhD from UAS Dharwad.'
  },
  {
    id: 'E2',
    name: 'Sunita Sharma',
    specialty: 'Horticulture',
    experience: 15,
    city: 'Davanagere',
    rating: 4.8,
    phone: '923-456-7891',
    email: 'sunita.sharma@example.com',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/expert_female_1.jpg',
    languages: ['Kannada', 'English'],
    onlineStatus: 'Busy',
    videoCallAvailable: true,
    bio: 'Specializes in fruit orchard management and post-harvest technology.'
  },
  {
    id: 'E3',
    name: 'Anil Kumar',
    specialty: 'Pest Management',
    experience: 20,
    city: 'Belagavi',
    rating: 4.9,
    phone: '934-567-8902',
    email: 'anil.kumar@example.com',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/expert_male_2.jpg',
    languages: ['Marathi', 'Kannada', 'Hindi'],
    onlineStatus: 'Online',
    videoCallAvailable: false,
    bio: 'Integrated Pest Management (IPM) consultant for sugarcane and cotton.'
  },
  {
    id: 'E4',
    name: 'Dr. Meena Iyer',
    specialty: 'Agronomy',
    experience: 18,
    city: 'Mysuru',
    rating: 4.7,
    phone: '945-678-9013',
    email: 'dr.meena.iyer@example.com',
    image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/expert_female_2.jpg',
    languages: ['Kannada', 'Tamil', 'English'],
    onlineStatus: 'Offline',
    videoCallAvailable: true,
    bio: 'Focuses on sustainable farming systems and crop rotation strategies.'
  },
];
