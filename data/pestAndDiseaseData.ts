export interface PestOrDisease {
  id: string;
  name: string;
  type: 'Pest' | 'Disease';
  description: string;
  cropsAffected: string[];
}

export const commonPestsAndDiseases: PestOrDisease[] = [
  {
    id: 'p1',
    name: 'Aphids',
    type: 'Pest',
    description: 'Small, sap-sucking insects that gather on new growth, causing leaves to yellow and curl. They excrete a sticky substance called honeydew, which can lead to sooty mold.',
    cropsAffected: ['Tomato', 'Cotton', 'Leafy Greens', 'Various Vegetables'],
  },
  {
    id: 'd1',
    name: 'Powdery Mildew',
    type: 'Disease',
    description: 'A fungal disease that appears as white, powdery spots on leaves and stems. It thrives in high humidity and moderate temperatures, hindering photosynthesis.',
    cropsAffected: ['Grapes', 'Cucurbits', 'Legumes', 'Roses'],
  },
  {
    id: 'p2',
    name: 'Spider Mites',
    type: 'Pest',
    description: 'Tiny arachnids that are hard to see with the naked eye. They cause fine stippling on leaves and can create fine webs. They thrive in hot, dry conditions.',
    cropsAffected: ['Tomato', 'Beans', 'Corn', 'Ornamentals'],
  },
  {
    id: 'd2',
    name: 'Bacterial Leaf Blight',
    type: 'Disease',
    description: 'Caused by bacteria, this disease results in large, water-soaked lesions on leaves, which often turn yellow or brown. It is common in rice and can significantly reduce yield.',
    cropsAffected: ['Rice', 'Wheat', 'Barley'],
  },
  {
    id: 'p3',
    name: 'Whiteflies',
    type: 'Pest',
    description: 'Small, winged insects that feed on the underside of leaves. They suck plant juices, causing yellowing and leaf drop. Like aphids, they can transmit plant viruses.',
    cropsAffected: ['Cotton', 'Tomato', 'Cabbage', 'Sweet Potato'],
  },
  {
    id: 'd3',
    name: 'Late Blight',
    type: 'Disease',
    description: 'A destructive fungal disease affecting potatoes and tomatoes. It appears as pale green, water-soaked spots that quickly enlarge and turn dark brown or black.',
    cropsAffected: ['Potato', 'Tomato'],
  },
  {
    id: 'd4',
    name: 'Rust',
    type: 'Disease',
    description: 'A fungal disease characterized by reddish-brown pustules on leaves and stems, resembling rust. It weakens the plant by interfering with photosynthesis.',
    cropsAffected: ['Wheat', 'Corn', 'Beans', 'Sugarcane'],
  },
];
