import React, { useState, useCallback } from 'react';
import { analyzeSoilData, analyzeSoilReportImage, getFertilizerRecommendation } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Spinner from './Spinner';
import MarkdownRenderer from './MarkdownRenderer';
import { FlaskConicalIcon, UploadIcon, SparklesIcon, CalculatorIcon } from './icons';
import { useTranslation } from 'react-i18next';


type InputMode = 'manual' | 'upload';

const SoilAnalysis: React.FC = () => {
    const { t } = useTranslation();
    const [inputMode, setInputMode] = useState<InputMode>('manual');
    const [formData, setFormData] = useState({
        ph: '', ec: '', oc: '', n: '', p: '', k: '', zn: '', fe: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);

    // State for Fertilizer Calculator
    const [fertCrop, setFertCrop] = useState('');
    const [fertArea, setFertArea] = useState('');
    const [fertYield, setFertYield] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);
    const [fertError, setFertError] = useState<string | null>(null);
    const [fertRecommendation, setFertRecommendation] = useState<string | null>(null);


    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
            if (!supportedMimeTypes.includes(file.type)) {
                setError('Unsupported image format. Please use JPG, PNG, WEBP, HEIC, or HEIF.');
                return;
            }
            if (file.size > 4 * 1024 * 1024) {
                setError('Image file is too large. Please select a file smaller than 4MB.');
                return;
            }
            setImageFile(file);
            setAnalysis(null);
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleAnalyzeClick = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        // Reset calculator when new analysis is done
        setFertRecommendation(null); 
        setFertError(null);

        try {
            let result = '';
            if (inputMode === 'manual') {
                if (Object.values(formData).some(v => v === '')) {
                    setError('Please fill in all soil parameter fields.');
                    setIsLoading(false);
                    return;
                }
                result = await analyzeSoilData(formData);
            } else { // upload mode
                if (!imageFile) {
                    setError('Please select an image of your soil report first.');
                    setIsLoading(false);
                    return;
                }
                const { base64, mimeType } = await fileToBase64(imageFile);
                result = await analyzeSoilReportImage(base64, mimeType);
            }
            setAnalysis(result);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [inputMode, formData, imageFile]);
    
    const handleCalculateFertilizer = async () => {
        if (!analysis || !fertCrop || !fertArea || !fertYield) {
            setFertError('Please fill in all calculator fields.');
            return;
        }
        setIsCalculating(true);
        setFertError(null);
        setFertRecommendation(null);
        try {
            const result = await getFertilizerRecommendation(analysis, fertCrop, parseFloat(fertArea), parseFloat(fertYield));
            setFertRecommendation(result);
        } catch (err) {
            setFertError(err instanceof Error ? err.message : 'Failed to calculate recommendations.');
        } finally {
            setIsCalculating(false);
        }
    };


    const handleReset = () => {
        setFormData({ ph: '', ec: '', oc: '', n: '', p: '', k: '', zn: '', fe: '' });
        setImageFile(null);
        setImagePreview(null);
        setAnalysis(null);
        setError(null);
        setIsLoading(false);
        setFertCrop('');
        setFertArea('');
        setFertYield('');
        setFertRecommendation(null);
        setFertError(null);
        setIsCalculating(false);
    };

    const renderManualForm = () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {Object.keys(formData).map(key => (
                <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">{key}</label>
                    <input type="number" name={key} id={key} value={formData[key as keyof typeof formData]} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
            ))}
        </div>
    );

    const renderUploadForm = () => (
        <div className="text-center p-4 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg">
            {!imagePreview ? (
                <label htmlFor="soil-report-upload" className="cursor-pointer group">
                    <div className="mb-2 text-primary dark:text-primary-light mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                        <UploadIcon className="w-8 h-8 text-primary dark:text-primary-light" />
                    </div>
                    <h3 className="text-lg font-semibold">Upload Soil Report</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Click to select an image file</p>
                </label>
            ) : (
                <div className="flex flex-col items-center">
                    <img src={imagePreview} alt="Soil report preview" className="max-h-40 rounded-lg shadow-md mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{imageFile?.name}</p>
                </div>
            )}
            <input id="soil-report-upload" type="file" accept="image/jpeg, image/png, image/webp, image/heic, image/heif" className="hidden" onChange={handleImageChange} />
        </div>
    );
    
    const renderFertilizerCalculator = () => (
        <div className="mt-8 pt-6 border-t border-border-light dark:border-border-dark">
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">{t('dashboard.farmer.soilAnalysisPage.calculatorTitle')}</h3>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium">{t('dashboard.farmer.soilAnalysisPage.cropTypeLabel')}</label>
                    <input type="text" value={fertCrop} onChange={(e) => setFertCrop(e.target.value)} placeholder="e.g., Wheat" className="mt-1 block w-full input-style" />
                </div>
                <div>
                    <label className="block text-sm font-medium">{t('dashboard.farmer.soilAnalysisPage.farmAreaLabel')}</label>
                    <input type="number" value={fertArea} onChange={(e) => setFertArea(e.target.value)} placeholder="e.g., 5" className="mt-1 block w-full input-style" />
                </div>
                 <div>
                    <label className="block text-sm font-medium">{t('dashboard.farmer.soilAnalysisPage.targetYieldLabel')}</label>
                    <input type="number" value={fertYield} onChange={(e) => setFertYield(e.target.value)} placeholder="e.g., 20" className="mt-1 block w-full input-style" />
                </div>
            </div>
            <div className="text-center mt-4">
                 <button onClick={handleCalculateFertilizer} disabled={isCalculating} className="flex items-center justify-center mx-auto px-6 py-3 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:bg-gray-400">
                    <CalculatorIcon className="w-5 h-5 mr-2" />
                    {isCalculating ? 'Calculating...' : t('dashboard.farmer.soilAnalysisPage.calculateButton')}
                 </button>
            </div>
            
             <div className="mt-4">
                {isCalculating && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Spinner />
                        <p className="mt-4 text-gray-500 dark:text-gray-400">AI is calculating your fertilizer plan...</p>
                    </div>
                )}
                {fertError && <div className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">{fertError}</div>}
                {fertRecommendation && <MarkdownRenderer content={fertRecommendation} />}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col space-y-6">
            <div>
                 <div className="flex justify-center p-1 mb-4 bg-gray-200 dark:bg-slate-800 rounded-lg shadow-inner">
                    <button onClick={() => setInputMode('manual')} className={`px-4 py-1.5 text-sm font-semibold rounded-md flex-1 transition-all duration-300 focus:outline-none ${inputMode === 'manual' ? 'bg-white dark:bg-slate-700 text-primary dark:text-primary-light shadow-md' : 'text-gray-600 dark:text-gray-300'}`}>Enter Data Manually</button>
                    <button onClick={() => setInputMode('upload')} className={`px-4 py-1.5 text-sm font-semibold rounded-md flex-1 transition-all duration-300 focus:outline-none ${inputMode === 'upload' ? 'bg-white dark:bg-slate-700 text-primary dark:text-primary-light shadow-md' : 'text-gray-600 dark:text-gray-300'}`}>Upload Report Image</button>
                </div>
                {inputMode === 'manual' ? renderManualForm() : renderUploadForm()}
            </div>
            
             <div className="flex justify-center space-x-4">
                <button
                    onClick={handleAnalyzeClick}
                    disabled={isLoading}
                    className="flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:bg-gray-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Analyzing...' : 'Analyze Soil'}
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-text-light dark:text-text-dark font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-slate-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                >
                    Clear
                </button>
            </div>
            
            <div>
                <h3 className="text-2xl font-bold mb-2 text-center text-gray-800 dark:text-gray-200">Analysis Result</h3>
                <div className="w-full min-h-[250px] bg-background-light dark:bg-background-dark rounded-lg p-4 border border-border-light dark:border-border-dark overflow-y-auto">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Spinner />
                            <p className="mt-4 text-gray-500 dark:text-gray-400">AI is analyzing soil data...</p>
                        </div>
                    )}
                    {error && <div className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>}
                    {analysis && <MarkdownRenderer content={analysis} />}
                    {!isLoading && !analysis && !error && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                           <FlaskConicalIcon className="w-12 h-12 mb-4" />
                            <p>Soil analysis will appear here after you click "Analyze Soil".</p>
                        </div>
                    )}
                </div>
            </div>
            
            {analysis && !isLoading && renderFertilizerCalculator()}
            
            <style>{`.input-style {padding: 0.5rem 0.75rem; background-color: white; border: 1px solid #e2e8f0; border-radius: 0.375rem;} .dark .input-style {background-color: #334155; border-color: #475569;} .input-style:focus {outline: 2px solid transparent; outline-offset: 2px; --tw-ring-color: #22c55e; border-color: #22c55e;}`}</style>
        </div>
    );
};

export default SoilAnalysis;