
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { analyzeCropImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Spinner from './Spinner';
import MarkdownRenderer from './MarkdownRenderer';
import { BugPlayIcon, UploadIcon, SparklesIcon, TargetIcon, AlertTriangleIcon, CheckCircleIcon, InfoIcon, SearchIcon, WifiOffIcon, DownloadIcon, XIcon, PlusIcon, ClockIcon, RefreshCwIcon } from './icons';
import { commonPestsAndDiseases } from '../data/pestAndDiseaseData';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface PestAnalysisHistoryItem {
    id: string;
    date: string;
    image: string; // Base64 of main image
    diagnosis: string;
    confidence: string;
    report: string;
}

const PestDetector: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ text: string; confidence: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const isOnline = useNetworkStatus();

  // History State
  const [history, setHistory] = useState<PestAnalysisHistoryItem[]>(() => {
      try {
          const saved = localStorage.getItem('pest_history');
          return saved ? JSON.parse(saved) : [];
      } catch { return []; }
  });
  const [viewMode, setViewMode] = useState<'new' | 'history'>('new');

  const [pestSearchTerm, setPestSearchTerm] = useState('');
  const location = ''; 

  useEffect(() => {
    localStorage.setItem('pest_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    return () => {
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
    }
  }, [imagePreviews]);

  const startAnalysis = useCallback(async () => {
    if (!isOnline) {
        setError("You are currently offline. AI analysis requires an internet connection.");
        return;
    }
    if (imageFiles.length === 0) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const processedImages = await Promise.all(imageFiles.map(file => fileToBase64(file)));
      const result = await analyzeCropImage(processedImages, location);
      setAnalysisResult(result);
      
      // Save to history
      const newHistoryItem: PestAnalysisHistoryItem = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          image: processedImages[0].base64,
          diagnosis: "AI Analysis", 
          confidence: result.confidence,
          report: result.text
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFiles, location, isOnline]);

  const handleFiles = useCallback((files: FileList | null) => {
    setError(null);
    setAnalysisResult(null);
    setViewMode('new');

    if (files && files.length > 0) {
        const newFiles: File[] = [];
        const newPreviews: string[] = [];
        const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!supportedMimeTypes.includes(file.type)) {
                setError('Unsupported image format. Please use JPG, PNG, WEBP, HEIC, or HEIF.');
                continue;
            }
            if (file.size > 8 * 1024 * 1024) { 
                setError(`File ${file.name} is too large. Limit 8MB.`);
                continue;
            }
            newFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
        }
      
      setImageFiles(prev => [...prev, ...newFiles]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  }, []);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const removeImage = (index: number) => {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => {
          const newPreviews = prev.filter((_, i) => i !== index);
          URL.revokeObjectURL(prev[index]);
          return newPreviews;
      });
  };

  const handleDrag = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setIsDragging(true);
  }, []);
  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);
  
  const handleReset = () => {
    setImageFiles([]);
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

  const handleViewHistoryItem = (item: PestAnalysisHistoryItem) => {
      setAnalysisResult({
          text: item.report,
          confidence: item.confidence
      });
      setImagePreviews([`data:image/jpeg;base64,${item.image}`]);
      setImageFiles([]); 
      setViewMode('new');
  };

  // --- Render Components ---

  const ScanningAnimation = () => (
      <div className="absolute inset-0 z-20 pointer-events-none rounded-xl overflow-hidden">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent absolute top-0 animate-scan shadow-[0_0_15px_2px_rgba(74,222,128,0.6)]"></div>
          <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg bg-black/60 px-6 py-3 rounded-full backdrop-blur-md flex items-center shadow-xl border border-white/20">
              <Spinner />
              <span className="ml-3 tracking-wide">AI Analyzing...</span>
          </div>
          <style>{`
            @keyframes scan {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
            .animate-scan { animation: scan 1s linear infinite; }
          `}</style>
      </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn" id="pest-detector-container">
      
      {/* Header Section */}
      <div className="text-center space-y-3 pb-4">
          <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-2 text-red-600 dark:text-red-400">
              <BugPlayIcon className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Pest & Disease Detector
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Upload photos of affected crops. Our AI will diagnose the issue and suggest treatments instantly.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500 mt-2">
                {!isOnline && (
                    <span className="flex items-center px-3 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold border border-red-200 dark:border-red-800">
                        <WifiOffIcon className="w-3 h-3 mr-1"/> Offline Mode
                    </span>
                )}
                {history.length > 0 && (
                    <button onClick={() => setViewMode(viewMode === 'new' ? 'history' : 'new')} className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-primary font-semibold flex items-center transition-colors">
                        <ClockIcon className="w-4 h-4 mr-1.5"/> {viewMode === 'new' ? 'View History' : 'New Analysis'}
                    </button>
                )}
          </div>
      </div>

      {viewMode === 'history' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {history.map(item => (
                  <div key={item.id} onClick={() => handleViewHistoryItem(item)} className="bg-card-light dark:bg-card-dark rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-all border border-border-light dark:border-border-dark overflow-hidden group transform hover:-translate-y-1">
                      <div className="h-48 overflow-hidden relative">
                          <img src={`data:image/jpeg;base64,${item.image}`} alt="History" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-mono">
                              {new Date(item.date).toLocaleDateString()}
                          </div>
                      </div>
                      <div className="p-4">
                          <div className="flex justify-between items-center mb-2">
                              <h4 className="font-bold text-gray-900 dark:text-white">Diagnosis</h4>
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${item.confidence === 'High' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                  {item.confidence} Conf.
                              </span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2">Click to view full report</p>
                      </div>
                  </div>
              ))}
          </div>
      ) : (
        <>
        {/* Main Analysis Section */}
        {!analysisResult ? (
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative transition-all duration-300">
              
              {imagePreviews.length > 0 ? (
                  // Preview & Action Mode
                  <div className="relative min-h-[400px] bg-gray-50 dark:bg-black/20 flex flex-col items-center justify-center p-8">
                      <div className="flex gap-6 overflow-x-auto max-w-full p-4 snap-x justify-center">
                          {imagePreviews.map((src, index) => (
                              <div key={index} className="relative flex-shrink-0 w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700 snap-center group">
                                  <img src={src} alt={`Crop Preview ${index + 1}`} className="w-full h-full object-cover" />
                                  <button onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600">
                                      <XIcon className="w-4 h-4"/>
                                  </button>
                                  {isLoading && index === 0 && <ScanningAnimation />}
                              </div>
                          ))}
                          <div className="flex-shrink-0 w-64 h-64 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors bg-white dark:bg-transparent" onClick={() => document.getElementById('file-upload-add')?.click()}>
                              <div className="flex flex-col items-center text-gray-400 hover:text-primary transition-colors">
                                  <PlusIcon className="w-10 h-10 mb-2"/>
                                  <span className="text-sm font-bold">Add Another</span>
                              </div>
                              <input id="file-upload-add" type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                          </div>
                      </div>
                      
                      {!isLoading && (
                          <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-lg">
                              {error && (
                                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm w-full animate-slideUp">
                                      <div className="flex items-center">
                                          <AlertTriangleIcon className="w-6 h-6 text-red-500 mr-3 flex-shrink-0"/>
                                          <div>
                                              <p className="text-red-700 dark:text-red-400 font-bold">Analysis Failed</p>
                                              <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                                          </div>
                                      </div>
                                      <button 
                                          onClick={startAnalysis}
                                          className="mt-3 text-sm font-bold text-red-700 dark:text-red-400 hover:underline flex items-center"
                                      >
                                          <RefreshCwIcon className="w-3 h-3 mr-1"/> Try Again
                                      </button>
                                  </div>
                              )}

                              <div className="flex flex-wrap gap-4 justify-center w-full">
                                  {isOnline ? (
                                    <button 
                                        onClick={startAnalysis}
                                        className="flex-1 min-w-[200px] flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-green-700 hover:from-primary-dark hover:to-green-800 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-95"
                                    >
                                        <SparklesIcon className="w-6 h-6 mr-2 animate-pulse" /> ⚡ Instant Diagnosis
                                    </button>
                                  ) : (
                                    <div className="text-center w-full">
                                        <button disabled className="flex items-center justify-center px-8 py-4 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold rounded-xl cursor-not-allowed w-full">
                                            <WifiOffIcon className="w-5 h-5 mr-2" /> Connect to Internet
                                        </button>
                                    </div>
                                  )}
                                  <button 
                                      onClick={handleReset}
                                      className="px-6 py-4 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl shadow-md hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-200 dark:border-gray-600 transition-all"
                                  >
                                      Clear
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
              ) : (
                  // Upload Mode
                  <div 
                      onDrop={handleDrop} onDragOver={handleDrag} onDragEnter={handleDragIn} onDragLeave={handleDragOut}
                      className={`p-16 md:p-24 text-center transition-all duration-300 cursor-pointer group ${isDragging ? 'bg-primary/5 border-primary scale-[1.02]' : 'hover:bg-gray-50 dark:hover:bg-slate-900/50'}`}
                  >
                      <input id="file-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center relative z-10">
                          <div className={`w-32 h-32 mb-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isDragging ? 'bg-primary text-white scale-110 rotate-12' : 'bg-gradient-to-br from-green-100 to-green-50 dark:from-slate-800 dark:to-slate-700 text-primary dark:text-primary-light group-hover:scale-110'}`}>
                              <UploadIcon className="w-14 h-14" />
                          </div>
                          <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Upload Crop Image</h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto text-lg leading-relaxed">
                              Drag & drop or click to upload photos of leaves, fruits, or stems.
                          </p>
                          <div className="flex gap-6 text-xs text-gray-400 font-bold uppercase tracking-widest bg-gray-100 dark:bg-slate-800 px-6 py-3 rounded-full">
                              <span className="flex items-center"><TargetIcon className="w-4 h-4 mr-2 text-green-500"/> High Accuracy</span>
                              <span className="flex items-center"><CheckCircleIcon className="w-4 h-4 mr-2 text-blue-500"/> Instant Results</span>
                          </div>
                      </label>
                  </div>
              )}
          </div>
        ) : (
          // Analysis Results View
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
              {/* Left Column: Image & Actions */}
              <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white dark:bg-[#1e293b] p-5 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                              <TargetIcon className="w-5 h-5 mr-2 text-red-500"/> Analyzed Image
                          </h3>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase border ${
                              analysisResult.confidence?.toLowerCase() === 'high' ? 'bg-green-50 text-green-700 border-green-200' :
                              analysisResult.confidence?.toLowerCase() === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              'bg-red-50 text-red-700 border-red-200'
                          }`}>
                              {analysisResult.confidence} Confidence
                          </span>
                      </div>
                      <div className="rounded-2xl overflow-hidden shadow-inner relative group border border-gray-100 dark:border-gray-700">
                          {/* Display the original image since AI annotation is disabled for speed */}
                          <img 
                              src={imagePreviews[0]} 
                              alt="Analyzed" 
                              className="w-full h-auto object-cover" 
                          />
                      </div>
                  </div>

                  <div className="flex flex-col gap-3">
                      <button 
                          onClick={() => window.print()}
                          className="w-full flex items-center justify-center px-4 py-3.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
                      >
                          <DownloadIcon className="w-5 h-5 mr-2"/> Download Report
                      </button>
                      <button 
                          onClick={handleReset}
                          className="w-full px-4 py-3.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all"
                      >
                          Analyze New Image
                      </button>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 p-5 rounded-2xl border border-yellow-100 dark:border-yellow-900/30">
                      <h4 className="text-yellow-800 dark:text-yellow-500 font-bold text-sm mb-2 flex items-center">
                          <AlertTriangleIcon className="w-5 h-5 mr-2"/> Disclaimer
                      </h4>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400 leading-relaxed font-medium opacity-90">
                          This diagnosis is AI-generated. While accurate, verify with an expert before applying chemical treatments.
                      </p>
                  </div>
              </div>

              {/* Right Column: The Report */}
              <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                  <div className="p-8 flex-grow">
                      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                          <div>
                              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Diagnostic Report</h2>
                              <p className="text-sm text-gray-500 mt-1">Detailed analysis and treatment plan.</p>
                          </div>
                          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                              <SparklesIcon className="w-8 h-8"/>
                          </div>
                      </div>
                      
                      <div id="pest-analysis-content" className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h3:text-primary prose-a:text-blue-500">
                          <MarkdownRenderer content={analysisResult.text} />
                      </div>
                  </div>
              </div>
          </div>
        )}
        </>
      )}
    </div>
  );
};

export default PestDetector;
