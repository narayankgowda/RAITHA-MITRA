import React, { useState, useEffect } from 'react';
import { Crop, CropStage } from '../data/cropCycleData';
import { XIcon, SparklesIcon } from './icons';
import Spinner from './Spinner';
import MarkdownRenderer from './MarkdownRenderer';
// FIX: Import the gemini service function
import { generateCropReport } from '../services/geminiService';

interface CropReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: Crop | null;
  stage: CropStage | null;
}

const CropReportModal: React.FC<CropReportModalProps> = ({ isOpen, onClose, crop, stage }) => {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reset state when the modal is opened for a new stage
    if (isOpen) {
      setReport(null);
      setIsLoading(false);
    }
  }, [isOpen, stage]);

  const handleGenerateReport = async () => {
    if (!crop || !stage) return;
    setIsLoading(true);
    setReport(null);

    // FIX: Replace mock API call with a real call to the Gemini service.
    try {
      const result = await generateCropReport(crop.name, stage.name, stage.tasks);
      setReport(result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? `Error generating report: ${err.message}` : 'An unknown error occurred.';
      setReport(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !crop || !stage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold">Crop Stage Report</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4 text-center">
                <h3 className="font-bold text-lg">{crop.name}</h3>
                <p className="text-md text-gray-700 dark:text-gray-300">Current Stage: <span className="font-semibold text-primary dark:text-primary-light">{stage.name}</span></p>
            </div>

            <div className="min-h-[200px]">
                {!report && !isLoading && (
                    <div className="text-center flex flex-col items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Generate an AI-powered report for tailored advice on tasks, potential risks, and optimization for this stage.</p>
                        <button 
                            onClick={handleGenerateReport}
                            className="flex items-center justify-center px-5 py-2.5 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                        >
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Generate AI Report
                        </button>
                    </div>
                )}
                 {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Spinner />
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Generating report...</p>
                    </div>
                )}
                {report && <MarkdownRenderer content={report} />}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CropReportModal;