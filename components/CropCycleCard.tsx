import React from 'react';
import { Crop } from '../data/cropCycleData';

interface CropCycleCardProps {
  crop: Crop;
  onSelect: (crop: Crop) => void;
}

const CropCycleCard: React.FC<CropCycleCardProps> = ({ crop, onSelect }) => {
  return (
    <div 
        onClick={() => onSelect(crop)}
        className="bg-background-light dark:bg-slate-800/50 rounded-lg shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      <div className="h-48 overflow-hidden">
        <img src={crop.imageUrl} alt={crop.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2 truncate">{crop.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">{crop.description}</p>
        <button 
            className="mt-auto w-full py-2 bg-primary-light text-white font-semibold rounded-lg hover:bg-primary transition-colors text-sm"
        >
            View Cycle
        </button>
      </div>
    </div>
  );
};

export default CropCycleCard;
