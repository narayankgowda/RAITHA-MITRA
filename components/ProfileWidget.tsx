import React from 'react';
import { mockFarmerData } from '../data/userData';

interface ProfileWidgetProps {
  onNavigate: () => void;
}

const ProfileWidget: React.FC<ProfileWidgetProps> = ({ onNavigate }) => {
  const farmer = mockFarmerData;
  return (
    <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-md border border-border-light dark:border-border-dark h-full flex flex-col">
      <div className="flex items-center gap-4">
        <img src={farmer.profilePicture} alt={farmer.name} className="w-20 h-20 rounded-full border-2 border-primary" />
        <div>
          <h3 className="font-bold text-lg">{farmer.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{farmer.farmName}</p>
        </div>
      </div>
      <div className="flex-grow mt-4 space-y-1 text-sm">
          <p><strong>Farm Size:</strong> {farmer.farmSize} acres</p>
          <p><strong>Main Crops:</strong> {farmer.mainCrops.join(', ')}</p>
      </div>
      <button onClick={onNavigate} className="mt-4 w-full text-sm text-center py-2 bg-primary-light text-white font-semibold rounded-lg hover:bg-primary transition-colors">
        View & Edit Profile
      </button>
    </div>
  );
};
export default ProfileWidget;