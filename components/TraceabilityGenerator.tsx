
import React, { useState } from 'react';
import { generateProductStory } from '../services/geminiService';
import Spinner from './Spinner';
import MarkdownRenderer from './MarkdownRenderer';
import { SearchIcon, QrCodeIcon, MapPinIcon, CalendarIcon, CheckCircleIcon, SparklesIcon, TruckIcon } from './icons';

const TraceabilityGenerator: React.FC = () => {
    const [batchId, setBatchId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [story, setStory] = useState<string | null>(null);
    const [timeline, setTimeline] = useState<any[] | null>(null);

    // Mock details generator based on ID
    const getMockDetails = (id: string) => {
        return {
            crop: 'Premium Organic Sona Masuri Rice',
            date: '2024-04-15',
            organic: 'Certified Organic',
            location: 'Green Valley Farms, Mandya, Karnataka',
            method: 'Traditional SRI Method',
            farmer: 'Narayan K Gowda'
        };
    };

    const handleTrace = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!batchId.trim()) return;

        setIsLoading(true);
        setStory(null);
        setTimeline(null);

        try {
            const details = getMockDetails(batchId);
            
            // Generate Story using Gemini
            const storyText = await generateProductStory(details);
            setStory(storyText);

            // Set Timeline Data
            setTimeline([
                { stage: 'Harvested', date: '15 Apr 2024', location: details.location, icon: CheckCircleIcon, status: 'completed' },
                { stage: 'Quality Check', date: '18 Apr 2024', location: 'Mandya Organic Co-op', icon: CheckCircleIcon, status: 'completed' },
                { stage: 'In Transit', date: '20 Apr 2024', location: 'On route to Bangalore', icon: TruckIcon, status: 'completed' },
                { stage: 'Delivered', date: '21 Apr 2024', location: 'Fresh Produce Hub', icon: MapPinIcon, status: 'completed' }
            ]);

        } catch (error) {
            console.error("Trace error", error);
            setStory("Unable to retrieve product story at this time.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <div className="inline-block p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <QrCodeIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Farm-to-Table Traceability</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-lg mx-auto">Enter the Batch ID found on your produce packaging to discover its origin and journey.</p>
            </div>

            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-lg border border-border-light dark:border-border-dark max-w-xl mx-auto">
                <form onSubmit={handleTrace} className="flex gap-2">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            value={batchId}
                            onChange={(e) => setBatchId(e.target.value)}
                            placeholder="Enter Batch ID (e.g., BATCH-2024-001)" 
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading || !batchId}
                        className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                        {isLoading ? <Spinner /> : 'Trace'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">Try ID: <span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 rounded cursor-pointer" onClick={() => setBatchId('BATCH-2024-RM01')}>BATCH-2024-RM01</span></p>
                </div>
            </div>

            {timeline && story && (
                <div className="grid md:grid-cols-2 gap-8 animate-fadeIn">
                    {/* Timeline Column */}
                    <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md border border-border-light dark:border-border-dark">
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                            <MapPinIcon className="w-5 h-5 mr-2 text-primary"/> Journey Timeline
                        </h3>
                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            {timeline.map((event, index) => (
                                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-green-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                        <event.icon className="w-5 h-5"/>
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark shadow-sm">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-slate-900 dark:text-slate-200">{event.stage}</div>
                                            <time className="font-caveat font-medium text-primary">{event.date}</time>
                                        </div>
                                        <div className="text-sm text-slate-500">{event.location}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Story Column */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 rounded-xl border border-primary/20 shadow-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center text-primary-dark dark:text-primary-light">
                                <SparklesIcon className="w-6 h-6 mr-2"/> The Story of Your Food
                            </h3>
                            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                                <MarkdownRenderer content={story} />
                            </div>
                        </div>

                        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-md border border-border-light dark:border-border-dark">
                            <h3 className="text-lg font-bold mb-4">Product Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-background-light dark:bg-background-dark rounded-lg">
                                    <p className="text-gray-500 text-xs uppercase font-bold">Farmer</p>
                                    <p className="font-semibold">Narayan K Gowda</p>
                                </div>
                                <div className="p-3 bg-background-light dark:bg-background-dark rounded-lg">
                                    <p className="text-gray-500 text-xs uppercase font-bold">Method</p>
                                    <p className="font-semibold">Traditional SRI</p>
                                </div>
                                <div className="p-3 bg-background-light dark:bg-background-dark rounded-lg">
                                    <p className="text-gray-500 text-xs uppercase font-bold">Harvest Date</p>
                                    <p className="font-semibold">15 Apr 2024</p>
                                </div>
                                <div className="p-3 bg-background-light dark:bg-background-dark rounded-lg">
                                    <p className="text-gray-500 text-xs uppercase font-bold">Certification</p>
                                    <p className="font-semibold text-green-600">Organic Cert. #8832</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TraceabilityGenerator;
