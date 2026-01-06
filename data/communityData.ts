






export interface CommunityUser {
  id: string;
  name: string;
  profileImage: string;
  farmLocation: string;
  farmSize: string; // e.g., "5 acres"
  crops: string[];
  experienceYears: number;
  reputationPoints: number;
  badges: string[]; // e.g., "Pest Expert", "Top Contributor"
  about?: string;
  joinedDate: string;
  followers: number;
  following: number;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string; // markdown supported
  createdAt: string;
  isBestAnswer: boolean;
  upvotes: number;
}

export interface PollOption {
    text: string;
    votes: number;
}

export interface Poll {
    question: string;
    options: PollOption[];
    totalVotes: number;
}

export interface Post {
  id: string;
  authorId: string;
  category: 'General' | 'Crops' | 'Livestock' | 'Machinery' | 'Organic Farming' | 'Market & Prices';
  title: string;
  content: string; // markdown supported
  tags: string[];
  images?: string[]; // base64 or urls
  createdAt: string;
  location?: string; // Optional geo-tag
  comments: Comment[];
  viewCount: number;
  upvotes: number;
  issueType?: string; // e.g., "Pest", "Disease", "Nutrient Deficiency"
  poll?: Poll; // Optional Poll
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  location: string;
  image: string;
  isPrivate: boolean;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
    read: boolean;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'reply' | 'bestAnswer' | 'follow' | 'mention';
    content: string;
    link?: string;
    read: boolean;
    createdAt: string;
}

// Mock Data
export const communityUsers: CommunityUser[] = [
    {
        id: 'u1',
        name: 'Ramesh Kumar',
        profileImage: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/farmer_profile.jpg',
        farmLocation: 'Mandya, Karnataka',
        farmSize: '12 acres',
        crops: ['Sugarcane', 'Paddy'],
        experienceYears: 15,
        reputationPoints: 450,
        badges: ['Expert Farmer', 'Mentor'],
        about: 'Experienced sugarcane farmer advocating for sustainable water management practices.',
        joinedDate: '2022-03-15',
        followers: 120,
        following: 15
    },
    {
        id: 'u2',
        name: 'Lakshmi Devi',
        profileImage: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/expert_female_1.jpg',
        farmLocation: 'Kolar, Karnataka',
        farmSize: '5 acres',
        crops: ['Tomato', 'Vegetables'],
        experienceYears: 8,
        reputationPoints: 120,
        badges: ['Active Member'],
        about: 'Passionate about organic vegetable farming and market linkage.',
        joinedDate: '2023-01-10',
        followers: 45,
        following: 30
    },
    {
        id: 'currentUser', // Mock ID for the logged-in user
        name: 'NARAYAN K GOWDA',
        profileImage: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/farmer_profile.jpg',
        farmLocation: 'Hubli, Karnataka',
        farmSize: '25 acres',
        crops: ['Rice', 'Wheat', 'Sugarcane'],
        experienceYears: 20,
        reputationPoints: 50,
        badges: ['Member'],
        about: 'Traditional farmer embracing modern technology to improve yield.',
        joinedDate: '2023-05-01',
        followers: 10,
        following: 5
    }
];

export const communityGroups: Group[] = [
    {
        id: 'g1',
        name: 'Organic Farmers of Karnataka',
        description: 'A group for sharing organic farming techniques and certification advice.',
        memberCount: 1240,
        location: 'Karnataka',
        image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/organic_farm.jpg',
        isPrivate: false
    },
    {
        id: 'g2',
        name: 'Hubli Tomato Growers',
        description: 'Local market updates and pest alerts for tomato farmers in Hubli.',
        memberCount: 350,
        location: 'Hubli',
        image: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/tomato_harvesting.jpg',
        isPrivate: false
    }
];

export const communityPosts: Post[] = [
    {
        id: 'p1',
        authorId: 'u1',
        category: 'Crops',
        title: 'Yellowing leaves on my paddy crop - Nitrogen deficiency?',
        content: 'I noticed yellowing on the lower leaves of my paddy crop (25 days after transplanting). Is this nitrogen deficiency or something else? I have attached a photo.',
        tags: ['Paddy', 'Disease', 'Nutrients'],
        images: ['https://storage.googleapis.com/aistudio-marketplace-public-test-assets/rice_disease_1.jpg'],
        createdAt: '2024-05-20T10:00:00Z',
        location: 'Mandya',
        viewCount: 150,
        upvotes: 12,
        issueType: 'Nutrient Deficiency',
        comments: [
            {
                id: 'c1',
                authorId: 'u2',
                content: 'Yes, yellowing of lower leaves usually indicates Nitrogen deficiency. Try top-dressing with Urea. Also check water levels.',
                createdAt: '2024-05-20T11:30:00Z',
                isBestAnswer: true,
                upvotes: 5
            }
        ]
    },
    {
        id: 'p2',
        authorId: 'u2',
        category: 'Market & Prices',
        title: 'Tomato prices in Kolar market today',
        content: 'Just returned from the market. Quality tomatoes are selling for ₹15/kg. Traders saying prices might go up next week due to rain forecast.',
        tags: ['Tomato', 'Market Price', 'Kolar'],
        createdAt: '2024-05-21T08:00:00Z',
        location: 'Kolar',
        viewCount: 85,
        upvotes: 20,
        issueType: 'Market',
        comments: []
    },
    {
        id: 'p3',
        authorId: 'u1',
        category: 'General',
        title: 'Best crop for next season?',
        content: 'I have 5 acres of land. What should I plant next season? Please vote.',
        tags: ['Planning', 'Crops'],
        createdAt: '2024-05-22T08:00:00Z',
        location: 'Mandya',
        viewCount: 100,
        upvotes: 8,
        comments: [],
        poll: {
            question: 'Which crop is best for Mandya region next season?',
            totalVotes: 45,
            options: [
                { text: 'Sugarcane', votes: 25 },
                { text: 'Paddy', votes: 15 },
                { text: 'Ragi', votes: 5 }
            ]
        }
    }
];

export const mockMessages: Message[] = [
    {
        id: 'm1',
        senderId: 'u1',
        receiverId: 'currentUser',
        content: 'Hello Narayan, I saw your post about sugarcane. Are you using drip irrigation?',
        timestamp: '2024-05-21T09:00:00Z',
        read: false
    },
    {
        id: 'm2',
        senderId: 'currentUser',
        receiverId: 'u1',
        content: 'Yes, Ramesh. I installed it last year. It has saved a lot of water.',
        timestamp: '2024-05-21T09:15:00Z',
        read: true
    },
    {
        id: 'm3',
        senderId: 'u1',
        receiverId: 'currentUser',
        content: 'That is great. I am planning to install it too. Which brand did you use?',
        timestamp: '2024-05-21T09:20:00Z',
        read: false
    }
];

export const mockNotifications: Notification[] = [
    {
        id: 'n1',
        userId: 'currentUser',
        type: 'reply',
        content: 'Ramesh Kumar replied to your post about "Sugarcane Prices".',
        read: false,
        createdAt: '2024-05-22T08:30:00Z'
    },
    {
        id: 'n2',
        userId: 'currentUser',
        type: 'bestAnswer',
        content: 'Your answer was marked as the Best Answer by Lakshmi Devi.',
        read: true,
        createdAt: '2024-05-21T14:15:00Z'
    },
    {
        id: 'n3',
        userId: 'currentUser',
        type: 'follow',
        content: 'Sunita Sharma started following you.',
        read: false,
        createdAt: '2024-05-21T10:00:00Z'
    },
    {
        id: 'n4',
        userId: 'currentUser',
        type: 'follow',
        content: 'Rajesh Patel started following you.',
        read: false,
        createdAt: '2024-05-23T09:45:00Z'
    }
];
