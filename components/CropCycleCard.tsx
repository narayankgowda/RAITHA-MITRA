
import React from 'react';
import { Crop } from '../data/cropCycleData';
import { ActivityIcon, DropletsIcon, AlertTriangleIcon, ClockIcon } from './icons';

interface CropCycleCardProps {
  crop: Crop;
  onSelect: (crop: Crop) => void;
}

const CropCycleCard: React.FC<CropCycleCardProps> = ({ crop, onSelect }) => {
  const getHealthColorClass = (score: number) => {
      if (score >= 80) return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]';
      if (score >= 60) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]';
      return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
  };

  const currentStage = crop.stages[crop.currentStageIndex]?.name || 'Unknown';
  const progressPercent = Math.round(((crop.currentStageIndex + 1) / crop.stages.length) * 100);

  return (
    <div 
        onClick={() => onSelect(crop)}
        className="bg-white dark:bg-[#1e293b] rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer group"
    >
      <div className="h-44 overflow-hidden relative">
        <img src={crop.imageUrl} alt={crop.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="absolute top-4 left-4 flex gap-2">
            <div className={`px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider backdrop-blur-md flex items-center ${getHealthColorClass(crop.healthScore)}`}>
                <ActivityIcon className="w-3 h-3 mr-1.5" /> {crop.healthScore}% Healthy
            </div>
            {crop.pestRisk === 'High' && (
                <div className="px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider bg-red-600/90 backdrop-blur-sm animate-pulse">
                    Risk Alert
                </div>
            )}
        </div>

        <div className="absolute bottom-4 left-5 text-white">
            <h3 className="text-xl font-black tracking-tight leading-none mb-1">{crop.name}</h3>
            <p className="text-xs opacity-80 font-bold uppercase tracking-widest">{crop.fieldName} • {crop.fieldArea} Ac</p>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-transparent to-gray-50/30 dark:to-slate-900/30">
        <div className="flex justify-between items-end mb-4">
            <div>
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-0.5">Current Phase</span>
                <span className="text-base font-bold text-gray-800 dark:text-gray-100">{currentStage}</span>
            </div>
            <div className="text-right">
                <span className="text-sm font-black text-primary">{progressPercent}%</span>
            </div>
        </div>

        {/* Improved Progress Bar */}
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-6 overflow-hidden p-0.5">
            <div 
                className="bg-primary h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(22,163,74,0.3)]" 
                style={{ width: `${progressPercent}%` }}
            ></div>
        </div>

        <div className="flex items-center justify-between mt-auto">
             <div className="flex items-center text-xs font-bold text-gray-500">
                 <ClockIcon className="w-3.5 h-3.5 mr-1.5" /> Last checked 2h ago
             </div>
             <div className="flex items-center text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30">
                 {crop.moistureLevel}% Moisture
             </div>
        </div>
      </div>
    </div>
  );
};

export default CropCycleCard;
