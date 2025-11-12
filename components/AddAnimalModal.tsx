import React, { useState } from 'react';
import { Animal } from '../data/animalData';
import { XIcon } from './icons';

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAnimal: (newAnimal: Omit<Animal, 'id' | 'healthRecords' | 'milkRecords' | 'breedingRecords'>) => void;
}

const AddAnimalModal: React.FC<AddAnimalModalProps> = ({ isOpen, onClose, onAddAnimal }) => {
    const [formData, setFormData] = useState({
        tagId: '',
        name: '',
        species: 'Cow' as Animal['species'],
        breed: '',
        birthDate: '',
        gender: 'Female' as Animal['gender'],
        status: 'Active' as Animal['status'],
        imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/cow_placeholder.jpg',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddAnimal(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-xl font-semibold">Add New Animal</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><XIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium">Name</label><input type="text" name="name" onChange={handleChange} required className="mt-1 block w-full input-style" /></div>
                        <div><label className="block text-sm font-medium">Tag ID</label><input type="text" name="tagId" onChange={handleChange} required className="mt-1 block w-full input-style" /></div>
                        <div><label className="block text-sm font-medium">Species</label><select name="species" onChange={handleChange} value={formData.species} className="mt-1 block w-full input-style"><option>Cow</option><option>Buffalo</option><option>Goat</option><option>Sheep</option></select></div>
                        <div><label className="block text-sm font-medium">Breed</label><input type="text" name="breed" onChange={handleChange} required className="mt-1 block w-full input-style" /></div>
                        <div><label className="block text-sm font-medium">Birth Date</label><input type="date" name="birthDate" onChange={handleChange} required className="mt-1 block w-full input-style" /></div>
                        <div><label className="block text-sm font-medium">Gender</label><select name="gender" onChange={handleChange} value={formData.gender} className="mt-1 block w-full input-style"><option>Female</option><option>Male</option></select></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium">Image URL</label><input type="text" name="imageUrl" onChange={handleChange} value={formData.imageUrl} className="mt-1 block w-full input-style" /></div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-border-light dark:border-border-dark flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-text-light dark:text-text-dark font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-slate-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md active:scale-95">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95">Add Animal</button>
                    </div>
                </form>
            </div>
             <style>{`.input-style {padding: 0.5rem 0.75rem; background-color: white; border: 1px solid #e2e8f0; border-radius: 0.375rem;} .dark .input-style {background-color: #334155; border-color: #475569;} .input-style:focus {outline: 2px solid transparent; outline-offset: 2px; --tw-ring-color: #22c55e; border-color: #22c55e;}`}</style>
        </div>
    );
};

export default AddAnimalModal;