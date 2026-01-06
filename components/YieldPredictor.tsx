
import React, { useState } from 'react';
import { predictCropYield, YieldPrediction } from '../services/geminiService';
import Spinner from './Spinner';
import { TargetIcon, SparklesIcon, WifiOffIcon, TrendingUpIcon, AlertTriangleIcon, CheckCircleIcon, MapPinIcon, DollarSignIcon, BarChart2Icon } from './icons';
import { useTranslation } from 'react-i18next';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const YieldPredictor: React.FC = () => {
    const { t } = useTranslation();
    const isOnline = useNetworkStatus();
    const [formData, setFormData] = useState({
        crop: '',
        area: '',
        soil: 'Loam',
        irrigation: 'Rainfed',
        variety: '',
        fertilizer: 'Standard NPK'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [prediction, setPrediction] = useState<YieldPrediction | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isOnline) {
            setError("You are currently offline. Prediction requires an internet connection.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setPrediction(null);
        try {
            const result = await predictCropYield(formData);
            setPrediction(result);
        } catch (err: any) {
            setError(err.message || 'Failed to predict yield.');
        } finally {
            setIsLoading(false);
        }
    };

    // Scenario Chart Component using pure CSS
    const ScenarioChart = ({ scenarios, unit }: { scenarios: YieldPrediction['scenarios'], unit: string }) => {
        const maxVal = Math.max(scenarios.pessimistic, scenarios.likely, scenarios.optimistic) * 1.2;
        
        const Bar = ({ value, label, color, height }: { value: number, label: string, color: string, height: number }) => (
            <div className="flex flex-col items-center flex-1 group">
                <div className="relative w-full bg-gray-100 dark:bg-slate-700 rounded-t-lg h-32 flex items-end justify-center overflow-hidden">
                    <div 
                        className={`w-full ${color} transition-all duration-1000 ease-out relative`} 
                        style={{ height: `${height}%` }}
                    >
                        <div className="absolute top-0 w-full h-1 bg-white/30"></div>
                    </div>
                    <span className="absolute bottom-2 font-bold text-gray-700 dark:text-white drop-shadow-md z-10">{value}</span>
                </div>
                <div className="mt-2 text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase">{label}</p>
                </div>
            </div>
        );

        return (
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-bold text-gray-500 mb-4 flex items-center">
                    <BarChart2Icon className="w-4 h-4 mr-2"/> Scenario Analysis ({unit})
                </h4>
                <div className="flex gap-4 items-end">
                    <Bar 
                        value={scenarios.pessimistic} 
                        label="Pessimistic" 
                        color="bg-red-400 dark:bg-red-500" 
                        height={(scenarios.pessimistic / maxVal) * 100} 
                    />
                    <Bar 
                        value={scenarios.likely} 
                        label="Likely" 
                        color="bg-blue-500 dark:bg-blue-600" 
                        height={(scenarios.likely / maxVal) * 100} 
                    />
                    <Bar 
                        value={scenarios.optimistic} 
                        label="Optimistic" 
                        color="bg-green-500 dark:bg-green-600" 
                        height={(scenarios.optimistic / maxVal) * 100} 
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-2 text-blue-600 dark:text-blue-400">
                    <TrendingUpIcon className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-text-light dark:text-text-dark">
                    Advanced Yield Predictor
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                    Estimate harvest potential and revenue using AI-driven scenario modeling.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Section */}
                <div className="lg:col-span-4 h-fit">
                    <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 border-b border-border-light dark:border-border-dark">
                            <h3 className="font-bold text-lg text-primary dark:text-primary-light flex items-center">
                                <TargetIcon className="w-5 h-5 mr-2"/> Farm Parameters
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Crop Details</label>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <input type="text" name="crop" value={formData.crop} onChange={handleInputChange} placeholder="Crop Name (e.g. Wheat)" required className="w-full pl-10 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm" />
                                        <SparklesIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/>
                                    </div>
                                    <input type="text" name="variety" value={formData.variety} onChange={handleInputChange} placeholder="Seed Variety (Optional)" className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Field Specs</label>
                                <div className="relative">
                                    <input type="number" name="area" value={formData.area} onChange={handleInputChange} placeholder="Area in Acres" required className="w-full pl-10 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm" />
                                    <MapPinIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Soil</label>
                                    <select name="soil" value={formData.soil} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark focus:ring-2 focus:ring-primary focus:outline-none text-sm">
                                        <option>Loam</option>
                                        <option>Clay</option>
                                        <option>Sandy</option>
                                        <option>Black Cotton</option>
                                        <option>Red Soil</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Irrigation</label>
                                    <select name="irrigation" value={formData.irrigation} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark focus:ring-2 focus:ring-primary focus:outline-none text-sm">
                                        <option>Rainfed</option>
                                        <option>Drip</option>
                                        <option>Canal</option>
                                        <option>Tube Well</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Fertilizer Inputs</label>
                                <input type="text" name="fertilizer" value={formData.fertilizer} onChange={handleInputChange} placeholder="e.g. Urea + DAP" className="w-full px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-input-light dark:bg-input-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm" />
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isLoading || !isOnline} 
                                className="w-full py-3.5 bg-gradient-to-r from-primary to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? <Spinner /> : 'Run Prediction Model'}
                            </button>
                            
                            {!isOnline && <p className="text-center text-xs text-red-500 flex items-center justify-center"><WifiOffIcon className="w-3 h-3 mr-1"/> Offline</p>}
                        </form>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-8">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 animate-slideUp">
                            <div className="flex">
                                <AlertTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
                                <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {!prediction && !isLoading && !error && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <TrendingUpIcon className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">Ready to Analyze</h3>
                            <p className="text-gray-400 max-w-sm mt-2">Enter your farm details to generate a comprehensive yield report.</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full flex flex-col items-center justify-center p-12">
                            <div className="relative">
                                <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <SparklesIcon className="w-10 h-10 text-primary animate-pulse"/>
                                </div>
                            </div>
                            <p className="mt-6 text-lg font-semibold text-gray-600 dark:text-gray-300 animate-pulse">Running agronomic simulations...</p>
                        </div>
                    )}

                    {prediction && (
                        <div className="space-y-6 animate-fadeIn">
                            
                            {/* Key Stats Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Revenue Card */}
                                <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSignIcon className="w-24 h-24"/></div>
                                    <p className="text-green-100 text-sm font-bold uppercase tracking-wider mb-1">Projected Revenue</p>
                                    <h3 className="text-4xl font-black tracking-tight">₹{prediction.estimatedRevenue}</h3>
                                    <p className="text-sm text-green-100 mt-2 opacity-90">Based on current market rates</p>
                                </div>

                                {/* Confidence Card */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase mb-1">Prediction Confidence</p>
                                        <div className="flex items-end gap-2">
                                            <h3 className="text-3xl font-black text-gray-900 dark:text-white">{prediction.confidence}</h3>
                                            <span className="text-sm text-gray-500 mb-1">Accuracy Score</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${prediction.confidence === 'High' ? 'bg-green-500' : prediction.confidence === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                            style={{ width: prediction.confidence === 'High' ? '85%' : prediction.confidence === 'Medium' ? '60%' : '30%' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts & Graphs */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <ScenarioChart scenarios={prediction.scenarios} unit={prediction.unit} />
                                
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase">Impact Factors</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-green-600 mb-2 flex items-center"><CheckCircleIcon className="w-3 h-3 mr-1"/> Positive Drivers</p>
                                            <div className="flex flex-wrap gap-2">
                                                {prediction.positiveFactors.map((f, i) => (
                                                    <span key={i} className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded border border-green-100 dark:border-green-800">{f}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-red-600 mb-2 flex items-center"><AlertTriangleIcon className="w-3 h-3 mr-1"/> Risk Factors</p>
                                            <div className="flex flex-wrap gap-2">
                                                {prediction.negativeFactors.map((f, i) => (
                                                    <span key={i} className="text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded border border-red-100 dark:border-red-800">{f}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30">
                                <h4 className="font-bold text-lg mb-4 text-blue-800 dark:text-blue-300 flex items-center">
                                    <SparklesIcon className="w-5 h-5 mr-2"/> Optimization Strategy
                                </h4>
                                <div className="space-y-3">
                                    {prediction.recommendations.map((rec, idx) => (
                                        <div key={idx} className="flex items-start p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-blue-100 dark:border-blue-800/50 shadow-sm">
                                            <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-full mr-3 text-blue-600 flex-shrink-0 mt-0.5">
                                                <TrendingUpIcon className="w-3 h-3" />
                                            </div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default YieldPredictor;
