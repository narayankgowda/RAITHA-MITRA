export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    category: 'Seeds' | 'Fertilizers' | 'Tools' | 'Vegetables' | 'Fruits' | 'Grains';
    type: 'input' | 'produce';
    rating: number;
    reviews: number;
    description: string;
}

export const products: Product[] = [
    // Agri-Inputs
    {
        id: 1,
        name: 'High-Yield Maize Seeds',
        price: 250,
        image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/maize_seeds.jpg',
        category: 'Seeds',
        type: 'input',
        rating: 4.5,
        reviews: 120,
        description: 'Premium quality hybrid maize seeds for higher yield and disease resistance. Suitable for all climates.'
    },
    {
        id: 2,
        name: 'Organic NPK Fertilizer',
        price: 800,
        image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/npk_fertilizer.jpg',
        category: 'Fertilizers',
        type: 'input',
        rating: 4.8,
        reviews: 250,
        description: 'Enriched with Nitrogen, Phosphorus, and Potassium. 100% organic and boosts soil fertility.'
    },
    {
        id: 3,
        name: 'Heavy-Duty Garden Hoe',
        price: 550,
        image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/garden_hoe.jpg',
        category: 'Tools',
        type: 'input',
        rating: 4.6,
        reviews: 88,
        description: 'Durable and ergonomic garden hoe for weeding and soil preparation. Made with high-carbon steel.'
    },
    {
        id: 4,
        name: 'Tomato Hybrid Seeds',
        price: 150,
        image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/tomato_seeds.jpg',
        category: 'Seeds',
        type: 'input',
        rating: 4.7,
        reviews: 150,
        description: 'Disease-resistant hybrid tomato seeds, perfect for commercial and home gardening.'
    },
     {
        id: 5,
        name: 'All-Purpose Potting Soil',
        price: 400,
        image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/potting_soil.jpg',
        category: 'Fertilizers',
        type: 'input',
        rating: 4.9,
        reviews: 310,
        description: 'A blend of peat moss, compost, and perlite to ensure optimal growth for your plants.'
    },
    {
        id: 6,
        name: 'Hand Pruning Shears',
        price: 650,
        image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/pruning_shears.jpg',
        category: 'Tools',
        type: 'input',
        rating: 4.7,
        reviews: 95,
        description: 'Sharp, precision-ground steel blade for clean cuts on stems and branches up to 3/4 inch thick.'
    },

    // Agri-Produce
    {
        id: 7,
        name: 'Fresh Organic Tomatoes',
        price: 40,
        image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/fresh_tomatoes.jpg',
        category: 'Vegetables',
        type: 'produce',
        rating: 4.9,
        reviews: 512,
        description: 'Farm-fresh, juicy organic tomatoes, sold per kg. Perfect for salads, sauces, and cooking.'
    },
    {
        id: 8,
        name: 'Crisp Royal Gala Apples',
        price: 120,
        image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/gala_apples.jpg',
        category: 'Fruits',
        type: 'produce',
        rating: 4.8,
        reviews: 450,
        description: 'Sweet and crispy Royal Gala apples, sourced directly from orchards. Price per kg.'
    },
    {
        id: 9,
        name: 'Long-Grain Basmati Rice',
        price: 90,
        image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/basmati_rice.jpg',
        category: 'Grains',
        type: 'produce',
        rating: 4.7,
        reviews: 300,
        description: 'Aromatic and flavorful long-grain Basmati rice, ideal for biryani and pulao. Price per kg.'
    },
    {
        id: 10,
        name: 'Farm Fresh Carrots',
        price: 30,
        image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/fresh_carrots.jpg',
        category: 'Vegetables',
        type: 'produce',
        rating: 4.8,
        reviews: 280,
        description: 'Sweet and crunchy carrots, packed with vitamins. Directly from the farm. Price per kg.'
    },
    {
        id: 11,
        name: 'Sweet Alphonso Mangoes',
        price: 200,
        image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/alphonso_mangoes.jpg',
        category: 'Fruits',
        type: 'produce',
        rating: 5.0,
        reviews: 890,
        description: 'The king of fruits! Deliciously sweet and aromatic Alphonso mangoes. Seasonal availability. Price per kg.'
    },
    {
        id: 12,
        name: 'Organic Whole Wheat',
        price: 50,
        image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/whole_wheat.jpg',
        category: 'Grains',
        type: 'produce',
        rating: 4.6,
        reviews: 180,
        description: 'High-quality organic whole wheat grains for making fresh flour at home. Price per kg.'
    },
];
