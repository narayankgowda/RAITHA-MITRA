
import React, { useState, useCallback, useEffect } from 'react';
import { Animal } from '../data/animalData';
import { XIcon, UploadIcon } from './icons';
import { fileToBase64 } from '../utils/fileUtils';

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAnimal: (newAnimal: Omit<Animal, 'id' | 'healthRecords' | 'milkRecords' | 'breedingRecords'>) => void;
}

const AddAnimalModal: React.FC<AddAnimalModalProps> = ({ isOpen, onClose, onAddAnimal }) => {
    const initialFormState = {
        tagId: '',
        name: '',
        species: 'Cow' as Animal['species'],
        breed: '',
        birthDate: '',
        gender: 'Female' as Animal['gender'],
        status: 'Active' as Animal['status'],
        imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/cow_placeholder.jpg',
    };
    const [formData, setFormData] = useState(initialFormState);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const resetForm = () => {
        setFormData(initialFormState);
        setImageFile(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
    }

    const handleClose = () => {
        resetForm();
        onClose();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFile = useCallback((file: File | null) => {
        if(file) {
            setImageFile(file);
            if(imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(URL.createObjectURL(file));
        }
    }, [imagePreview]);
    
    const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files?.[0] || null);
    };

    const handleDrop = (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
          handleFile(event.dataTransfer.files[0]);
      }
    };
    
    const handleDragEvents = (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let finalImageUrl = formData.imageUrl;
        if (imageFile) {
            const { base64 } = await fileToBase64(imageFile);
            finalImageUrl = `data:${imageFile.type};base64,${base64}`;
        }
        onAddAnimal({
            ...formData, 
            imageUrl: finalImageUrl,
            weightHistory: [],
            genetics: { sire: 'Unknown', dam: 'Unknown' },
            milkingStatus: 'N/A',
            feedType: 'Grazing'
        });
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-xl font-semibold text-text-light dark:text-text-dark">Add New Animal</h2>
                    <button onClick={handleClose} className="p-2 rounded-full text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10"><XIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                        <div><label className="block text-sm font-medium text-text-light dark:text-text-dark">Name</label><input type="text" name="name" onChange={handleChange} required className="mt-1 block w-full input-style" /></div>
                        <div><label className="block text-sm font-medium text-text-light dark:text-text-dark">Tag ID</label><input type="text" name="tagId" onChange={handleChange} required className="mt-1 block w-full input-style" /></div>
                        <div>
                            <label className="block text-sm font-medium text-text-light dark:text-text-dark">Species</label>
                            <select name="species" onChange={handleChange} value={formData.species} className="mt-1 block w-full input-style">
                                <option>Cow</option>
                                <option>Buffalo</option>
                                <option>Ox</option>
                                <option>Goat</option>
                                <option>Sheep</option>
                                <option>Poultry</option>
                                <option>Pig</option>
                                <option>Duck</option>
                                <option>Rabbit</option>
                            </select>
                        </div>
                        <div><label className="block text-sm font-medium text-text-light dark:text-text-dark">Breed</label><input type="text" name="breed" onChange={handleChange} required className="mt-1 block w-full input-style" /></div>
                        <div><label className="block text-sm font-medium text-text-light dark:text-text-dark">Birth Date</label><input type="date" name="birthDate" onChange={handleChange} required className="mt-1 block w-full input-style" /></div>
                        <div><label className="block text-sm font-medium text-text-light dark:text-text-dark">Gender</label><select name="gender" onChange={handleChange} value={formData.gender} className="mt-1 block w-full input-style"><option>Female</option><option>Male</option></select></div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-text-light dark:text-text-dark">Animal Picture</label>
                            <div 
                                className={`flex justify-center items-center w-full h-48 rounded-lg border-2 border-dashed transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-border-light dark:border-border-dark'}`}
                                onDrop={handleDrop}
                                onDragOver={handleDragEvents}
                                onDragEnter={() => setIsDragging(true)}
                                onDragLeave={() => setIsDragging(false)}
                            >
                                <input id="animal-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageInputChange} />
                                {imagePreview ? (
                                    <div className="relative w-full h-full">
                                        <img src={imagePreview} alt="Animal preview" className="w-full h-full object-contain rounded-lg p-1"/>
                                        <button type="button" onClick={() => handleFile(null)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><XIcon className="w-3 h-3"/></button>
                                    </div>
                                ) : (
                                     <label htmlFor="animal-image-upload" className="cursor-pointer text-center text-gray-500">
                                         <UploadIcon className="w-10 h-10 mx-auto mb-2"/>
                                         <span>Click, paste or drag image</span>
                                     </label>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark flex justify-end space-x-2">
                        <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-text-light dark:text-text-dark font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-slate-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark">Add Animal</button>
                    </div>
                </form>
            </div>
             <style>{`.input-style {padding: 0.5rem 0.75rem; background-color: var(--color-input-light); border: 1px solid var(--color-border-light); border-radius: 0.375rem; color: var(--color-text-light);} .dark .input-style {background-color: var(--color-input-dark); border-color: var(--color-border-dark); color: var(--color-text-dark);}`}</style>
        </div>
    );
};

export default AddAnimalModal;
