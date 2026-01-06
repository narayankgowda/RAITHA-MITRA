
import React, { useState } from 'react';
import { generateCropRotationPlan, RotationPlan, RotationCrop } from '../services/geminiService';
import Spinner from './Spinner';
import { RotateCcwIcon, SparklesIcon, WifiOffIcon, CalendarIcon, SproutIcon, CheckCircleIcon, ArrowRightIcon, LeafIcon, LayersIcon, ClockIcon } from './icons';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const CropRotationPlanner: React.FC = () => {
    const isOnline = useNetworkStatus();
    const [formData, setFormData] = useState({
        currentCrop: '',
        farmSize: '',
        soilType: 'Loam',
        season: 'Kharif'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [plan, setPlan] = useState<RotationPlan | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isOnline) {
            setError("You are currently offline. Plan generation requires an internet connection.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setPlan(null);
        try {
            const result = await generateCropRotationPlan(formData);
            setPlan(result);
        } catch (err: any) {
            setError(err.message || 'Failed to generate plan.');
        } finally {
            setIsLoading(false);
        }
    };

    const CropCard = ({ crop, index }: { crop: RotationCrop, index: number }) => (
        <div className="relative flex-shrink-0 w-72 bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            {/* Season Header */}
            <div className={`h-2 bg-gradient-to-r ${
                crop.season.includes('Kharif') ? 'from-green-400 to-green-600' : 
                crop.season.includes('Rabi') ? 'from-yellow-400 to-orange-500' : 
                'from-blue-400 to-cyan-500'
            }`}></div>
            
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {crop.season}
                    </div>
                    <span className="text-4xl font-black text-gray-200 dark:text-gray-700 absolute top-4 right-4 z-0 pointer-events-none opacity-50">0{index + 1}</span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">{crop.cropName}</h3>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <ClockIcon className="w-4 h-4 mr-1.5"/> {crop.duration}
                </div>

                <div className="space-y-3">
                    <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/30">
                        <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase mb-1 flex items-center">
                            <LeafIcon className="w-3 h-3 mr-1"/> Benefit
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{crop.benefit}</p>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase mb-1 flex items-center">
                            <LayersIcon className="w-3 h-3 mr-1"/> Why this?
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{crop.reason}"</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="text-center relative py-8">
                <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-3xl -z-10 transform -skew-y-1"></div>
                <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-card-dark rounded-full shadow-md mb-4 text-green-600 dark:text-green-400">
                    <RotateCcwIcon className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-extrabold text-text-light dark:text-text-dark">Scientific Crop Sequence Planner</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
                    Generate an optimized crop succession plan to break pest cycles and regenerate soil nutrients.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Panel */}
                <div className="lg:col-span-4">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-xl border border-border-light dark:border-border-dark sticky top-6">
                        <h3 className="font-bold text-xl mb-6 flex items-center text-text-light dark:text-text-dark">
                            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 text-sm">1</span>
                            Current Context
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Last Harvested Crop</label>
                                <div className="relative">
                                    <input type="text" name="currentCrop" value={formData.currentCrop} onChange={handleChange} placeholder="e.g., Rice" required className="w-full pl-10 py-3 rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                                    <SproutIcon className="absolute left-3 top-3.5 w-5 h-5 text-green-500"/>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Farm Size (Acres)</label>
                                <input type="number" name="farmSize" value={formData.farmSize} onChange={handleChange} placeholder="e.g., 5" required className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Soil Texture</label>
                                <select name="soilType" value={formData.soilType} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer">
                                    <option>Loam</option>
                                    <option>Clay</option>
                                    <option>Sandy</option>
                                    <option>Silt</option>
                                    <option>Peat</option>
                                    <option>Black Cotton</option>
                                    <option>Red Soil</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Upcoming Season</label>
                                <div className="relative">
                                    <select name="season" value={formData.season} onChange={handleChange} className="w-full pl-10 py-3 rounded-lg border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer">
                                        <option>Kharif (Monsoon)</option>
                                        <option>Rabi (Winter)</option>
                                        <option>Zaid (Summer)</option>
                                    </select>
                                    <CalendarIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"/>
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isLoading || !isOnline} 
                                className="w-full mt-4 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? <Spinner /> : <><SparklesIcon className="w-5 h-5 mr-2" /> Design Rotation Plan</>}
                            </button>
                            
                            {!isOnline && (
                                <p className="text-center text-red-500 text-xs font-medium flex items-center justify-center">
                                    <WifiOffIcon className="w-3 h-3 mr-1"/> Offline Mode
                                </p>
                            )}
                        </form>
                    </div>
                </div>

                {/* Output Panel */}
                <div className="lg:col-span-8">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-xl border border-red-200 dark:border-red-800 text-center mb-6">
                            {error}
                        </div>
                    )}

                    {!plan && !isLoading && !error && (
                        <div className="h-full flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center min-h-[400px]">
                            <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                <LeafIcon className="w-10 h-10 text-green-300 dark:text-green-700" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">Awaiting Farm Data</h3>
                            <p className="text-gray-400 mt-2 max-w-sm">
                                We'll generate a custom timeline of crops to maximize your soil's potential.
                            </p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full flex flex-col items-center justify-center p-12 bg-white dark:bg-card-dark rounded-2xl shadow-lg min-h-[400px]">
                            <Spinner />
                            <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
                                Calculating nutrient cycles and pest interactions...
                            </p>
                        </div>
                    )}

                    {plan && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                        <CheckCircleIcon className="w-6 h-6 mr-3 text-green-500" /> 
                                        {plan.planName}
                                    </h3>
                                    <button className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 print:hidden transition-colors" onClick={() => window.print()}>
                                        Export Plan
                                    </button>
                                </div>

                                <div className="overflow-x-auto pb-6 custom-scrollbar">
                                    <div className="flex gap-4 items-stretch min-w-max">
                                        {plan.crops.map((crop, idx) => (
                                            <React.Fragment key={idx}>
                                                <CropCard crop={crop} index={idx} />
                                                {idx < plan.crops.length - 1 && (
                                                    <div className="flex items-center justify-center opacity-30">
                                                        <ArrowRightIcon className="w-8 h-8 text-gray-400"/>
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-600 to-emerald-800 rounded-2xl p-8 text-white shadow-xl">
                                <h4 className="text-xl font-bold mb-4 flex items-center">
                                    <SparklesIcon className="w-6 h-6 mr-2 text-yellow-300"/> Soil Health Projection
                                </h4>
                                <p className="text-green-50 text-lg leading-relaxed font-medium">
                                    {plan.soilImprovementSummary}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CropRotationPlanner;
