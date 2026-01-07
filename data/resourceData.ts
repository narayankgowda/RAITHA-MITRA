
export type ResourceType = 'machinery' | 'labor' | 'logistics' | 'storage' | 'water';

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  category: string;
  price: number;
  unit: string;
  location: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviews: number;
  availability: 'Available' | 'Busy' | 'Maintenance';
  nextAvailable: string; // Date or "Now"
  imageUrl: string;
  description: string;
  ownerName: string;
  contact: string;
  trustIndex: number; // 0-100
  isVerified: boolean;
  specs: { label: string; value: string }[];
  maintenanceLog?: string; // Last serviced date
}

export const initialResourceData: Resource[] = [
  {
    id: 'm-1',
    type: 'machinery',
    name: 'Mahindra Arjun 555 DI',
    category: 'Tractor',
    price: 850,
    unit: 'hr',
    location: 'Hassan Rural',
    latitude: 13.0100,
    longitude: 76.1100,
    rating: 4.8,
    reviews: 42,
    availability: 'Available',
    nextAvailable: 'Now',
    imageUrl: 'https://cdn.tractorsdekho.com/in/mahindra/arjun-555-di/mahindra-arjun-555-di-76959.jpg',
    description: 'Perfect for deep ploughing and hauling. Includes rotavator attachment.',
    ownerName: 'Gowda Equipment Rentals',
    contact: '9876543210',
    trustIndex: 95,
    isVerified: true,
    maintenanceLog: 'May 2024',
    specs: [
        { label: 'HP', value: '50' },
        { label: 'Condition', value: 'Like New' }
    ]
  },
  {
    id: 'l-1',
    type: 'labor',
    name: 'Shakti Sowing Group',
    category: 'Manual Labor',
    price: 450,
    unit: 'person/day',
    location: 'Hassan',
    latitude: 13.0072,
    longitude: 76.1032,
    rating: 4.9,
    reviews: 120,
    availability: 'Busy',
    nextAvailable: 'July 05',
    imageUrl: 'https://img.freepik.com/premium-photo/workers-work-field-harvesting-manual-labor-farming-agriculture-agro-industry_926199-2094884.jpg',
    description: 'Expert group of 15 specialized in rapid paddy transplanting.',
    ownerName: 'Manju (Lead)',
    contact: '9876543213',
    trustIndex: 98,
    isVerified: true,
    specs: [
        { label: 'Team Size', value: '15' },
        { label: 'Exp', value: '10+ Years' }
    ]
  },
  {
    id: 'tr-1',
    type: 'logistics',
    name: 'Tata Ace (Mandi Express)',
    category: 'Transport',
    price: 15,
    unit: 'km',
    location: 'Belur Road',
    latitude: 13.0500,
    longitude: 76.1500,
    rating: 4.7,
    reviews: 18,
    availability: 'Available',
    nextAvailable: 'Now',
    imageUrl: 'https://5.imimg.com/data5/PJ/ST/MY-59391862/tata-ace-commercial-vehicle.jpg',
    description: 'Empty truck heading to Yeshwanthpur Mandi tomorrow morning. 2 tons capacity remaining.',
    ownerName: 'Prakash Transporters',
    contact: '9876543214',
    trustIndex: 88,
    isVerified: true,
    specs: [
        { label: 'Route', value: 'Hassan -> Bengaluru' },
        { label: 'Payload', value: '1.2 Tons Left' }
    ]
  },
  {
    id: 'st-1',
    type: 'storage',
    name: 'Cold-Lock Warehouse',
    category: 'Storage',
    price: 2,
    unit: 'crate/day',
    location: 'Industrial Area',
    latitude: 12.9800,
    longitude: 76.1300,
    rating: 5.0,
    reviews: 12,
    availability: 'Available',
    nextAvailable: 'Now',
    imageUrl: 'https://mecaluxcom.cdnwm.com/documents/d/global/m41p03-almacenamiento-frio-estanterias?e=jpg&imwidth=1024&imdensity=1',
    description: 'Micro-cold storage for tomatoes and leafy greens. Humidity controlled.',
    ownerName: 'Kaveri Cold Chain',
    contact: '9876543215',
    trustIndex: 92,
    isVerified: true,
    specs: [
        { label: 'Temp', value: '4°C' },
        { label: 'Space', value: '50 Crates Left' }
    ]
  },
  {
    id: 'w-1',
    type: 'water',
    name: 'Private Tanker Service',
    category: 'Water',
    price: 1200,
    unit: '5000L Tanker',
    location: 'Sakleshpur',
    latitude: 12.8931,
    longitude: 75.7831,
    rating: 4.6,
    reviews: 25,
    availability: 'Available',
    nextAvailable: 'Now',
    imageUrl: 'https://content.jdmagicbox.com/comp/chandigarh/e1/0172px172.x172.211124124637.g3e1/catalogue/hunny-water-tanker-service-raipur-khurd-chandigarh-water-suppliers-svo0y0i75j.jpg',
    description: 'Potable and irrigation water delivery. Quick response.',
    ownerName: 'Malnad Waters',
    contact: '9876543216',
    trustIndex: 85,
    isVerified: false,
    specs: [
        { label: 'Capacity', value: '5000 Liters' },
        { label: 'Speed', value: 'under 2 hrs' }
    ]
  }
];
