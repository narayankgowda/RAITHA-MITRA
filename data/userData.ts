

export interface FarmerProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  farmName: string;
  farmSize: number; // in acres
  mainCrops: string[];
  profilePicture: string;
}

export interface FarmerPortfolioData extends FarmerProfileData {
    farmStory: string;
    achievements: string[];
    galleryImages: { url: string; caption: string; }[];
    coverImage: string;
}

export const mockFarmerData: FarmerPortfolioData = {
  name: 'NARAYAN K GOWDA',
  email: 'appu01452@example.com',
  phone: '+91 9964880400',
  location: 'Hubli, Karnataka',
  farmName: 'Green Valley Farms',
  farmSize: 25,
  mainCrops: ['Rice', 'Wheat', 'Sugarcane'],
  profilePicture: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/farmer_profile.jpg',
  farmStory: "Green Valley Farms was started in 1985 with a simple mission: to grow healthy, sustainable food for our community. We believe in organic practices and working in harmony with nature. Every crop is a testament to our family's dedication to quality and tradition.",
  achievements: [
      'Organic Certified (2020)',
      'State Award for Sustainable Farming (2022)',
      'Top Producer for Wheat in Hubli Region (2023)'
  ],
  galleryImages: [
      { url: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/rice_ripening.jpg', caption: 'Golden Rice Fields' },
      { url: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/whole_wheat.jpg', caption: 'Harvested Wheat' },
      { url: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/fresh_tomatoes.jpg', caption: 'Juicy Tomatoes' },
      { url: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/holstein_cow.jpg', caption: 'Our Healthy Livestock' }
  ],
  coverImage: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/farm_cover.jpg'
};

export interface BuyerProfileData {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  preferredCategories: string[];
  profilePicture: string;
}

export interface AdminProfileData {
  name: string;
  email: string;
  role: string;
  permissions: string[];
  profilePicture: string;
}

export const mockBuyerData: BuyerProfileData = {
  name: 'Retail Buyer',
  email: 'buyer@example.com',
  phone: '+91 8887776665',
  companyName: 'Fresh Produce Inc.',
  preferredCategories: ['Vegetables', 'Fruits', 'Grains'],
  profilePicture: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/buyer_profile.jpg',
};

export const mockAdminData: AdminProfileData = {
  name: 'Admin User',
  email: 'admin@raitha-mitra.com',
  role: 'Platform Administrator',
  permissions: ['User Management', 'Content Moderation', 'System Settings'],
  profilePicture: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/admin_profile.jpg',
};