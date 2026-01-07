export interface CropStage {
  name: string;
  duration: string;
  description: string;
  tasks: string[];
  imageUrl: string;
}

export interface SensorReading {
  timestamp: string;
  moisture: number;
  temp: number;
  humidity: number;
  nitrogen: number;
}

export interface FieldAlert {
  id: string;
  type: 'Critical' | 'Warning' | 'Info';
  message: string;
  date: string;
}

export interface Crop {
  id: string;
  name: string;
  fieldName: string; 
  fieldArea: number; // Acres
  plantingDate: string;
  healthScore: number; // 0-100 (NDVI proxy)
  moistureLevel: number; // 0-100%
  pestRisk: 'Low' | 'Medium' | 'High';
  family: string;
  idealClimate: string;
  imageUrl: string;
  description: string;
  stages: CropStage[];
  currentStageIndex: number;
  varieties?: string[];
  coordinates?: { lat: number; lng: number };
  sensorHistory?: SensorReading[];
  alerts?: FieldAlert[];
  expectedYield?: number; // tonnes
  marketValue?: number; // Estimated revenue
}

export const cropCycleData: Crop[] = [
  {
    id: 'rice-paddy-01',
    name: 'Rice (Paddy)',
    fieldName: 'North Field A',
    fieldArea: 5.2,
    plantingDate: '2024-05-01',
    healthScore: 88,
    moistureLevel: 75,
    pestRisk: 'Low',
    currentStageIndex: 2,
    family: 'Poaceae',
    idealClimate: 'Hot and humid, with ample rainfall.',
    imageUrl: 'https://t3.ftcdn.net/jpg/03/65/99/00/360_F_365990041_16BnV2xDUbfd09Yl0wFP4Lg35bzaGtm8.jpg',
    description: 'A staple food for a large part of the world\'s human population.',
    varieties: ['Basmati', 'Sona Masuri', 'Jasmine', 'Arborio'],
    coordinates: { lat: 15.3647, lng: 75.1240 },
    expectedYield: 12.5,
    marketValue: 312500,
    alerts: [
        { id: 'a1', type: 'Info', message: 'Water levels optimal.', date: 'Today' }
    ],
    sensorHistory: [
        { timestamp: '08:00', moisture: 72, temp: 28, humidity: 65, nitrogen: 45 },
        { timestamp: '10:00', moisture: 70, temp: 30, humidity: 60, nitrogen: 44 },
        { timestamp: '12:00', moisture: 68, temp: 32, humidity: 55, nitrogen: 44 },
        { timestamp: '14:00', moisture: 65, temp: 33, humidity: 50, nitrogen: 43 },
    ],
    stages: [
      {
        name: 'Seedling Stage',
        duration: '25-30 days',
        description: 'Germination and early growth in a nursery.',
        tasks: ['Prepare nursery bed.', 'Sow pre-germinated seeds.', 'Maintain water level and protect from pests.'],
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmx-QxL24Q32bMV3B9s177BbRzD8Uu2g-4qg&s',
      },
      {
        name: 'Transplanting Stage',
        duration: '1 day',
        description: 'Moving seedlings from the nursery to the main field.',
        tasks: ['Prepare main field (puddling).', 'Uproot seedlings carefully.', 'Transplant seedlings at proper spacing.'],
        imageUrl: 'https://media.istockphoto.com/id/109724079/photo/rice-planting.jpg?s=612x612&w=0&k=20&c=e2_psJ9jL6PF558nQhupD2wp-gKB_MftUNardIzI63Q=',
      },
      {
        name: 'Tillering Stage',
        duration: '30-40 days',
        description: 'The plant develops tillers or shoots from its base.',
        tasks: ['Apply nitrogen fertilizer.', 'Maintain shallow water level.', 'Weed control is crucial.'],
        imageUrl: 'https://pbs.twimg.com/media/EeufrnYUMAETefa.jpg',
      },
      {
        name: 'Panicle Initiation',
        duration: '30-35 days',
        description: 'The panicle (flower cluster) begins to develop.',
        tasks: ['Apply potassium fertilizer.', 'Ensure adequate water to avoid stress.', 'Monitor for pests like stem borer.'],
        imageUrl: 'https://www.agrifarming.in/wp-content/uploads/Pest-Management-in-Paddy-at-Panicle-Initiation-Stage4.jpg',
      },
      {
        name: 'Ripening Stage',
        duration: '30 days',
        description: 'Grains fill, mature, and turn golden yellow.',
        tasks: ['Drain water from the field 10-15 days before harvest.', 'Protect from birds.', 'Monitor moisture content.'],
        imageUrl: 'https://eos.com/wp-content/uploads/2023/04/rice-field.jpg',
      },
    ],
  },
  {
    id: 'tomato-01',
    name: 'Tomato',
    fieldName: 'Greenhouse 1',
    fieldArea: 1.5,
    plantingDate: '2024-05-15',
    healthScore: 65,
    moistureLevel: 45,
    pestRisk: 'Medium',
    currentStageIndex: 2,
    family: 'Solanaceae',
    idealClimate: 'Warm and sunny, sensitive to frost.',
    imageUrl: 'https://www.syngentagroup.com/sites/default/files/shorthand/stories/bib28glDlz/2024-09-04T15%3A56%3A07.672Z/assets/CiXZY5wiLj/high-res-jpg-tomato-staked-harvest-time-4096x2960.jpg',
    description: 'A versatile fruit, widely grown and consumed as a vegetable in various dishes.',
    varieties: ['Roma', 'Cherry', 'Beefsteak', 'Heirloom'],
    coordinates: { lat: 15.3655, lng: 75.1250 },
    expectedYield: 2.8,
    marketValue: 84000,
    alerts: [
        { id: 'a2', type: 'Warning', message: 'Low moisture detected. Irrigation needed.', date: 'Today' },
        { id: 'a3', type: 'Info', message: 'Flowering stage initiated.', date: 'Yesterday' }
    ],
    sensorHistory: [
        { timestamp: '08:00', moisture: 48, temp: 29, humidity: 55, nitrogen: 38 },
        { timestamp: '10:00', moisture: 46, temp: 31, humidity: 50, nitrogen: 38 },
        { timestamp: '12:00', moisture: 44, temp: 34, humidity: 45, nitrogen: 37 },
        { timestamp: '14:00', moisture: 42, temp: 35, humidity: 40, nitrogen: 37 },
    ],
    stages: [
      {
        name: 'Germination & Seedling',
        duration: '25-35 days',
        description: 'Seeds sprout and develop into young seedlings.',
        tasks: ['Sow seeds in seedling trays.', 'Ensure adequate light and warmth.', 'Keep soil moist.'],
        imageUrl: 'https://growbags.in/wp-content/uploads/2023/03/Starting-seedlings-from-seeds.jpg',
      },
      {
        name: 'Vegetative Growth',
        duration: '25-30 days',
        description: 'Plant focuses on growing leaves and stems.',
        tasks: ['Transplant to larger pots.', 'Provide staking support.', 'Balanced fertilization.'],
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNwdOwtrlDhm4NL8ooEm59aTUaUEDpJSCMVw&s',
      },
      {
        name: 'Flowering Stage',
        duration: '10-15 days',
        description: 'Plant produces yellow flowers.',
        tasks: ['Consistent watering.', 'Monitor for aphids.', 'Gentle shaking for pollination.'],
        imageUrl: 'https://www.epicgardening.com/wp-content/uploads/2023/09/Flowering-Stage.jpg',
      },
      {
        name: 'Fruiting Stage',
        duration: '20-30 days',
        description: 'Small green fruits appear and grow.',
        tasks: ['Increase potassium.', 'Maintain soil moisture.', 'Prune suckers.'],
        imageUrl: 'https://media.istockphoto.com/id/1414407392/photo/tomato-farm.jpg?s=612x612&w=0&k=20&c=k6rcD3sqmiyzdz1Og6JmUvreTtU63AIv2Iqhy-hSCkg=',
      },
    ],
  },
  {
    id: 'cotton-01',
    name: 'Cotton',
    fieldName: 'South Field',
    fieldArea: 8.0,
    plantingDate: '2024-06-01',
    healthScore: 92,
    moistureLevel: 60,
    pestRisk: 'High',
    currentStageIndex: 1,
    family: 'Malvaceae',
    idealClimate: 'Hot and dry',
    imageUrl: 'https://www.just-style.com/wp-content/uploads/sites/27/2021/10/cotton-ga3c70f3bb_640.jpg',
    description: 'A soft, fluffy staple fiber that grows in a boll, or protective case.',
    varieties: ['Bt Cotton', 'Desi'],
    coordinates: { lat: 15.3635, lng: 75.1230 },
    expectedYield: 6.4,
    marketValue: 480000,
    alerts: [
        { id: 'a4', type: 'Critical', message: 'High pest activity detected (Bollworm risk).', date: 'Just now' }
    ],
    sensorHistory: [
        { timestamp: '08:00', moisture: 62, temp: 30, humidity: 45, nitrogen: 50 },
        { timestamp: '10:00', moisture: 61, temp: 32, humidity: 40, nitrogen: 50 },
        { timestamp: '12:00', moisture: 59, temp: 35, humidity: 35, nitrogen: 49 },
        { timestamp: '14:00', moisture: 58, temp: 36, humidity: 30, nitrogen: 49 },
    ],
    stages: [
        { name: 'Germination', duration: '5-10 days', description: 'Sprouting of the cotton seeds.', tasks: ['Ensure soil moisture.', 'Check for early soil pests.'], imageUrl: 'https://images.unsplash.com/photo-1594900572d53-930cfc8ca21a?q=80&w=600' },
        { name: 'Vegetative', duration: '40-50 days', description: 'Rapid leaf and stem growth.', tasks: ['Weeding.', 'Apply urea.', 'Monitor bollworm.'], imageUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=600' },
        { name: 'Squaring', duration: '30 days', description: 'Development of flower buds (squares).', tasks: ['Pest check.', 'Micronutrient spray.'], imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600' },
    ]
  },
  {
    id: 'wheat-01',
    name: 'Wheat',
    fieldName: 'East Ridge',
    fieldArea: 10.0,
    plantingDate: '2024-11-10',
    healthScore: 95,
    moistureLevel: 55,
    pestRisk: 'Low',
    currentStageIndex: 1,
    family: 'Poaceae',
    idealClimate: 'Cool winters and warm summers.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Vehn%C3%A4pelto_6.jpg/1200px-Vehn%C3%A4pelto_6.jpg',
    description: 'A cereal grain that is a worldwide staple food.',
    varieties: ['Sharbati', 'Durum', 'Kalyansona'],
    expectedYield: 25.0,
    marketValue: 550000,
    sensorHistory: [
        { timestamp: '08:00', moisture: 58, temp: 18, humidity: 40, nitrogen: 55 },
        { timestamp: '12:00', moisture: 56, temp: 24, humidity: 35, nitrogen: 55 },
    ],
    stages: [
        { name: 'Sowing', duration: '1-7 days', description: 'Seeding into moist soil.', tasks: ['Prepare seedbed.', 'Sowing at correct depth.'], imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=600' },
        { name: 'Crown Root Initiation', duration: '20-25 days', description: 'Primary root system develops.', tasks: ['First irrigation.', 'Apply Nitrogen top-dress.'], imageUrl: 'https://images.unsplash.com/photo-1501430654243-c93f7111c8dc?q=80&w=600' },
    ]
  },
  {
    id: 'sugarcane-01',
    name: 'Sugarcane',
    fieldName: 'River Valley',
    fieldArea: 12.0,
    plantingDate: '2024-01-20',
    healthScore: 82,
    moistureLevel: 85,
    pestRisk: 'Medium',
    currentStageIndex: 2,
    family: 'Poaceae',
    idealClimate: 'Tropical and subtropical climate.',
    imageUrl: 'https://eos.com/wp-content/uploads/2022/11/growing-sugar-cane.jpg.webp',
    description: 'A tall perennial grass used for sugar production.',
    varieties: ['CO-86032', 'CO-0238'],
    expectedYield: 960,
    marketValue: 2880000,
    sensorHistory: [
        { timestamp: '08:00', moisture: 88, temp: 26, humidity: 75, nitrogen: 60 },
    ],
    stages: [
        { name: 'Germination', duration: '30-45 days', description: 'Eyes on the setts begin to sprout.', tasks: ['Light irrigation.', 'Gap filling.'], imageUrl: 'https://images.unsplash.com/photo-1594142460655-081016892f39?q=80&w=600' },
        { name: 'Tillering', duration: '60-120 days', description: 'Production of several shoots.', tasks: ['Interculturing.', 'Earthing up.'], imageUrl: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=600' },
        { name: 'Grand Growth', duration: '150-180 days', description: 'Rapid stalk elongation.', tasks: ['Heavy irrigation.', 'Propping to prevent lodging.'], imageUrl: 'https://images.unsplash.com/photo-1594142460655-081016892f39?q=80&w=600' },
    ]
  },
  {
    id: 'maize-01',
    name: 'Maize (Corn)',
    fieldName: 'Plateau Section',
    fieldArea: 4.5,
    plantingDate: '2024-06-15',
    healthScore: 90,
    moistureLevel: 70,
    pestRisk: 'Low',
    currentStageIndex: 1,
    family: 'Poaceae',
    idealClimate: 'Warm weather with moderate rainfall.',
    imageUrl: 'https://webberchivell.com.au/wp-content/uploads/2024/04/20240208_025421977_iOS-scaled.jpg',
    description: 'One of the most widely grown cereal crops globally.',
    varieties: ['Pioneer Hybrid', 'Dekkab'],
    expectedYield: 18.0,
    marketValue: 360000,
    sensorHistory: [
        { timestamp: '08:00', moisture: 72, temp: 27, humidity: 60, nitrogen: 48 },
    ],
    stages: [
        { name: 'Seeding', duration: '5-10 days', description: 'Planting seeds in rows.', tasks: ['Check seed spacing.', 'Pre-emergence herbicide.'], imageUrl: 'https://images.unsplash.com/photo-1551740284-9549f056461c?q=80&w=600' },
        { name: 'Vegetative (V3-V6)', duration: '20-30 days', description: 'Leaves start emerging rapidly.', tasks: ['Side-dress Nitrogen.', 'Control Fall Armyworm.'], imageUrl: 'https://images.unsplash.com/photo-1551740284-9549f056461c?q=80&w=600' },
    ]
  },
  {
    id: 'soybean-01',
    name: 'Soybean',
    fieldName: 'West Field B',
    fieldArea: 6.0,
    plantingDate: '2024-06-20',
    healthScore: 85,
    moistureLevel: 65,
    pestRisk: 'Medium',
    currentStageIndex: 1,
    family: 'Fabaceae',
    idealClimate: 'Warm and moist environment.',
    imageUrl: 'https://cdn.britannica.com/30/174830-050-779DE460/Field-soybeans-farm-Oklahoma.jpg',
    description: 'A nitrogen-fixing legume, high in protein.',
    varieties: ['JS-335', 'JS-9560'],
    expectedYield: 9.0,
    marketValue: 450000,
    sensorHistory: [
        { timestamp: '08:00', moisture: 68, temp: 25, humidity: 70, nitrogen: 35 },
    ],
    stages: [
        { name: 'Germination', duration: '7-12 days', description: 'Hypocotyl emerges from soil.', tasks: ['Monitor seedling rot.', 'Ensure no soil crusting.'], imageUrl: 'https://images.unsplash.com/photo-1599423300746-b62533397364?q=80&w=600' },
        { name: 'Leaf Development', duration: '25 days', description: 'Unifoliate and trifoliate leaves appear.', tasks: ['First weeding.', 'Rhizobium check.'], imageUrl: 'https://images.unsplash.com/photo-1599423300746-b62533397364?q=80&w=600' },
    ]
  }
];