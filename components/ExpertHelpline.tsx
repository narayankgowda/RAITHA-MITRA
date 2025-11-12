import React, { useState, useMemo } from 'react';
import { expertData, Expert } from '../data/expertData';
import { PhoneIcon, HeadsetIcon } from './icons';

const ExpertHelpline: React.FC = () => {
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');

    const specialties = ['All', ...Array.from(new Set(expertData.map(e => e.specialty)))];

    const filteredExperts = useMemo(() => {
        if (selectedSpecialty === 'All') {
            return expertData;
        }
        return expertData.filter(expert => expert.specialty === selectedSpecialty);
    }, [selectedSpecialty]);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold">Expert Consultation & Helpline</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Get professional advice from experienced agricultural experts.</p>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-sm">
                    <label htmlFor="specialty-filter" className="block text-sm font-medium text-center mb-2">
                        Filter by Specialty
                    </label>
                    <select
                        id="specialty-filter"
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="block w-full px-4 py-2 bg-white dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                        {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExperts.map(expert => (
                    <div key={expert.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-4 flex flex-col items-center text-center border border-border-light dark:border-border-dark">
                        <img src={expert.image} alt={expert.name} className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-primary" />
                        <h3 className="font-bold text-lg">{expert.name}</h3>
                        <p className="text-sm text-primary dark:text-primary-light font-semibold">{expert.specialty}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{expert.experience} years of experience</p>
                        <div className="flex items-center mt-2">
                             <span className='text-yellow-400'>★</span>
                             <span className="text-sm font-semibold ml-1">{expert.rating}</span>
                        </div>
                        <a href={`tel:${expert.phone}`} className="mt-4 w-full flex items-center justify-center py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                            <PhoneIcon className="w-4 h-4 mr-2" />
                            Call Now
                        </a>
                    </div>
                ))}
            </div>
            {filteredExperts.length === 0 && (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    <HeadsetIcon className="w-16 h-16 mx-auto mb-4"/>
                    <p>No experts found for the selected specialty.</p>
                </div>
            )}
        </div>
    );
};

export default ExpertHelpline;