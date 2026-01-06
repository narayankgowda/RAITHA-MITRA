
import React from 'react';
import { Animal } from '../data/animalData';
import { ActivityIcon, DropletsIcon, AlertTriangleIcon, ClockIcon } from './icons';

interface AnimalProfileCardProps {
    animal: Animal;
    onSelect: (animal: Animal) => void;
}

const AnimalProfileCard: React.FC<AnimalProfileCardProps> = ({ animal, onSelect }) => {
    const isSick = animal.status === 'Sick' || animal.status === 'Quarantine';
    
    const getStatusColor = () => {
        switch (animal.status) {
            case 'Active': return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]';
            case 'Sick': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse';
            case 'Quarantine': return 'bg-orange-500';
            case 'Sold': return 'bg-gray-500';
            default: return 'bg-blue-500';
        }
    };

    const latestMilk = animal.milkRecords?.[0]?.yield || 0;

    return (
        <div 
            onClick={() => onSelect(animal)}
            className="bg-white dark:bg-[#1e293b] rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer group"
        >
            <div className="h-44 overflow-hidden relative bg-gray-100 dark:bg-slate-800">
                <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider backdrop-blur-md flex items-center ${getStatusColor()}`}>
                        {animal.status}
                    </div>
                    {isSick && (
                        <div className="p-1.5 rounded-full bg-red-600 text-white shadow-lg animate-bounce">
                            <AlertTriangleIcon className="w-3 h-3" />
                        </div>
                    )}
                </div>

                <div className="absolute bottom-4 left-5 text-white">
                    <h3 className="text-xl font-black tracking-tight leading-none mb-1">{animal.name}</h3>
                    <p className="text-xs opacity-80 font-bold uppercase tracking-widest">{animal.tagId}</p>
                </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-transparent to-gray-50/30 dark:to-slate-900/30">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-0.5">Breed Type</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{animal.breed}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-black text-primary">{animal.species}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                    <div className="bg-gray-100/50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase mb-1">
                            <DropletsIcon className="w-3 h-3 text-primary"/> Yield
                        </div>
                        <p className="font-black text-gray-900 dark:text-white">{latestMilk.toFixed(1)} <span className="text-[10px]">L</span></p>
                    </div>
                    <div className="bg-gray-100/50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase mb-1">
                            <ActivityIcon className="w-3 h-3 text-blue-500"/> Health
                        </div>
                        <p className="font-black text-gray-900 dark:text-white">Good</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimalProfileCard;
