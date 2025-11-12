import React from 'react';
import { mockFarmerData } from '../data/userData';
import { ShieldCheckIcon } from './icons';

const FarmerPortfolio: React.FC = () => {
    const portfolioData = mockFarmerData;

    return (
        <div className="max-w-5xl mx-auto bg-background-light dark:bg-background-dark">
            {/* Cover Image and Header */}
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
                <img src={portfolioData.coverImage} alt="Farm Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute bottom-0 left-0 p-6 flex items-end space-x-5">
                    <img
                        className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                        src={portfolioData.profilePicture}
                        alt="Farmer Profile"
                    />
                    <div>
                        <h1 className="text-4xl font-bold text-white shadow-text">{portfolioData.name}</h1>
                        <h2 className="text-xl text-gray-200 shadow-text">{portfolioData.farmName}</h2>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: About and Achievements */}
                <div className="md:col-span-1 space-y-8">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md border border-border-light dark:border-border-dark">
                        <h3 className="text-xl font-bold mb-3">About Our Farm</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {portfolioData.farmStory}
                        </p>
                    </div>

                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md border border-border-light dark:border-border-dark">
                        <h3 className="text-xl font-bold mb-4">Achievements & Certifications</h3>
                        <ul className="space-y-3">
                            {portfolioData.achievements.map((ach, index) => (
                                <li key={index} className="flex items-center text-sm">
                                    <ShieldCheckIcon className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
                                    <span>{ach}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Produce Gallery */}
                <div className="md:col-span-2">
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md border border-border-light dark:border-border-dark">
                        <h3 className="text-xl font-bold mb-4">Our Fresh Produce</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {portfolioData.galleryImages.map((image, index) => (
                                <div key={index} className="relative rounded-lg overflow-hidden group">
                                    <img src={image.url} alt={image.caption} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-0 left-0 p-2">
                                        <p className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">{image.caption}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
             <style>{`.shadow-text { text-shadow: 1px 1px 3px rgba(0,0,0,0.5); }`}</style>
        </div>
    );
};

export default FarmerPortfolio;
