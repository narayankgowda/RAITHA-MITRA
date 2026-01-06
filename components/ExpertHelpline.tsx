
import React, { useState, useMemo } from 'react';
import { expertData, Expert } from '../data/expertData';
import { PhoneIcon, MessageCircleIcon, CheckCircleIcon, XIcon, SearchIcon, FilterIcon, MailIcon } from './icons';
import { useNotifications } from '../hooks/useNotifications';

const ExpertHelpline: React.FC = () => {
    const { dispatch } = useNotifications();
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');
    const [isQueryModalOpen, setQueryModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const specialties = ['All', ...Array.from(new Set(expertData.map(e => e.specialty)))];

    const filteredExperts = useMemo(() => {
        return expertData.filter(expert => {
            const matchesSpecialty = selectedSpecialty === 'All' || expert.specialty === selectedSpecialty;
            const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) || expert.bio.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSpecialty && matchesSearch;
        });
    }, [selectedSpecialty, searchQuery]);

    const handleQuerySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setQueryModalOpen(false);
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Your query has been sent to the expert panel. You will receive a response shortly.', type: 'success' } });
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-text-light dark:text-text-dark">Expert Helpline</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Connect with top agricultural scientists and specialists.</p>
            </div>

            {/* Quick Actions & Filters */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
                <div className="flex gap-4 w-full lg:w-2/3">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>
                        <input 
                            type="text" 
                            placeholder="Find expert by name or topic..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="relative w-48 hidden md:block">
                        <FilterIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>
                        <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                        >
                            {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                        </select>
                    </div>
                </div>
                <button 
                    onClick={() => setQueryModalOpen(true)}
                    className="w-full lg:w-auto px-6 py-2.5 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all flex items-center justify-center"
                >
                    <MessageCircleIcon className="w-5 h-5 mr-2"/> Ask a Question
                </button>
            </div>

            {/* Expert Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredExperts.map(expert => (
                    <div key={expert.id} className="bg-card-light dark:bg-card-dark rounded-xl shadow-md p-6 border border-border-light dark:border-border-dark hover:shadow-xl transition-all flex flex-col relative overflow-hidden group">
                        
                        {/* Status Badge */}
                        <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-bold flex items-center border ${
                            expert.onlineStatus === 'Online' ? 'bg-green-100 text-green-700 border-green-200' : 
                            expert.onlineStatus === 'Busy' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                            'bg-gray-100 text-gray-500 border-gray-200'
                        }`}>
                            <span className={`w-2 h-2 rounded-full mr-1.5 ${
                                expert.onlineStatus === 'Online' ? 'bg-green-500 animate-pulse' : 
                                expert.onlineStatus === 'Busy' ? 'bg-yellow-500' : 
                                'bg-gray-400'
                            }`}></span>
                            {expert.onlineStatus}
                        </div>

                        <div className="flex items-start gap-4 mb-4">
                            <img src={expert.image} alt={expert.name} className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-sm" />
                            <div>
                                <h3 className="font-bold text-lg text-text-light dark:text-text-dark">{expert.name}</h3>
                                <p className="text-sm font-semibold text-primary">{expert.specialty}</p>
                                <p className="text-xs text-gray-500 mt-1">{expert.experience} Years Experience</p>
                                <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-1">
                                    {expert.languages.map(lang => (
                                        <span key={lang} className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">{lang}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-grow leading-relaxed">
                            {expert.bio}
                        </p>

                        <div className="mt-auto pt-4 border-t border-border-light dark:border-border-dark">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Contact Info</h4>
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-center text-sm font-medium text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark p-2 rounded">
                                    <PhoneIcon className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" /> 
                                    <span className="truncate">{expert.phone}</span>
                                </div>
                                <div className="flex items-center text-sm font-medium text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark p-2 rounded">
                                    <MailIcon className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" /> 
                                    <span className="truncate">{expert.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredExperts.length === 0 && (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    <p className="text-lg">No experts found matching your criteria.</p>
                </div>
            )}

            {/* Quick Query Modal */}
            {isQueryModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
                    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="flex justify-between items-center p-5 border-b border-border-light dark:border-border-dark">
                            <h3 className="text-xl font-bold">Post a Query</h3>
                            <button onClick={() => setQueryModalOpen(false)}><XIcon className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleQuerySubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Select Topic</label>
                                <select className="w-full p-2.5 rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark">
                                    <option>General Agriculture</option>
                                    <option>Pest Control</option>
                                    <option>Soil Health</option>
                                    <option>Market Price</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Your Question</label>
                                <textarea required rows={4} placeholder="Describe your issue in detail..." className="w-full p-2.5 rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark"></textarea>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-700 dark:text-blue-300 flex items-start">
                                <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"/>
                                Queries are usually answered within 24 hours by a verified expert. You will receive a notification.
                            </div>
                            <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all">
                                Submit Query
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpertHelpline;
