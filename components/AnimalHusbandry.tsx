
import React, { useState, useEffect, useMemo } from 'react';
import { initialAnimalData, Animal } from '../data/animalData';
import AnimalProfileCard from './AnimalProfileCard';
import AnimalDetailView from './AnimalDetailView';
import AddAnimalModal from './AddAnimalModal';
import { PlusIcon, PawPrintIcon, ActivityIcon, DropletsIcon, AlertTriangleIcon, SearchIcon, FilterIcon, LayersIcon } from './icons';

const AnimalHusbandry: React.FC = () => {
    const [animals, setAnimals] = useState<Animal[]>(() => {
        try {
            const savedAnimals = localStorage.getItem('farm_animals');
            return savedAnimals ? JSON.parse(savedAnimals) : initialAnimalData;
        } catch (error) {
            return initialAnimalData;
        }
    });

    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filterSpecies, setFilterSpecies] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('farm_animals', JSON.stringify(animals));
    }, [animals]);

    const stats = useMemo(() => {
        const total = animals.length;
        const healthy = animals.filter(a => a.status === 'Active').length;
        const sick = animals.filter(a => a.status === 'Sick' || a.status === 'Quarantine').length;
        const totalMilkToday = animals.reduce((acc, animal) => {
            const todayRecs = animal.milkRecords.slice(0, 2); 
            return acc + todayRecs.reduce((s, r) => s + r.yield, 0);
        }, 0);
        
        return { total, healthy, sick, totalMilkToday };
    }, [animals]);

    const filteredAnimals = useMemo(() => {
        return animals.filter(a => {
            const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.tagId.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSpecies = filterSpecies === 'All' || a.species === filterSpecies;
            return matchesSearch && matchesSpecies;
        });
    }, [animals, searchQuery, filterSpecies]);

    const handleUpdateAnimal = (updatedAnimal: Animal) => {
        setAnimals(prev => prev.map(a => a.id === updatedAnimal.id ? updatedAnimal : a));
        setSelectedAnimal(updatedAnimal);
    };

    const handleAddAnimal = (data: any) => {
        const newAnimal: Animal = {
            ...data,
            id: `A${Date.now()}`,
            healthRecords: [],
            milkRecords: [],
            breedingRecords: [],
            weightHistory: [],
            genetics: { sire: 'Unknown', dam: 'Unknown' },
        };
        setAnimals([newAnimal, ...animals]);
        setIsAddModalOpen(false);
    };

    if (selectedAnimal) {
        return <AnimalDetailView animal={selectedAnimal} onBack={() => setSelectedAnimal(null)} onUpdateAnimal={handleUpdateAnimal} />;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn p-4 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        Herd Intelligence
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Real-time livestock health and production tracking.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Register Animal
                </button>
            </div>

            {/* Bento Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Headcount</p>
                    <div className="flex items-end gap-2">
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.total}</p>
                        <PawPrintIcon className="w-5 h-5 text-blue-500 mb-1.5"/>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Production</p>
                    <div className="flex items-end gap-2">
                        <p className="text-3xl font-black text-primary">{stats.totalMilkToday.toFixed(1)} <span className="text-sm font-bold">L</span></p>
                        <DropletsIcon className="w-5 h-5 text-primary mb-1.5"/>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Medical Alerts</p>
                    <div className="flex items-end gap-2">
                        <p className={`text-3xl font-black ${stats.sick > 0 ? 'text-red-500' : 'text-gray-400'}`}>{stats.sick}</p>
                        <AlertTriangleIcon className={`w-5 h-5 mb-1.5 ${stats.sick > 0 ? 'text-red-500' : 'text-gray-300'}`}/>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Health Score</p>
                    <div className="flex items-end gap-2">
                        <p className="text-3xl font-black text-green-500">94%</p>
                        <ActivityIcon className="w-5 h-5 text-green-500 mb-1.5"/>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search Tag ID or Name..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary text-gray-900 dark:text-white outline-none shadow-sm"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {['All', 'Cow', 'Buffalo', 'Goat', 'Sheep'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterSpecies(s)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
                                filterSpecies === s 
                                ? 'bg-primary text-white border-primary shadow-md' 
                                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filteredAnimals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAnimals.map(animal => (
                        <AnimalProfileCard key={animal.id} animal={animal} onSelect={setSelectedAnimal} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50/50 dark:bg-slate-900/30 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <PawPrintIcon className="w-16 h-16 mx-auto mb-4 text-gray-300"/>
                    <h3 className="text-xl font-bold text-gray-500">No animals found</h3>
                    <p className="text-gray-400 mt-1">Try adjusting your filters or register a new animal.</p>
                </div>
            )}

            <AddAnimalModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddAnimal={handleAddAnimal} />
        </div>
    );
};

export default AnimalHusbandry;
