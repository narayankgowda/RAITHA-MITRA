
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
    imageUrl: 'https://spanishboosting.com/wp-content/uploads/2024/04/organic-rice.jpg',
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
        imageUrl: 'https://media.licdn.com/dms/image/v2/D5622AQEUu57w4zfvxA/feedshare-shrink_800/B56ZP7qiCLH0Ag-/0/1735094062802?e=2147483647&v=beta&t=SnFRvTbuxFjBDc_NMENt7O1Ld4InOCqWVFESJdEDkSc',
      },
      {
        name: 'Transplanting Stage',
        duration: '1 day',
        description: 'Moving seedlings from the nursery to the main field.',
        tasks: ['Prepare main field (puddling).', 'Uproot seedlings carefully.', 'Transplant seedlings at proper spacing.'],
        imageUrl: 'https://images.indianexpress.com/2025/06/paddy-farming.jpg',
      },
      {
        name: 'Tillering Stage',
        duration: '30-40 days',
        description: 'The plant develops tillers or shoots from its base.',
        tasks: ['Apply nitrogen fertilizer.', 'Maintain shallow water level.', 'Weed control is crucial.'],
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdLHC6mFMsI5D-Uh_hmufnKq2p8wmtm1-nQg&s',
      },
      {
        name: 'Panicle Initiation',
        duration: '30-35 days',
        description: 'The panicle (flower cluster) begins to develop.',
        tasks: ['Apply potassium fertilizer.', 'Ensure adequate water to avoid stress.', 'Monitor for pests like stem borer.'],
        imageUrl: 'https://media.istockphoto.com/id/181391452/photo/close-up-of-rice-seed-panicles-in-the-paddy.jpg?s=612x612&w=0&k=20&c=DPOeeSYYHdXdF2n_Jz6mEGoDe1RKhZMPO1CeKLPw9K8=',
      },
      {
        name: 'Ripening Stage',
        duration: '30 days',
        description: 'Grains fill, mature, and turn golden yellow.',
        tasks: ['Drain water from the field 10-15 days before harvest.', 'Protect from birds.', 'Monitor moisture content.'],
        imageUrl: 'https://t4.ftcdn.net/jpg/01/22/07/21/360_F_122072124_L7XzB6QeS1S5V8i4iI3vB9F0W7uL4y8P.jpg',
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
    imageUrl: 'https://fieldreport.caes.uga.edu/wp-content/uploads/2021/08/B1271-900x600-1.jpg',
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
        imageUrl: 'https://media.gettyimages.com/id/1141315570/photo/tomato-seedlings-in-peat-pots.jpg?s=612x612&w=gi&k=20&c=6y9z3o3o3o3o3o3o3o3o3o3o3o3o3o3o3o3o3o3o3o3o=',
      },
      {
        name: 'Vegetative Growth',
        duration: '25-30 days',
        description: 'Plant focuses on growing leaves and stems.',
        tasks: ['Transplant to larger pots.', 'Provide staking support.', 'Balanced fertilization.'],
        imageUrl: 'https://i.ytimg.com/vi/W_68R_0-3Gk/maxresdefault.jpg',
      },
      {
        name: 'Flowering Stage',
        duration: '10-15 days',
        description: 'Plant produces yellow flowers.',
        tasks: ['Consistent watering.', 'Monitor for aphids.', 'Gentle shaking for pollination.'],
        imageUrl: 'https://live.staticflickr.com/3482/3820465225_60c6d7d5f0_b.jpg',
      },
      {
        name: 'Fruiting Stage',
        duration: '20-30 days',
        description: 'Small green fruits appear and grow.',
        tasks: ['Increase potassium.', 'Maintain soil moisture.', 'Prune suckers.'],
        imageUrl: 'https://images.squarespace-cdn.com/content/v1/56c75df2746fb966e30b6e14/1564070624021-I5Q5H5Q5H5Q5H5Q5H5Q5/tomato+green+fruit.jpg',
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
    imageUrl: 'https://images.unsplash.com/photo-1594900572d53-930cfc8ca21a?q=80&w=1000&auto=format&fit=crop',
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
        { name: 'Germination', duration: '5-10 days', description: 'Sprouting of the cotton seeds.', tasks: ['Ensure soil moisture.', 'Check for early soil pests.'], imageUrl: 'https://extension.msstate.edu/sites/default/files/newsletters/cotton-extra/2016/ce20160517_fig1.jpg' },
        { name: 'Vegetative', duration: '40-50 days', description: 'Rapid leaf and stem growth.', tasks: ['Weeding.', 'Apply urea.', 'Monitor bollworm.'], imageUrl: 'https://cottoncultivation.com/wp-content/uploads/2018/11/cotton-plant-stages.jpg' },
        { name: 'Squaring', duration: '30 days', description: 'Development of flower buds (squares).', tasks: ['Pest check.', 'Micronutrient spray.'], imageUrl: 'https://extension.msstate.edu/sites/default/files/newsletters/cotton-extra/2018/ce20180626_fig1.jpg' },
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
    imageUrl: 'https://images.unsplash.com/photo-1501430654243-c93f7111c8dc?q=80&w=1000&auto=format&fit=crop',
    description: 'A cereal grain that is a worldwide staple food.',
    varieties: ['Sharbati', 'Durum', 'Kalyansona'],
    expectedYield: 25.0,
    marketValue: 550000,
    sensorHistory: [
        { timestamp: '08:00', moisture: 58, temp: 18, humidity: 40, nitrogen: 55 },
        { timestamp: '12:00', moisture: 56, temp: 24, humidity: 35, nitrogen: 55 },
    ],
    stages: [
        { name: 'Sowing', duration: '1-7 days', description: 'Seeding into moist soil.', tasks: ['Prepare seedbed.', 'Sowing at correct depth.'], imageUrl: 'https://img.etimg.com/thumb/msid-71822765,width-1200,height-900,resizemode-4,imgsize-643034/wheat-sowing.jpg' },
        { name: 'Crown Root Initiation', duration: '20-25 days', description: 'Primary root system develops.', tasks: ['First irrigation.', 'Apply Nitrogen top-dress.'], imageUrl: 'https://wheatdoctor.org/images/growth-stages/CRI.jpg' },
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
    imageUrl: 'https://images.unsplash.com/photo-1594142460655-081016892f39?q=80&w=1000&auto=format&fit=crop',
    description: 'A tall perennial grass used for sugar production.',
    varieties: ['CO-86032', 'CO-0238'],
    expectedYield: 960,
    marketValue: 2880000,
    sensorHistory: [
        { timestamp: '08:00', moisture: 88, temp: 26, humidity: 75, nitrogen: 60 },
    ],
    stages: [
        { name: 'Germination', duration: '30-45 days', description: 'Eyes on the setts begin to sprout.', tasks: ['Light irrigation.', 'Gap filling.'], imageUrl: 'https://sugarcane-crops.com/wp-content/uploads/2019/12/germination.jpg' },
        { name: 'Tillering', duration: '60-120 days', description: 'Production of several shoots.', tasks: ['Interculturing.', 'Earthing up.'], imageUrl: 'https://3.bp.blogspot.com/-W1W0i9yqYxk/WJ0_9uB-tHI/AAAAAAAAA_0/7y9J7r-4e28-W1W0i9yqYxk-L-E-A-K/s1600/Tillering.jpg' },
        { name: 'Grand Growth', duration: '150-180 days', description: 'Rapid stalk elongation.', tasks: ['Heavy irrigation.', 'Propping to prevent lodging.'], imageUrl: 'https://www.agrifarming.in/wp-content/uploads/Sugarcane-Plant-Growth.jpg' },
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
    imageUrl: 'https://images.unsplash.com/photo-1551740284-9549f056461c?q=80&w=1000&auto=format&fit=crop',
    description: 'One of the most widely grown cereal crops globally.',
    varieties: ['Pioneer Hybrid', 'Dekkab'],
    expectedYield: 18.0,
    marketValue: 360000,
    sensorHistory: [
        { timestamp: '08:00', moisture: 72, temp: 27, humidity: 60, nitrogen: 48 },
    ],
    stages: [
        { name: 'Seeding', duration: '5-10 days', description: 'Planting seeds in rows.', tasks: ['Check seed spacing.', 'Pre-emergence herbicide.'], imageUrl: 'https://media.istockphoto.com/id/1141444390/photo/farmer-hand-planting-corn-seed-in-the-garden-with-sunlight.jpg?s=612x612&w=0&k=20&c=L_Y6-vV-8Zz8v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v_v=' },
        { name: 'Vegetative (V3-V6)', duration: '20-30 days', description: 'Leaves start emerging rapidly.', tasks: ['Side-dress Nitrogen.', 'Control Fall Armyworm.'], imageUrl: 'https://www.agrifarming.in/wp-content/uploads/Maize-Growth-Stages.jpg' },
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
    imageUrl: 'https://images.unsplash.com/photo-1599423300746-b62533397364?q=80&w=1000&auto=format&fit=crop',
    description: 'A nitrogen-fixing legume, high in protein.',
    varieties: ['JS-335', 'JS-9560'],
    expectedYield: 9.0,
    marketValue: 450000,
    sensorHistory: [
        { timestamp: '08:00', moisture: 68, temp: 25, humidity: 70, nitrogen: 35 },
    ],
    stages: [
        { name: 'Germination', duration: '7-12 days', description: 'Hypocotyl emerges from soil.', tasks: ['Monitor seedling rot.', 'Ensure no soil crusting.'], imageUrl: 'https://coolbean.info/wp-content/uploads/sites/3/2016/05/Soybean-emergence.jpg' },
        { name: 'Leaf Development', duration: '25 days', description: 'Unifoliate and trifoliate leaves appear.', tasks: ['First weeding.', 'Rhizobium check.'], imageUrl: 'https://soybeanresearchinfo.com/wp-content/uploads/2019/04/Soybean_V1_stage.jpg' },
    ]
  }
];
