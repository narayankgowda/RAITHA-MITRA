

import React from 'react';
import { Scheme } from '../data/schemeData';

interface SchemeCardProps {
  scheme: Scheme;
  onViewDetails: (scheme: Scheme) => void;
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, onViewDetails }) => {
  const getCategoryClasses = (category: string) => {
    switch (category) {
      case 'Subsidy': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Loan': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Insurance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Training': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'Infrastructure': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300';
      case 'Pension': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300';
      case 'Health': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700';
    }
  };

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-border-light dark:border-border-dark bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-text-light dark:text-text-dark pr-2">{scheme.name}</h3>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getCategoryClasses(scheme.category)}`}>
            {scheme.category}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">{scheme.description}</p>
      <button 
        onClick={() => onViewDetails(scheme)}
        className="mt-auto w-full py-2 bg-primary-light text-white font-semibold rounded-lg hover:bg-primary transition-all duration-300 shadow hover:shadow-md transform hover:-translate-y-0.5 active:scale-95"
      >
        View Details
      </button>
    </div>
  );
};

export default SchemeCard;