import React, { useState } from 'react';
import { cropCycleData, Crop } from '../data/cropCycleData';
import CropCycleCard from './CropCycleCard';
import CropCycleDetailView from './CropCycleDetailView';
import { ActivityIcon } from './icons';

const CropMonitoring: React.FC = () => {
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

    const handleSelectCrop = (crop: Crop) => {
        setSelectedCrop(crop);
    };

    const handleBackToList = () => {
        setSelectedCrop(null);
    };

    if (selectedCrop) {
        return <CropCycleDetailView crop={selectedCrop} onBack={handleBackToList} />;
    }

    return (
        <div className="flex flex-col space-y-6">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold">Crop Cycle Monitoring</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Select a crop to view its growth stages and management tasks.</p>
            </div>
            
            {cropCycleData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cropCycleData.map(crop => (
                        <CropCycleCard key={crop.id} crop={crop} onSelect={handleSelectCrop} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    <ActivityIcon className="w-16 h-16 mx-auto mb-4"/>
                    <p className="text-lg">No crop data available.</p>
                </div>
            )}
        </div>
    );
};

export default CropMonitoring;
