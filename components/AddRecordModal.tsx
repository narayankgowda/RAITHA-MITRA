
import React, { useState } from 'react';
import { XIcon } from './icons';

type RecordType = 'health' | 'milk' | 'breeding' | 'weight';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (newRecord: any) => void;
  animalId: string;
  recordType: RecordType;
}

const AddRecordModal: React.FC<AddRecordModalProps> = ({ isOpen, onClose, onAddRecord, recordType }) => {
    const [formData, setFormData] = useState<any>({ date: new Date().toISOString().split('T')[0] });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ensure numeric types are converted
        const data = { ...formData };
        if (data.yield) data.yield = parseFloat(data.yield);
        if (data.weight) data.weight = parseFloat(data.weight);
        onAddRecord(data);
        setFormData({ date: new Date().toISOString().split('T')[0] }); // Reset form
    };

    if (!isOpen) return null;
    
    const renderFormFields = () => {
        switch (recordType) {
            case 'health':
                return (
                    <>
                        <div><label className="block text-sm font-medium text-text-light dark:text-text-dark">Record Type</label><select name="type" onChange={handleChange} required className="mt-1 block w-full input-style"><option>Vaccination</option><option>Deworming</option><option>Treatment</option><option>Check-up</option></select></div>
                        <div><label className="block text-sm font-medium text-text-light dark:text-text-dark">Vet Name (Optional)</label><input type="text" name="vet" onChange={handleChange} className="mt-1 block w-full input-style" /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-text-light dark:text-text-dark">Notes</label><textarea name="notes" onChange={handleChange} required rows={3} className="mt-1 block w-full input-style" /></div>
                    </>
                );
            case 'milk':
                return (
                    <>
                        <div><label className="block text-sm font-medium text-text-light dark:text-text-dark">Yield (Liters)</label><input type="number" step="0.1" name="yield" onChange={handleChange} required className="mt-1 block w-full input-style" /></div>
                        <div><label className="block text-sm font-medium text-text-light dark:text-text-dark">Time</label><select name="time" onChange={handleChange} required className="mt-1 block w-full input-style"><option>Morning</option><option>Evening</option></select></div>
                    </>
                );
            case 'breeding':
                return (
                    <>
                        <div><label className="block text-sm font-medium text-text-light dark:text-text-dark">Record Type</label><select name="type" onChange={handleChange} required className="mt-1 block w-full input-style"><option>Insemination</option><option>Calving</option><option>Heat Cycle</option></select></div>
                        <div><label className="block text-sm font-medium text-text-light dark:text-text-dark">Sire/Bull ID (Optional)</label><input type="text" name="sire" onChange={handleChange} className="mt-1 block w-full input-style" /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-medium text-text-light dark:text-text-dark">Notes</label><textarea name="notes" onChange={handleChange} required rows={3} className="mt-1 block w-full input-style" /></div>
                    </>
                );
            case 'weight':
                return (
                    <>
                        <div><label className="block text-sm font-medium text-text-light dark:text-text-dark">Weight (kg)</label><input type="number" step="0.1" name="weight" onChange={handleChange} required className="mt-1 block w-full input-style" /></div>
                    </>
                );
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-xl font-semibold text-text-light dark:text-text-dark">Add {recordType.charAt(0).toUpperCase() + recordType.slice(1)} Record</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10"><XIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-text-light dark:text-text-dark">Date</label><input type="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full input-style" /></div>
                        {renderFormFields()}
                    </div>
                    <div className="p-4 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-text-light dark:text-text-dark font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-slate-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark">Add Record</button>
                    </div>
                </form>
            </div>
            <style>{`.input-style {padding: 0.5rem 0.75rem; background-color: var(--color-input-light); border: 1px solid var(--color-border-light); border-radius: 0.375rem; color: var(--color-text-light);} .dark .input-style {background-color: var(--color-input-dark); border-color: var(--color-border-dark); color: var(--color-text-dark);}`}</style>
        </div>
    );
};

export default AddRecordModal;
