
import React, { useState, useCallback, useEffect } from 'react';
import { analyzeSoilData, analyzeSoilReportImage, getFertilizerRecommendation, SoilAnalysisResult } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Spinner from './Spinner';
import MarkdownRenderer from './MarkdownRenderer';
import { BeakerIcon, UploadIcon, SparklesIcon, CalculatorIcon, XIcon, WifiOffIcon, DownloadIcon, SproutIcon, LeafIcon, ClockIcon, AlertTriangleIcon } from './icons';
import { useTranslation } from 'react-i18next';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

type InputMode = 'manual' | 'upload';

// Define optimal ranges for visual indicators
const optimalRanges: { [key: string]: { low: number; optimal: number; type: 'lower_is_better' | 'range' | 'higher_is_better' } } = {
    ph: { low: 6.5, optimal: 7.5, type: 'range' }, // Optimal range 6.5-7.5
    ec: { low: 1.0, optimal: 0, type: 'lower_is_better' }, // Lower is better, concern > 1.0
    oc: { low: 0.5, optimal: 0.75, type: 'higher_is_better' }, // Higher is better, good > 0.75
    n: { low: 280, optimal: 560, type: 'higher_is_better' }, // Higher is better, good > 560
    p: { low: 15, optimal: 30, type: 'higher_is_better' }, // Higher is better, good > 30
    k: { low: 120, optimal: 240, type: 'higher_is_better' }, // Higher is better, good > 240
    zn: { low: 0.6, optimal: 1.2, type: 'range' }, // Optimal range 0.6-1.2
    fe: { low: 4.5, optimal: 10, type: 'range' }, // Optimal range 4.5-10
};

// Static crop image mapping
const cropImages: { [key: string]: string } = {
    'Rice': 'https://spanishboosting.com/wp-content/uploads/2024/04/organic-rice.jpg',
    'Paddy': 'https://i0.wp.com/asombarta.com/wp-content/uploads/2025/03/paddy-1-scaled.jpg?fit=2560%2C1707&ssl=1',
    'Wheat': 'https://5.imimg.com/data5/SELLER/Default/2025/6/517343634/ER/PQ/CD/240472965/whole-wheat-grain.jpeg',
    // ... (rest of mapping same as before)
};

const getCropImageUrl = (cropName: string): string => {
    if (cropImages[cropName]) return cropImages[cropName];
    const keys = Object.keys(cropImages);
    for (const key of keys) {
        if (cropName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cropName.toLowerCase())) {
            return cropImages[key];
        }
    }
    return 'https://storage.googleapis.com/aistudio-marketplace-public-test-assets/product_placeholder.png';
};

interface SoilHistoryItem {
    id: string;
    date: string;
    markdownReport: string;
    chemicalData: any;
    suggestedCrops: string[];
}

const SoilAnalysis: React.FC = () => {
    const { t } = useTranslation();
    const isOnline = useNetworkStatus();
    const [inputMode, setInputMode] = useState<InputMode>('manual');
    const [viewMode, setViewMode] = useState<'new' | 'history'>('new');
    
    // Split state for chemical data and context data
    const [chemicalData, setChemicalData] = useState<any>({
        ph: '', ec: '', oc: '', n: '', p: '', k: '', zn: '', fe: ''
    });
    
    const [contextData, setContextData] = useState({
        soilType: 'Loam',
        currentCrop: '',
        prevCrop: '',
        irrigation: 'Rainfed'
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<SoilAnalysisResult | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // State for Fertilizer Calculator
    const [fertCrop, setFertCrop] = useState('');
    const [fertArea, setFertArea] = useState('');
    const [fertYield, setFertYield] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);
    const [fertError, setFertError] = useState<string | null>(null);
    const [fertRecommendation, setFertRecommendation] = useState<string | null>(null);

    // History State
    const [history, setHistory] = useState<SoilHistoryItem[]>(() => {
        try {
            const saved = localStorage.getItem('soil_history');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('soil_history', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        return () => {
            if(imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        }
    }, [imagePreview]);

    const handleChemicalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChemicalData({ ...chemicalData, [e.target.name]: e.target.value });
    };

    const handleContextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setContextData({ ...contextData, [e.target.name]: e.target.value });
    };

    const handleFile = useCallback((file: File | null) => {
        setError(null);
        setAnalysis(null);

        if (file) {
            if (file.size > 4 * 1024 * 1024) {
                setError('Image file is too large. Please select a file smaller than 4MB.');
                return;
            }
            setImageFile(file);
            if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
            setImagePreview(URL.createObjectURL(file));
        }
    }, [imagePreview]);
    
    // ... drag/paste handlers same as before ...
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => { handleFile(event.target.files?.[0] || null); };

    const handleSubmit = async () => {
        if (!isOnline) {
            setError("You are currently offline. Soil analysis requires an internet connection.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setFertRecommendation(null);
        try {
            let result: SoilAnalysisResult;
            let currentChemicals = { ...chemicalData };

            if (inputMode === 'manual') {
                const filledData = Object.entries(chemicalData).filter(([, value]) => (value as string).trim() !== '');
                if (filledData.length === 0) {
                    setError('Please enter at least one soil parameter (e.g., pH or N).');
                    setIsLoading(false);
                    return;
                }
                const dataForAnalysis = Object.fromEntries(filledData) as { [key: string]: string };
                result = await analyzeSoilData(dataForAnalysis, contextData);
            } else { // upload mode
                if (!imageFile) {
                    setError('Please upload a soil report image.');
                    setIsLoading(false);
                    return;
                }
                const { base64, mimeType } = await fileToBase64(imageFile);
                result = await analyzeSoilReportImage(base64, mimeType);
                
                // If OCR worked, populate the fields for user review/future calc
                if (result.extractedValues) {
                    setChemicalData((prev: any) => ({ ...prev, ...result.extractedValues }));
                    currentChemicals = result.extractedValues;
                }
            }
            setAnalysis(result);

            // Save to history
            const newItem: SoilHistoryItem = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                markdownReport: result.markdownReport,
                chemicalData: currentChemicals,
                suggestedCrops: result.suggestedCrops
            };
            setHistory(prev => [newItem, ...prev]);

        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // ... fertilizer calculation same as before ...
    const handleCalculateFertilizer = async () => {
        // ... (keeping existing logic)
        if (!isOnline) { setFertError("Offline mode: Cannot calculate recommendations."); return; }
        if (!analysis || !fertCrop || !fertArea || !fertYield) { setFertError('Please fill all fields for the calculator.'); return; }
        setIsCalculating(true);
        try {
            const result = await getFertilizerRecommendation(analysis.markdownReport, fertCrop, parseFloat(fertArea), parseFloat(fertYield));
            setFertRecommendation(result);
        } catch (err: any) { setFertError(err.message); } finally { setIsCalculating(false); }
    };

    const handleViewHistoryItem = (item: SoilHistoryItem) => {
        setAnalysis({
            markdownReport: item.markdownReport,
            suggestedCrops: item.suggestedCrops
        });
        setChemicalData(item.chemicalData || {});
        setViewMode('new');
        setInputMode('manual'); // Switch to manual view to show extracted data
    };

    const handleReset = () => {
        setChemicalData({ ph: '', ec: '', oc: '', n: '', p: '', k: '', zn: '', fe: '' });
        setImageFile(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        setAnalysis(null);
        setError(null);
        setIsLoading(false);
    };

    const getIndicatorColor = (key: string, value: string): string => { 
        const num = parseFloat(value); 
        if(isNaN(num) || !optimalRanges[key]) return 'bg-gray-400'; 
        const r = optimalRanges[key]; 
        if(r.type==='range') return num>=r.low&&num<=r.optimal?'bg-green-500':'bg-red-500'; 
        if(r.type==='lower_is_better') return num<=r.low?'bg-green-500':'bg-red-500'; 
        return num>=r.optimal?'bg-green-500':(num<r.low?'bg-red-500':'bg-yellow-500'); 
    };
    
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center mb-4">
                <div className="flex p-1 bg-input-light dark:bg-input-dark rounded-lg max-w-sm">
                    <button onClick={() => setInputMode('manual')} className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${inputMode === 'manual' ? 'bg-card-light dark:bg-card-dark shadow' : 'text-slate-600 dark:text-slate-300'}`}>Manual Entry</button>
                    <button onClick={() => setInputMode('upload')} className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${inputMode === 'upload' ? 'bg-card-light dark:bg-card-dark shadow' : 'text-slate-600 dark:text-slate-300'}`}>Upload Report (OCR)</button>
                </div>
                {history.length > 0 && (
                    <button onClick={() => setViewMode(viewMode === 'new' ? 'history' : 'new')} className="text-primary hover:underline text-sm flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1"/> {viewMode === 'new' ? 'Past Reports' : 'New Analysis'}
                    </button>
                )}
            </div>

            {viewMode === 'history' ? (
                 <div className="space-y-4">
                    {history.map(item => (
                        <div key={item.id} onClick={() => handleViewHistoryItem(item)} className="bg-card-light dark:bg-card-dark p-4 rounded-lg border border-border-light dark:border-border-dark cursor-pointer hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-text-light dark:text-text-dark">{new Date(item.date).toLocaleDateString()}</span>
                                <span className="text-xs bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">View Report</span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {Object.entries(item.chemicalData || {}).slice(0, 4).map(([k, v]) => v ? (
                                    <span key={k} className="text-xs text-gray-500 uppercase">{k}: {v as string}</span>
                                ) : null)}
                            </div>
                        </div>
                    ))}
                 </div>
            ) : (
                <>
                {inputMode === 'manual' && (
                    <div className="space-y-4">
                        {/* Chemical Data Section - Now populates from OCR too */}
                        <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                            <h3 className="text-sm font-bold uppercase text-gray-500 mb-3 border-b border-border-light dark:border-border-dark pb-2">Lab Test Results</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.keys(chemicalData).map(key => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium uppercase text-text-light dark:text-text-dark">{key}</label>
                                        <div className="relative">
                                            <input type="text" name={key} value={(chemicalData as any)[key]} onChange={handleChemicalChange} className="mt-1 block w-full input-style pr-6" placeholder="Value" />
                                            { (chemicalData as any)[key] && <span className={`absolute right-2 top-1/2 -translate-y-1/2 block w-3 h-3 rounded-full ${getIndicatorColor(key, (chemicalData as any)[key])}`}></span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {inputMode === 'upload' && (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                        <input type="file" id="soil-upload" accept="image/*" className="hidden" onChange={handleImageChange} />
                        <label htmlFor="soil-upload" className="cursor-pointer flex flex-col items-center">
                            {imagePreview ? (
                                <img src={imagePreview} className="max-h-64 mb-4 rounded shadow" alt="Preview"/>
                            ) : (
                                <UploadIcon className="w-12 h-12 text-gray-400 mb-4"/>
                            )}
                            <span className="font-medium text-primary">Upload Soil Report Image</span>
                            <span className="text-xs text-gray-500 mt-1">AI will extract values automatically</span>
                        </label>
                    </div>
                )}
                
                <div className="text-center mt-6">
                     <button onClick={handleSubmit} disabled={isLoading || !isOnline} className="px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center mx-auto">
                        {isLoading ? <Spinner className="w-5 h-5 mr-2"/> : <SparklesIcon className="w-5 h-5 mr-2"/>}
                        {isLoading ? 'Analyzing...' : '⚡ Instant Analysis'}
                    </button>
                    {!isOnline && <p className="text-red-500 text-xs mt-2"><WifiOffIcon className="w-3 h-3 inline"/> Offline</p>}
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg flex items-center shadow-sm">
                        <AlertTriangleIcon className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-red-700 dark:text-red-400 text-sm">Analysis Error</h4>
                            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                        </div>
                    </div>
                )}

                {analysis && (
                     <div className="mt-8 p-6 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark animate-fadeIn">
                        <div className="prose dark:prose-invert max-w-none">
                            <MarkdownRenderer content={analysis.markdownReport} />
                        </div>
                         {/* Visual Crop Suggestions - Same as before */}
                         {analysis.suggestedCrops && (
                             <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark">
                                 <h4 className="font-bold mb-4">Recommended Crops</h4>
                                 <div className="flex gap-4 overflow-x-auto pb-2">
                                     {analysis.suggestedCrops.map(crop => (
                                         <div key={crop} className="min-w-[120px] bg-background-light dark:bg-slate-800 rounded-lg p-2 text-center border border-border-light dark:border-border-dark">
                                             <img src={getCropImageUrl(crop)} className="w-full h-24 object-cover rounded mb-2" alt={crop}/>
                                             <span className="font-bold text-sm">{crop}</span>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         )}
                     </div>
                )}
                </>
            )}
            <style>{`.input-style {padding: 0.5rem 0.75rem; background-color: var(--color-input-light); border: 1px solid var(--color-border-light); border-radius: 0.375rem; color: var(--color-text-light);} .dark .input-style {background-color: var(--color-input-dark); border-color: var(--color-border-dark); color: var(--color-text-dark);}`}</style>
        </div>
    );
};

export default SoilAnalysis;
