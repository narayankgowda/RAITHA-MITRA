
export interface VideoTutorial {
    id: string;
    title: string;
    description: string;
    category: string;
    thumbnail: string;
    videoUrl: string; // Stores YouTube ID (e.g., 'Q4gTL8hZ7Jg')
    duration: string;
    language: string;
    author: string;
}

export const learningData: VideoTutorial[] = [
    {
        id: 'v1',
        title: 'The Future of Farming',
        description: 'Discover how technology is reshaping agriculture, from autonomous tractors to AI-driven crop management.',
        category: 'Modern Techniques',
        thumbnail: '', 
        videoUrl: 'Q4gTL8hZ7Jg',
        duration: '12:30',
        language: 'English',
        author: 'Freethink'
    },
    {
        id: 'v2',
        title: 'DJI Agriculture Drones',
        description: 'A detailed look at how modern spraying drones work to save time and reduce chemical usage on farms.',
        category: 'Modern Techniques',
        thumbnail: '',
        videoUrl: 'ishA6kry8nc',
        duration: '04:15',
        language: 'English',
        author: 'DJI Agriculture'
    },
    {
        id: 'v3',
        title: 'Hydroponics for Beginners',
        description: 'Learn the basics of growing plants without soil. A complete guide to setting up your first hydroponic system.',
        category: 'Modern Techniques',
        thumbnail: '',
        videoUrl: '26pp1fK8y9A',
        duration: '15:45',
        language: 'English',
        author: 'Epic Gardening'
    },
    {
        id: 'v4',
        title: 'Vertical Farming Explained',
        description: 'How vertical farming allows growing crops in urban environments using significantly less water and space.',
        category: 'Modern Techniques',
        thumbnail: '',
        videoUrl: 'IBrc_X3C27E',
        duration: '08:20',
        language: 'English',
        author: 'Tech Vision'
    },
    {
        id: 'v5',
        title: 'Principles of Organic Farming',
        description: 'Understand the core concepts of organic agriculture, soil health, and biodiversity.',
        category: 'Organic Farming',
        thumbnail: '',
        videoUrl: '3Ww2TP_tU7o',
        duration: '06:10',
        language: 'English',
        author: 'Eco India'
    }
];
