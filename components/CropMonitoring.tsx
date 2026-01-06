
import React, { useState, useMemo } from 'react';
import { cropCycleData, Crop } from '../data/cropCycleData';
import CropCycleCard from './CropCycleCard';
import CropCycleDetailView from './CropCycleDetailView';
import { PlusIcon, XIcon, SearchIcon, SproutIcon, FilterIcon, LeafIcon, ActivityIcon, LayersIcon } from './icons';

// Simple Add Field Modal
const AddFieldModal: React.FC<{ isOpen: boolean; onClose: () => void; onAdd: (data: any) => void }> = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        crop: 'Rice',
        area: '',
        date: new Date().toISOString().split('T')[0]
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({ name: '', crop: 'Rice', area: '', date: new Date().toISOString().split('T')[0] });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all scale-100">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center">
                        <PlusIcon className="w-5 h-5 mr-2 text-primary"/> Add New Crop
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-white"><XIcon className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Field Name</label>
                        <input required type="text" placeholder="e.g. North Field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Crop Type</label>
                        <select value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all">
                            <option>Rice</option><option>Wheat</option><option>Cotton</option><option>Tomato</option><option>Sugarcane</option><option>Maize</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Area (Acres)</label>
                            <input required type="number" step="0.1" placeholder="2.5" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Sowing Date</label>
                            <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 mt-2">
                        Start Tracking
                    </button>
                </form>
            </div>
        </div>
    );
};

const CropMonitoring: React.FC = () => {
    const [crops, setCrops] = useState<Crop[]>(cropCycleData);
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');

    const filteredCrops = useMemo(() => {
        return crops.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.fieldName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === 'All' || c.name === filterType;
            return matchesSearch && matchesType;
        });
    }, [crops, searchQuery, filterType]);

    // Summary Stats
    const stats = useMemo(() => {
        const totalArea = crops.reduce((acc, c) => acc + c.fieldArea, 0);
        const avgHealth = crops.length > 0 ? Math.round(crops.reduce((acc, c) => acc + c.healthScore, 0) / crops.length) : 0;
        const totalYield = crops.reduce((acc, c) => acc + (c.expectedYield || 0), 0);
        return { totalArea, avgHealth, totalYield };
    }, [crops]);

    const handleAddCrop = (data: any) => {
        const newCrop: Crop = {
            id: `crop-${Date.now()}`,
            name: data.crop,
            fieldName: data.name,
            fieldArea: parseFloat(data.area),
            plantingDate: data.date,
            healthScore: 100,
            moistureLevel: 80,
            pestRisk: 'Low',
            currentStageIndex: 0,
            family: 'Unknown',
            idealClimate: 'Varied',
            imageUrl: 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/farm_cover.jpg',
            description: 'New Field',
            coordinates: { lat: 15.3647, lng: 75.1240 },
            stages: [
                { name: 'Sowing', duration: '1-5 days', description: 'Initial stage', tasks: ['Watering'], imageUrl: '' },
                { name: 'Vegetative', duration: '30 days', description: 'Growth', tasks: ['Fertilizing'], imageUrl: '' }
            ]
        };
        setCrops([...crops, newCrop]);
    };

    if (selectedCrop) {
        return <CropCycleDetailView crop={selectedCrop} onBack={() => setSelectedCrop(null)} />;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn p-4 pb-20">
            {/* Improved Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        Crop Monitoring
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Real-time health tracking for your harvest.</p>
                </div>
                <button 
                    onClick={() => setAddModalOpen(true)}
                    className="flex items-center px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                    <PlusIcon className="w-5 h-5 mr-2"/> Add Field
                </button>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Area</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalArea.toFixed(1)} <span className="text-sm font-medium text-gray-500">Acres</span></p>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Health</p>
                    <p className={`text-2xl font-black ${stats.avgHealth > 80 ? 'text-green-500' : 'text-yellow-500'}`}>{stats.avgHealth}%</p>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Yield Est.</p>
                    <p className="text-2xl font-black text-blue-500">{stats.totalYield.toFixed(1)} <span className="text-sm font-medium text-gray-500">Tonnes</span></p>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Fields</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{crops.length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-3 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search field name..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary text-gray-900 dark:text-white outline-none transition-all shadow-sm"
                    />
                </div>
                <div className="relative min-w-[180px]">
                    <select 
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary text-gray-900 dark:text-white outline-none cursor-pointer appearance-none font-bold shadow-sm"
                    >
                        <option value="All">All Crops</option>
                        <option value="Rice">Rice</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Tomato">Tomato</option>
                        <option value="Cotton">Cotton</option>
                    </select>
                </div>
            </div>

            {/* Crop Grid */}
            {filteredCrops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCrops.map(crop => (
                        <CropCycleCard key={crop.id} crop={crop} onSelect={setSelectedCrop} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-gray-50/50 dark:bg-slate-900/30 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <SproutIcon className="w-16 h-16 mx-auto mb-4 text-gray-300"/>
                    <h3 className="text-xl font-bold text-gray-500">No matching fields</h3>
                    <p className="text-gray-400 mt-1">Try a different search or add a new field.</p>
                </div>
            )}

            <AddFieldModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddCrop} />
        </div>
    );
};

export default CropMonitoring;
