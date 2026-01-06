
import React, { useState, useMemo } from 'react';
import { vetData, Vet } from '../data/vetData';
import { MapPinIcon, StarIcon, SearchIcon, FilterIcon, PhoneIcon, MailIcon } from './icons';
import { useNotifications } from '../hooks/useNotifications';

const VetConnect: React.FC = () => {
    const { dispatch } = useNotifications();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('All');

    const cities = useMemo(() => ['All', ...Array.from(new Set(vetData.map(v => v.city)))], []);

    const filteredVets = useMemo(() => {
        return vetData.filter(vet => {
            const matchesSearch = vet.name.toLowerCase().includes(searchTerm.toLowerCase()) || vet.Designation.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCity = selectedCity === 'All' || vet.city === selectedCity;
            return matchesSearch && matchesCity;
        });
    }, [searchTerm, selectedCity]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-text-light dark:text-text-dark">Vet Connect</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Instant access to professional veterinary care for your livestock.</p>
            </div>

            {/* Filters */}
            <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full md:w-auto">
                    <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>
                    <input 
                        type="text" 
                        placeholder="Search by name or specialization..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
                <div className="relative w-full md:w-48">
                    <FilterIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>
                    <select 
                        value={selectedCity} 
                        onChange={e => setSelectedCity(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                    >
                        {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                </div>
            </div>

            {/* Vet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVets.map(vet => (
                    <div key={vet.id} className="bg-card-light dark:bg-card-dark rounded-xl shadow-md border border-border-light dark:border-border-dark overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                        <div className="p-6">
                            <div className="flex gap-4">
                                <img src={vet.image} alt={vet.name} className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-sm" />
                                <div>
                                    <h3 className="font-bold text-lg text-text-light dark:text-text-dark">{vet.name}</h3>
                                    <p className="text-sm font-medium text-primary">{vet.Designation}</p>
                                    <div className="flex items-center mt-1 text-xs text-gray-500">
                                        <MapPinIcon className="w-3 h-3 mr-1"/> {vet.city}
                                    </div>
                                    <div className="flex items-center mt-1">
                                        <StarIcon className="w-3 h-3 text-yellow-400 fill-current"/>
                                        <span className="text-xs font-bold ml-1">{vet.rating}</span>
                                        <span className="text-xs text-gray-400 ml-1">({vet.experience} Yrs Exp)</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex justify-between border-b border-border-light dark:border-border-dark pb-2">
                                    <span>Consultation Fee:</span>
                                    <span className="font-bold">₹{vet.consultationFee}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span>Availability:</span>
                                    <span className={`font-bold ${vet.availability === 'Available' ? 'text-green-600' : 'text-red-600'}`}>{vet.availability}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-2 italic">
                                    Speaks: {vet.languages.join(', ')}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Contact Details</h4>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm font-medium text-text-light dark:text-text-dark">
                                    <PhoneIcon className="w-4 h-4 mr-2 text-green-600"/>
                                    {vet.phone}
                                </div>
                                <div className="flex items-center text-sm font-medium text-text-light dark:text-text-dark">
                                    <MailIcon className="w-4 h-4 mr-2 text-blue-600"/>
                                    {vet.email}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VetConnect;
