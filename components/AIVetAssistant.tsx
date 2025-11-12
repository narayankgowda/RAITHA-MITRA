import React, { useState, useCallback } from 'react';
import { getVetAnalysis } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Spinner from './Spinner';
import MarkdownRenderer from './MarkdownRenderer';
import { HeartIcon, UploadIcon, SparklesIcon } from './icons';

const AIVetAssistant: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('Image file is too large. Please select a file smaller than 4MB.');
        return;
      }
      setImageFile(file);
      setAnalysis(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile || !query) {
      setError('Please upload an image and describe the issue.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const result = await getVetAnalysis(base64, mimeType, query);
      setAnalysis(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? `An error occurred: ${err.message}` : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, query]);

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setAnalysis(null);
    setError(null);
    setQuery('');
    setIsLoading(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      <div className="flex flex-col">
        {!imagePreview ? (
          <div className="text-center p-4 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg flex-grow flex flex-col justify-center">
            <label htmlFor="vet-image-upload" className="cursor-pointer group">
              <div className="mb-4 text-primary dark:text-primary-light mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                <UploadIcon className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Upload Animal Image</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Upload a clear photo of the affected area or the animal.</p>
            </label>
            <input id="vet-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        ) : (
          <div className="relative w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden border-2 border-border-light dark:border-border-dark shadow-md">
            <img src={imagePreview} alt="Animal preview" className="w-full h-full object-cover" />
          </div>
        )}
        
        <div className="mt-4">
            <label htmlFor="query" className="block text-sm font-medium mb-1">Describe the symptoms or ask a question:</label>
            <textarea
                id="query"
                rows={4}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'My cow has a rash on its leg and seems lethargic. What could this be?'"
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
        </div>

        <div className="mt-4 flex space-x-4 justify-center">
          <button onClick={handleAnalyzeClick} disabled={isLoading} className="flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:bg-gray-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed">
            <SparklesIcon className="w-5 h-5 mr-2" />
            {isLoading ? 'Analyzing...' : 'Get AI Analysis'}
          </button>
          <button onClick={handleReset} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-text-light dark:text-text-dark font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-slate-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md active:scale-95">
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <h3 className="text-2xl font-bold mb-4 text-center">AI Vet Assistant Report</h3>
        <div className="w-full h-full min-h-[300px] bg-background-light dark:bg-background-dark rounded-lg p-4 border border-border-light dark:border-border-dark overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Spinner />
              <p className="mt-4 text-gray-500 dark:text-gray-400">AI is analyzing the case...</p>
            </div>
          )}
          {error && <p className="text-red-500 text-center p-4">{error}</p>}
          {analysis && <MarkdownRenderer content={analysis} />}
          {!isLoading && !analysis && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <HeartIcon className="w-12 h-12 mb-4" />
              <p>The AI-powered preliminary analysis will appear here.</p>
              <p className="text-xs mt-2"><strong>Disclaimer:</strong> Always consult a qualified veterinarian for a proper diagnosis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIVetAssistant;
