
import React, { useState, useMemo, useEffect } from 'react';
import { schemeData, Scheme } from '../data/schemeData';
import SchemeCard from './SchemeCard';
import SchemeDetailModal from './SchemeDetailModal';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { DownloadIcon, BookmarkIcon } from './icons';

const GovernmentSchemes: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedSchemes, setSavedSchemes] = useState<string[]>([]);
    const [viewSavedOnly, setViewSavedOnly] = useState(false);
    const isOnline = useNetworkStatus();

    useEffect(() => {
        const saved = localStorage.getItem('saved_schemes');
        if (saved) {
            setSavedSchemes(JSON.parse(saved));
        }
        
        // Auto-switch to saved view if offline
        if (!isOnline) {
            setViewSavedOnly(true);
        }
    }, [isOnline]);

    const handleSaveScheme = (schemeId: string) => {
        let newSaved: string[];
        if (savedSchemes.includes(schemeId)) {
            newSaved = savedSchemes.filter(id => id !== schemeId);
        } else {
            newSaved = [...savedSchemes, schemeId];
        }
        setSavedSchemes(newSaved);
        localStorage.setItem('saved_schemes', JSON.stringify(newSaved));
    };

    const categories = ['All', ...Array.from(new Set(schemeData.map(s => s.category)))];

    const filteredSchemes = useMemo(() => {
        return schemeData.filter(scheme => {
            const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
            const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) || scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSaved = viewSavedOnly ? savedSchemes.includes(scheme.id) : true;
            
            return matchesCategory && matchesSearch && matchesSaved;
        });
    }, [searchTerm, selectedCategory, savedSchemes, viewSavedOnly]);

    const handleViewDetails = (scheme: Scheme) => {
        setSelectedScheme(scheme);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedScheme(null);
    };

    return (
        <div className="flex flex-col space-y-6">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">Government Schemes for Farmers</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Find relevant schemes to support your agricultural activities.</p>
                {!isOnline && (
                    <p className="text-sm text-red-500 mt-2 font-medium">You are offline. Showing saved schemes.</p>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-grow">
                    <input
                        type="text"
                        placeholder="Search for schemes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-4 py-2 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                
                <button
                    onClick={() => setViewSavedOnly(!viewSavedOnly)}
                    className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${viewSavedOnly ? 'bg-primary text-white' : 'bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark border border-border-light dark:border-border-dark'}`}
                >
                    <BookmarkIcon className={`w-5 h-5 mr-2 ${viewSavedOnly ? 'fill-current' : ''}`} />
                    {viewSavedOnly ? 'Showing Saved' : 'Show Saved'}
                </button>
            </div>

            {filteredSchemes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchemes.map(scheme => (
                        <SchemeCard 
                            key={scheme.id} 
                            scheme={scheme} 
                            onViewDetails={handleViewDetails} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-gray-500 dark:text-gray-400">
                        {viewSavedOnly ? "No saved schemes found." : "No schemes found matching your criteria."}
                    </p>
                </div>
            )}
            
            <SchemeDetailModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                scheme={selectedScheme}
                isSaved={selectedScheme ? savedSchemes.includes(selectedScheme.id) : false}
                onToggleSave={() => selectedScheme && handleSaveScheme(selectedScheme.id)}
            />
        </div>
    );
};

export default GovernmentSchemes;
