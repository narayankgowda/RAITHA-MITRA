import React, { useState, useMemo } from 'react';
import { schemeData, Scheme } from '../data/schemeData';
import SchemeCard from './SchemeCard';
import SchemeDetailModal from './SchemeDetailModal';

const GovernmentSchemes: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const categories = ['All', ...Array.from(new Set(schemeData.map(s => s.category)))];

    const filteredSchemes = useMemo(() => {
        return schemeData.filter(scheme => {
            const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
            const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) || scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, selectedCategory]);

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
                <h2 className="text-2xl md:text-3xl font-bold">Government Schemes for Farmers</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Find relevant schemes to support your agricultural activities.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search for schemes by name or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow px-4 py-2 bg-white dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            {filteredSchemes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSchemes.map(scheme => (
                        <SchemeCard key={scheme.id} scheme={scheme} onViewDetails={handleViewDetails} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-gray-500 dark:text-gray-400">No schemes found matching your criteria.</p>
                </div>
            )}
            
            <SchemeDetailModal isOpen={isModalOpen} onClose={handleCloseModal} scheme={selectedScheme} />
        </div>
    );
};

export default GovernmentSchemes;
