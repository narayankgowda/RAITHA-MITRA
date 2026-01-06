
import React, { useState, useEffect } from 'react';
import { Crop, CropStage } from '../data/cropCycleData';
import { XIcon, SparklesIcon, WifiOffIcon } from './icons';
import Spinner from './Spinner';
import MarkdownRenderer from './MarkdownRenderer';
import { generateCropReport } from '../services/geminiService';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface CropReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: Crop | null;
  stage: CropStage | null;
  variety?: string;
}

const CropReportModal: React.FC<CropReportModalProps> = ({ isOpen, onClose, crop, stage, variety }) => {
  const isOnline = useNetworkStatus();
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // This state is just to satisfy the API call, as the component itself doesn't manage tasks.
  const [tasksForReport] = useState<{text: string, priority: string}[]>(stage?.tasks.map(t => ({text: t, priority: 'Medium'})) || []);

  useEffect(() => {
    // Reset state when the modal is opened for a new stage
    if (isOpen) {
      setReport(null);
      setIsLoading(false);
    }
  }, [isOpen, stage]);

  const handleGenerateReport = async () => {
    if (!isOnline) return;
    if (!crop || !stage) return;
    setIsLoading(true);
    setReport(null);

    try {
      // Note: We pass the original tasks from the stage, not the user-modified ones for this report.
      // A more advanced implementation might pass the current task state.
      const result = await generateCropReport(crop.name, stage.name, tasksForReport, variety);
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
          <h2 className="text-xl font-semibold text-text-light dark:text-text-dark">Crop Stage Report</h2>
          <button onClick={onClose} className="p-2 rounded-full text-text-light dark:text-text-dark hover:bg-black/5 dark:hover:bg-white/10">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4 text-center">
                <h3 className="font-bold text-lg text-text-light dark:text-text-dark">{crop.name} {variety && `(${variety})`}</h3>
                <p className="text-md text-gray-700 dark:text-gray-300">Current Stage: <span className="font-semibold text-primary dark:text-primary-light">{stage.name}</span></p>
            </div>

            <div className="min-h-[200px]">
                {!report && !isLoading && (
                    <div className="text-center flex flex-col items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Generate an AI-powered report for tailored advice on tasks, potential risks, and optimization for this stage.</p>
                        <button 
                            onClick={handleGenerateReport}
                            disabled={!isOnline}
                            className="flex items-center justify-center px-5 py-2.5 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:bg-gray-400 disabled:transform-none disabled:shadow-none"
                        >
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Generate AI Report
                        </button>
                        {!isOnline && (
                            <p className="mt-2 text-red-500 text-sm font-medium flex items-center">
                                <WifiOffIcon className="w-4 h-4 mr-1"/> Offline mode: Report unavailable
                            </p>
                        )}
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
