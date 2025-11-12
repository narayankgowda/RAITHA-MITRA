import React from 'react';
import { Animal } from '../data/animalData';

interface AnimalProfileCardProps {
    animal: Animal;
    onSelect: (animal: Animal) => void;
}

const AnimalProfileCard: React.FC<AnimalProfileCardProps> = ({ animal, onSelect }) => {
    const getStatusColor = () => {
        switch (animal.status) {
            case 'Active': return 'bg-green-500';
            case 'Sold': return 'bg-yellow-500';
            case 'Deceased': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div 
            className="bg-background-light dark:bg-slate-800/50 rounded-lg shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            onClick={() => onSelect(animal)}
        >
            <div className="h-48 overflow-hidden relative">
                <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover" />
                <span className={`absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded-full ${getStatusColor()}`}>
                    {animal.status}
                </span>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark">{animal.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tag ID: {animal.tagId}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">{animal.breed}</p>
            </div>
        </div>
    );
};

export default AnimalProfileCard;
