import React from 'react';
import { Scheme } from '../data/schemeData';
import { XIcon } from './icons';

interface SchemeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: Scheme | null;
}

const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({ isOpen, onClose, scheme }) => {
  if (!isOpen || !scheme) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold">{scheme.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 space-y-4">
            <div>
                <h3 className="font-semibold text-lg mb-1">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">{scheme.description}</p>
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-1">Eligibility</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    {scheme.eligibility.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-1">Benefits</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    {scheme.benefits.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-border-light dark:border-border-dark mt-auto">
            <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 px-4 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
                Visit Official Website
            </a>
        </div>

      </div>
    </div>
  );
};

export default SchemeDetailModal;