import React, { useState, useCallback, useMemo } from 'react';
import { analyzeCropImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Spinner from './Spinner';
import MarkdownRenderer from './MarkdownRenderer';
import { LeafIcon, UploadIcon, SparklesIcon, ChevronDownIcon } from './icons';
import { commonPestsAndDiseases } from '../data/pestAndDiseaseData';

const PestDetector: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);

  // State for the quick reference list
  const [pestSearchTerm, setPestSearchTerm] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
      if (!supportedMimeTypes.includes(file.type)) {
        setError('Unsupported image format. Please use one of the following: JPG, PNG, WEBP, HEIC, HEIF.');
        return;
      }

      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini API
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
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const result = await analyzeCropImage(base64, mimeType);
      setAnalysis(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError('An unknown error occurred during analysis.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  };

  const filteredPests = useMemo(() => {
    return commonPestsAndDiseases.filter(item => 
      item.name.toLowerCase().includes(pestSearchTerm.toLowerCase())
    );
  }, [pestSearchTerm]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  if (!imagePreview) {
    return (
      <div>
        <div className="text-center mb-8">
            <label htmlFor="file-upload" className="cursor-pointer group">
              <div className="mb-4 text-primary dark:text-primary-light mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 border-2 border-dashed border-primary/50 group-hover:border-primary transition-all">
                <UploadIcon className="w-12 h-12 text-primary dark:text-primary-light transition-transform group-hover:scale-110" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Upload Crop Image</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Click or drag a file here to detect pests and diseases.
                <br />
                <span className="text-sm">(Supported formats: JPG, PNG, WEBP, HEIC)</span>
              </p>
            </label>
            <input id="file-upload" type="file" accept="image/jpeg, image/png, image/webp, image/heic, image/heif" className="hidden" onChange={handleImageChange} />
            {error && <p className="text-red-500 text-center p-4">{error}</p>}
        </div>

        <div className="border-t border-border-light dark:border-border-dark pt-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Common Pests & Diseases Quick Reference</h3>
          <input 
            type="text"
            placeholder="Search for a pest or disease..."
            value={pestSearchTerm}
            onChange={(e) => setPestSearchTerm(e.target.value)}
            className="w-full max-w-lg mx-auto block px-4 py-2 mb-4 bg-white dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
          <div className="space-y-2 max-w-3xl mx-auto">
            {filteredPests.map(item => (
              <div key={item.id} className="border border-border-light dark:border-border-dark rounded-lg">
                <button 
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full flex justify-between items-center p-3 text-left font-semibold"
                >
                  <span>{item.name} <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-2 ${item.type === 'Pest' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>{item.type}</span></span>
                  <ChevronDownIcon className={`w-5 h-5 transition-transform ${openAccordion === item.id ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === item.id && (
                  <div className="p-3 border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                    <p className="text-xs text-gray-500"><strong>Commonly Affects:</strong> {item.cropsAffected.join(', ')}</p>
                  </div>
                )}
              </div>
            ))}
             {filteredPests.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">No matching pests or diseases found.</p>
             )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      <div className="flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">Image Preview</h3>
        <div className="relative w-full max-w-sm aspect-square rounded-lg overflow-hidden border-2 border-border-light dark:border-border-dark shadow-md">
          <img src={imagePreview} alt="Crop preview" className="w-full h-full object-cover" />
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleAnalyzeClick}
            disabled={isLoading}
            className="flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:bg-gray-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            {isLoading ? 'Analyzing...' : 'Analyze Image'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-text-light dark:text-text-dark font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-slate-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md active:scale-95"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">Analysis Result</h3>
        <div className="w-full h-full min-h-[200px] bg-background-light dark:bg-background-dark rounded-lg p-4 border border-border-light dark:border-border-dark overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Spinner />
              <p className="mt-4 text-gray-500 dark:text-gray-400">AI is inspecting your crop...</p>
            </div>
          )}
          {error && <div className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>}
          {analysis && <MarkdownRenderer content={analysis} />}
          {!isLoading && !analysis && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <LeafIcon className="w-12 h-12 mb-4" />
              <p>Analysis will appear here after you click "Analyze".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PestDetector;