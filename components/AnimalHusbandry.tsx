import React, { useState } from 'react';
import { initialAnimalData, Animal } from '../data/animalData';
import AnimalProfileCard from './AnimalProfileCard';
import AnimalDetailView from './AnimalDetailView';
import AddAnimalModal from './AddAnimalModal';
import { PlusIcon, PawPrintIcon } from './icons';

const AnimalHusbandry: React.FC = () => {
    const [animals, setAnimals] = useState<Animal[]>(initialAnimalData);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleSelectAnimal = (animal: Animal) => {
        setSelectedAnimal(animal);
    };

    const handleBackToList = () => {
        setSelectedAnimal(null);
    };

    const handleAddAnimal = (newAnimalData: Omit<Animal, 'id' | 'healthRecords' | 'milkRecords' | 'breedingRecords'>) => {
        const newAnimal: Animal = {
            ...newAnimalData,
            id: `A${Date.now()}`,
            healthRecords: [],
            milkRecords: [],
            breedingRecords: [],
        };
        setAnimals(prev => [newAnimal, ...prev]);
        setIsAddModalOpen(false);
    };

    const handleUpdateAnimal = (updatedAnimal: Animal) => {
        setAnimals(prevAnimals => prevAnimals.map(animal =>
            animal.id === updatedAnimal.id ? updatedAnimal : animal
        ));
        setSelectedAnimal(updatedAnimal);
    };

    if (selectedAnimal) {
        return <AnimalDetailView animal={selectedAnimal} onBack={handleBackToList} onUpdateAnimal={handleUpdateAnimal} />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">My Herd</h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Animal
                </button>
            </div>

            {animals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {animals.map(animal => (
                        <AnimalProfileCard key={animal.id} animal={animal} onSelect={handleSelectAnimal} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    <PawPrintIcon className="w-16 h-16 mx-auto mb-4"/>
                    <p className="text-lg">Your herd is empty.</p>
                    <p>Click "Add Animal" to start managing your livestock.</p>
                </div>
            )}
            
            <AddAnimalModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddAnimal={handleAddAnimal}
            />
        </div>
    );
};

export default AnimalHusbandry;