export interface CropStage {
  name: string;
  duration: string;
  description: string;
  tasks: string[];
  imageUrl: string;
}

export interface Crop {
  id: string;
  name: string;
  family: string;
  idealClimate: string;
  imageUrl: string;
  description: string;
  stages: CropStage[];
}

export const cropCycleData: Crop[] = [
  {
    id: 'rice-paddy',
    name: 'Rice (Paddy)',
    family: 'Poaceae',
    idealClimate: 'Hot and humid, with ample rainfall.',
    imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/rice_paddy.jpg',
    description: 'A staple food for a large part of the world\'s human population, especially in Asia.',
    stages: [
      {
        name: 'Seedling Stage',
        duration: '25-30 days',
        description: 'Germination and early growth in a nursery.',
        tasks: ['Prepare nursery bed.', 'Sow pre-germinated seeds.', 'Maintain water level and protect from pests.'],
        imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/rice_seedling.jpg',
      },
      {
        name: 'Transplanting Stage',
        duration: '1 day',
        description: 'Moving seedlings from the nursery to the main field.',
        tasks: ['Prepare main field (puddling).', 'Uproot seedlings carefully.', 'Transplant seedlings at proper spacing.'],
        imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/rice_transplanting.jpg',
      },
      {
        name: 'Tillering Stage',
        duration: '30-40 days',
        description: 'The plant develops tillers or shoots from its base, which will bear grains.',
        tasks: ['Apply nitrogen fertilizer.', 'Maintain shallow water level.', 'Weed control is crucial.'],
        imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/rice_tillering.jpg',
      },
      {
        name: 'Panicle Initiation & Flowering',
        duration: '30-35 days',
        description: 'The panicle (flower cluster) begins to develop and emerges.',
        tasks: ['Apply potassium fertilizer.', 'Ensure adequate water to avoid stress.', 'Monitor for pests like stem borer.'],
        imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/rice_flowering.jpg',
      },
      {
        name: 'Ripening Stage',
        duration: '30 days',
        description: 'Grains fill, mature, and turn golden yellow.',
        tasks: ['Drain water from the field 10-15 days before harvest.', 'Protect from birds.', 'Monitor moisture content for ideal harvesting time.'],
        imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/rice_ripening.jpg',
      },
    ],
  },
  {
    id: 'tomato',
    name: 'Tomato',
    family: 'Solanaceae',
    idealClimate: 'Warm and sunny, sensitive to frost.',
    imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/tomato_plant.jpg',
    description: 'A versatile fruit, widely grown and consumed as a vegetable in various dishes.',
    stages: [
      {
        name: 'Germination & Seedling',
        duration: '25-35 days',
        description: 'Seeds sprout and develop into young seedlings, typically in a nursery.',
        tasks: ['Sow seeds in seedling trays with good potting mix.', 'Ensure adequate light and warmth.', 'Keep soil moist but not waterlogged.'],
        imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/tomato_seedling.jpg',
      },
      {
        name: 'Vegetative Growth',
        duration: '25-30 days',
        description: 'After transplanting, the plant focuses on growing leaves and stems.',
        tasks: ['Transplant to main field or larger pots.', 'Provide support (staking or caging).', 'Start a balanced fertilization program.'],
        imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/tomato_vegetative.jpg',
      },
      {
        name: 'Flowering Stage',
        duration: '10-15 days',
        description: 'The plant produces yellow flowers which will be pollinated to form fruit.',
        tasks: ['Ensure consistent watering.', 'Monitor for pests like aphids.', 'Gently shake plants to aid pollination (if indoors).'],
        imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/tomato_flowering.jpg',
      },
      {
        name: 'Fruiting Stage',
        duration: '20-30 days',
        description: 'Small green fruits appear and begin to grow in size.',
        tasks: ['Increase potassium in fertilizer.', 'Maintain consistent soil moisture to prevent blossom-end rot.', 'Prune suckers to direct energy to fruits.'],
        imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/tomato_fruiting.jpg',
      },
      {
        name: 'Harvesting Stage',
        duration: 'Ongoing',
        description: 'Fruits ripen to their final color and are ready to be picked.',
        tasks: ['Harvest fruits when they are fully colored and firm.', 'Regular harvesting encourages more fruit production.', 'Check for signs of disease on ripening fruit.'],
        imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/tomato_harvesting.jpg',
      },
    ],
  },
];
