
import React, { useState, useCallback, useEffect } from 'react';
import { getVetAnalysis } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Spinner from './Spinner';
import MarkdownRenderer from './MarkdownRenderer';
import { HeartIcon, UploadIcon, SparklesIcon, WifiOffIcon, DownloadIcon, CheckIcon, AlertTriangleIcon, ActivityIcon, PlusIcon, XIcon } from './icons';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const AIVetAssistant: React.FC = () => {
  const isOnline = useNetworkStatus();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  
  // New Structured Data State
  const [vitals, setVitals] = useState({
      species: 'Cow',
      age: '',
      weight: '',
      temperature: ''
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
        if(imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
    }
  }, [imagePreview]);

  const handleFile = useCallback((file: File | null) => {
    setError(null);
    setAnalysis(null);

    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('Image file is too large. Please select a file smaller than 4MB.');
        return;
      }
      setImageFile(file);
      if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    }
  }, [imagePreview]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] || null);
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        handleFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragEvents = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!isOnline) {
        setError('You are currently offline. AI analysis requires an internet connection.');
        return;
    }
    if (!imageFile || !query) {
      setError('Please upload an image and describe the symptoms.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const result = await getVetAnalysis(base64, mimeType, query, vitals);
      setAnalysis(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? `An error occurred: ${err.message}` : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, query, isOnline, vitals]);

  const handleReset = () => {
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setAnalysis(null);
    setError(null);
    setQuery('');
    setVitals({ species: 'Cow', age: '', weight: '', temperature: '' });
    setIsLoading(false);
  };

  const handleDownloadReport = () => {
    if (!analysis) return;

    const printWindow = window.open('', '', 'width=900,height=800');
    if (printWindow) {
        const reportContent = document.getElementById('vet-analysis-content')?.innerHTML;
        const html = `
            <html>
                <head>
                    <title>Raitha Mitra - Vet Clinical Record</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; max-width: 900px; margin: 0 auto; background: white; }
                        .header { border-bottom: 3px solid #dc2626; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
                        h1 { color: #dc2626; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; }
                        .patient-info { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 25px; }
                        .info-item label { display: block; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
                        .info-item span { font-weight: 600; font-size: 16px; }
                        .soap-note { font-size: 15px; line-height: 1.6; }
                        .image-preview { text-align: center; margin-bottom: 20px; border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; }
                        .image-preview img { max-height: 300px; }
                        .footer { margin-top: 50px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; }
                        .logo { font-size: 1.5em; font-weight: bold; display: flex; align-items: center; gap: 5px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">
                            <span style="color:#16a34a;">🌱</span> Raitha<span style="color:#16a34a;">Mitra</span> VetAI
                        </div>
                        <div style="text-align: right;">
                            <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
                            <strong>Ref ID:</strong> #${Math.floor(Math.random()*10000)}
                        </div>
                    </div>

                    <div class="patient-info">
                        <div class="info-item"><label>Species</label><span>${vitals.species}</span></div>
                        <div class="info-item"><label>Age</label><span>${vitals.age || 'N/A'}</span></div>
                        <div class="info-item"><label>Weight</label><span>${vitals.weight || 'N/A'}</span></div>
                        <div class="info-item"><label>Temp</label><span>${vitals.temperature || 'N/A'}</span></div>
                    </div>

                    ${imagePreview ? `
                        <div class="image-preview">
                            <img src="${imagePreview}" alt="Clinical Evidence" />
                        </div>
                    ` : ''}

                    <div class="soap-note">
                        ${reportContent}
                    </div>

                    <div class="footer">
                        Disclaimer: This record is generated by an Artificial Intelligence Scribe. It is intended to assist veterinary professionals and is NOT a definitive medical diagnosis.
                    </div>
                    <script>window.onload = function() { setTimeout(function() { window.print(); window.close(); }, 500); }</script>
                </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border-light dark:border-border-dark pb-4">
            <div>
                <h2 className="text-3xl font-extrabold text-text-light dark:text-text-dark flex items-center">
                    <HeartIcon className="w-8 h-8 text-red-500 mr-3" /> 
                    AI Vet Clinical Scribe
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Smart triage and SOAP note generation for livestock.</p>
            </div>
            {!isOnline && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-full font-bold text-sm flex items-center">
                    <WifiOffIcon className="w-4 h-4 mr-2"/> Offline Mode
                </div>
            )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
            
            {/* LEFT PANEL: INPUTS (The Exam Room) */}
            <div className="lg:col-span-5 space-y-6">
                
                {/* 1. Patient Vitals Card */}
                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-md border border-border-light dark:border-border-dark overflow-hidden">
                    <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                        <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center">
                            <ActivityIcon className="w-4 h-4 mr-2"/> Patient Vitals
                        </h3>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Species</label>
                            <select 
                                value={vitals.species} 
                                onChange={e => setVitals({...vitals, species: e.target.value})}
                                className="w-full p-2 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-md text-sm"
                            >
                                <option>Cow</option>
                                <option>Buffalo</option>
                                <option>Ox</option>
                                <option>Goat</option>
                                <option>Sheep</option>
                                <option>Poultry</option>
                                <option>Pig</option>
                                <option>Duck</option>
                                <option>Rabbit</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Age</label>
                            <input 
                                type="text" 
                                placeholder="e.g. 2 yrs" 
                                value={vitals.age} 
                                onChange={e => setVitals({...vitals, age: e.target.value})}
                                className="w-full p-2 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Weight (est)</label>
                            <input 
                                type="text" 
                                placeholder="e.g. 350 kg" 
                                value={vitals.weight} 
                                onChange={e => setVitals({...vitals, weight: e.target.value})}
                                className="w-full p-2 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Temp (F)</label>
                            <input 
                                type="text" 
                                placeholder="e.g. 102" 
                                value={vitals.temperature} 
                                onChange={e => setVitals({...vitals, temperature: e.target.value})}
                                className="w-full p-2 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-md text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Visual Evidence Card */}
                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-md border border-border-light dark:border-border-dark p-4">
                    <h3 className="font-bold mb-3 text-sm uppercase text-gray-500">Visual Evidence</h3>
                    {!imagePreview ? (
                        <div 
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragEvents}
                            onDragEnter={() => setIsDragging(true)}
                            onDragLeave={() => setIsDragging(false)}
                        >
                            <label htmlFor="vet-upload" className="cursor-pointer flex flex-col items-center">
                                <UploadIcon className="w-8 h-8 text-gray-400 mb-2"/>
                                <span className="text-sm font-semibold text-primary">Upload Photo</span>
                                <span className="text-xs text-gray-500 mt-1">or drag and drop</span>
                            </label>
                            <input id="vet-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </div>
                    ) : (
                        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                            <img src={imagePreview} alt="Evidence" className="w-full h-48 object-cover" />
                            <button 
                                onClick={() => { setImageFile(null); setImagePreview(null); }}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <XIcon className="w-4 h-4"/>
                            </button>
                        </div>
                    )}
                </div>

                {/* 3. Clinical Notes */}
                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-md border border-border-light dark:border-border-dark p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-sm uppercase text-gray-500">Clinical Notes</h3>
                    </div>
                    <textarea 
                        rows={4}
                        placeholder="Describe symptoms, duration, and behavior..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="w-full p-3 bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button 
                        onClick={handleReset}
                        className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors"
                    >
                        Clear
                    </button>
                    <button 
                        onClick={handleAnalyzeClick}
                        disabled={isLoading || !isOnline || !imageFile}
                        className="flex-grow py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                        {isLoading ? <Spinner /> : <><SparklesIcon className="w-5 h-5 mr-2"/> ⚡ Quick Assessment</>}
                    </button>
                </div>
            </div>

            {/* RIGHT PANEL: OUTPUT (The Clipboard) */}
            <div className="lg:col-span-7 h-full">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-border-light dark:border-border-dark h-full min-h-[600px] flex flex-col">
                    {/* Report Header */}
                    <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50 dark:bg-slate-800/50 rounded-t-xl">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Clinical Assessment</h3>
                            <p className="text-xs text-gray-500">AI-Generated Medical Record</p>
                        </div>
                        {analysis && (
                            <button 
                                onClick={handleDownloadReport}
                                className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                <DownloadIcon className="w-4 h-4 mr-2"/> PDF
                            </button>
                        )}
                    </div>

                    {/* Report Content */}
                    <div className="flex-grow p-6 overflow-y-auto">
                        {!analysis && !isLoading && !error && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                    <ActivityIcon className="w-10 h-10 opacity-50"/>
                                </div>
                                <p className="text-center max-w-xs">Complete the examination form on the left to generate a professional assessment.</p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="h-full flex flex-col items-center justify-center space-y-4">
                                <Spinner />
                                <p className="text-gray-500 animate-pulse">Consulting medical database...</p>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-center">
                                <AlertTriangleIcon className="w-8 h-8 mx-auto mb-2"/>
                                {error}
                            </div>
                        )}

                        {analysis && (
                            <div id="vet-analysis-content" className="prose dark:prose-invert max-w-none">
                                <MarkdownRenderer content={analysis} />
                            </div>
                        )}
                    </div>

                    {/* Report Footer */}
                    {analysis && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-t border-yellow-100 dark:border-yellow-900/30 rounded-b-xl flex items-start gap-3">
                            <AlertTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"/>
                            <p className="text-xs text-yellow-800 dark:text-yellow-400 leading-relaxed">
                                <strong>Legal Disclaimer:</strong> This report is generated by Artificial Intelligence for informational purposes only. It is not a substitute for professional veterinary diagnosis, treatment, or advice. Always consult a qualified veterinarian for medical decisions.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default AIVetAssistant;
