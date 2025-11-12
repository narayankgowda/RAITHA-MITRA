import React, { useState } from 'react';
import { Animal, HealthRecord, MilkRecord, BreedingRecord } from '../data/animalData';
import AddRecordModal from './AddRecordModal';

interface AnimalDetailViewProps {
  animal: Animal;
  onBack: () => void;
  onUpdateAnimal: (updatedAnimal: Animal) => void;
}

type RecordType = 'health' | 'milk' | 'breeding';

const AnimalDetailView: React.FC<AnimalDetailViewProps> = ({ animal, onBack, onUpdateAnimal }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recordType, setRecordType] = useState<RecordType>('health');
    const [activeTab, setActiveTab] = useState<RecordType>('health');

    const handleOpenModal = (type: RecordType) => {
        setRecordType(type);
        setIsModalOpen(true);
    };

    const handleAddRecord = (newRecord: Omit<HealthRecord, 'id'> | Omit<MilkRecord, 'id'> | Omit<BreedingRecord, 'id'>) => {
        const recordWithId = { ...newRecord, id: `REC-${Date.now()}` };
        let updatedAnimal = { ...animal };

        if (recordType === 'health') {
            updatedAnimal.healthRecords = [recordWithId as HealthRecord, ...animal.healthRecords];
        } else if (recordType === 'milk') {
            updatedAnimal.milkRecords = [recordWithId as MilkRecord, ...animal.milkRecords];
        } else if (recordType === 'breeding') {
            updatedAnimal.breedingRecords = [recordWithId as BreedingRecord, ...animal.breedingRecords];
        }
        
        onUpdateAnimal(updatedAnimal);
        setIsModalOpen(false);
    };

    const renderHealthRecords = () => (
        <div className="space-y-3">
            {animal.healthRecords.map(rec => (
                <div key={rec.id} className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md">
                    <p className="font-semibold">{rec.type} - <span className="text-sm font-normal">{new Date(rec.date).toLocaleDateString()}</span></p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{rec.notes}</p>
                    {rec.vet && <p className="text-xs text-gray-500">Vet: {rec.vet}</p>}
                </div>
            ))}
            {animal.healthRecords.length === 0 && <p className="text-sm text-center text-gray-500 py-4">No health records found.</p>}
        </div>
    );

    const renderMilkRecords = () => (
        <div className="space-y-3">
             {animal.milkRecords.map(rec => (
                <div key={rec.id} className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md flex justify-between items-center">
                    <div>
                        <p className="font-semibold">{rec.time} Yield - <span className="text-sm font-normal">{new Date(rec.date).toLocaleDateString()}</span></p>
                    </div>
                    <p className="text-lg font-bold text-primary dark:text-primary-light">{rec.yield} L</p>
                </div>
            ))}
            {animal.milkRecords.length === 0 && <p className="text-sm text-center text-gray-500 py-4">No milk records found.</p>}
        </div>
    );

    const renderBreedingRecords = () => (
        <div className="space-y-3">
            {animal.breedingRecords.map(rec => (
                <div key={rec.id} className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md">
                    <p className="font-semibold">{rec.type} - <span className="text-sm font-normal">{new Date(rec.date).toLocaleDateString()}</span></p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{rec.notes}</p>
                    {rec.sire && <p className="text-xs text-gray-500">Sire: {rec.sire}</p>}
                </div>
            ))}
            {animal.breedingRecords.length === 0 && <p className="text-sm text-center text-gray-500 py-4">No breeding records found.</p>}
        </div>
    );
    
    const TabButton: React.FC<{tab: RecordType; label: string}> = ({ tab, label }) => (
         <button onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-sm font-semibold rounded-md flex-1 transition-all duration-300 focus:outline-none ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-primary dark:text-primary-light shadow-md' : 'text-gray-600 dark:text-gray-300'}`}>{label}</button>
    )

    return (
        <div>
            <button onClick={onBack} className="mb-4 text-primary dark:text-primary-light font-semibold hover:underline">
                &larr; Back to Herd
            </button>
            
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <img src={animal.imageUrl} alt={animal.name} className="w-full rounded-lg shadow-md aspect-square object-cover" />
                    <div className="mt-4 p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark">
                        <h2 className="text-2xl font-bold">{animal.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400">Tag ID: {animal.tagId}</p>
                        <ul className="mt-3 text-sm space-y-1">
                            <li><strong>Species:</strong> {animal.species}</li>
                            <li><strong>Breed:</strong> {animal.breed}</li>
                            <li><strong>Gender:</strong> {animal.gender}</li>
                            <li><strong>Born:</strong> {new Date(animal.birthDate).toLocaleDateString()}</li>
                            <li><strong>Status:</strong> {animal.status}</li>
                        </ul>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-1 p-1 bg-gray-200 dark:bg-slate-800 rounded-lg shadow-inner">
                            <TabButton tab="health" label="Health"/>
                            <TabButton tab="milk" label="Milk"/>
                            <TabButton tab="breeding" label="Breeding"/>
                        </div>
                         <button onClick={() => handleOpenModal(activeTab)} className="px-4 py-2 bg-primary-light text-white text-sm font-semibold rounded-lg hover:bg-primary transition-all duration-300 shadow hover:shadow-md transform hover:-translate-y-px active:scale-95">
                            Add Record
                        </button>
                    </div>

                    <div className="p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark min-h-[300px]">
                        {activeTab === 'health' && renderHealthRecords()}
                        {activeTab === 'milk' && renderMilkRecords()}
                        {activeTab === 'breeding' && renderBreedingRecords()}
                    </div>
                </div>
            </div>

            <AddRecordModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddRecord={handleAddRecord}
                animalId={animal.id}
                recordType={recordType}
            />
        </div>
    );
};

export default AnimalDetailView;