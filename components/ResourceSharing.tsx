
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { initialResourceData, Resource, ResourceType } from '../data/resourceData';
import { 
    TractorIcon, UsersIcon, SearchIcon, FilterIcon, 
    MapPinIcon, StarIcon, PlusIcon, PhoneIcon, 
    XIcon, ConstructionIcon, NavigationIcon,
    ShieldCheckIcon, SparklesIcon, ChevronRightIcon,
    ActivityIcon, InfoIcon, ClockIcon, TruckIcon,
    PackageIcon, DropletsIcon, LayoutGridIcon, 
    RefreshCwIcon
} from './icons';
import { calculateDistance, Coordinates } from '../utils/locationUtils';
import { GoogleGenAI } from "@google/genai";
import MarkdownRenderer from './MarkdownRenderer';
import Spinner from './Spinner';

const ResourceSharing: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>(() => {
        const saved = localStorage.getItem('farm_resources');
        return saved ? JSON.parse(saved) : initialResourceData;
    });

    // Discovery State
    const [activeType, setActiveType] = useState<ResourceType | 'all'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [maxPrice, setMaxPrice] = useState<number>(5000);
    const [minRating, setMinRating] = useState<number>(0);
    const [onlyVerified, setOnlyVerified] = useState(false);

    // Modals & Details
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    
    // AI State
    const [aiQuery, setAiQuery] = useState('');
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isAiThinking, setIsAiThinking] = useState(false);

    // Location State
    const [userLoc, setUserLoc] = useState<Coordinates | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        if ("geolocation" in navigator) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLoc({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                    setIsLocating(false);
                },
                () => setIsLocating(false)
            );
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('farm_resources', JSON.stringify(resources));
    }, [resources]);

    const filteredResources = useMemo(() => {
        let list = resources.filter(r => {
            const matchesType = activeType === 'all' || r.type === activeType;
            const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 r.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPrice = r.price <= maxPrice;
            const matchesRating = r.rating >= minRating;
            const matchesVerified = !onlyVerified || r.isVerified;
            
            return matchesType && matchesSearch && matchesPrice && matchesRating && matchesVerified;
        });

        if (userLoc) {
            list = list.map(r => ({
                ...r,
                liveDist: calculateDistance(userLoc, { latitude: r.latitude, longitude: r.longitude })
            })).sort((a, b) => (a.liveDist || 0) - (b.liveDist || 0));
        }
        return list;
    }, [resources, activeType, searchTerm, maxPrice, minRating, onlyVerified, userLoc]);

    const handleAskAi = async () => {
        if (!aiQuery.trim()) return;
        setIsAiThinking(true);
        setAiResponse(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `As an agricultural logistics expert, help the farmer with this resource query: "${aiQuery}". Suggest bundles (e.g. machinery + labor). Mention if logistics pooling is a good idea. Keep it professional and under 4 sentences.`
            });
            setAiResponse(response.text);
        } catch (e) {
            setAiResponse("My expert database is currently resetting. Please try again.");
        } finally {
            setIsAiThinking(false);
        }
    };

    const getTypeIcon = (type: ResourceType) => {
        switch(type) {
            case 'machinery': return <TractorIcon className="w-5 h-5"/>;
            case 'labor': return <UsersIcon className="w-5 h-5"/>;
            case 'logistics': return <TruckIcon className="w-5 h-5"/>;
            case 'storage': return <PackageIcon className="w-5 h-5"/>;
            case 'water': return <DropletsIcon className="w-5 h-5"/>;
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto flex flex-col h-[calc(100vh-100px)] overflow-hidden animate-fadeIn">
            
            {/* 1. Integrated Discovery Header */}
            <div className="bg-white dark:bg-[#0b1120] border-b border-gray-100 dark:border-white/10 p-6 flex flex-col md:flex-row justify-between items-center gap-6 z-30 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                        <ActivityIcon className="w-6 h-6"/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Asset Exchange</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{filteredResources.length} Assets Near You</p>
                        </div>
                    </div>
                </div>

                <div className="flex-grow max-w-2xl relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search for trucks, tractors, cold storage..." 
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-medium shadow-inner"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
                        className="flex items-center gap-2 px-5 py-3 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/5"
                    >
                        {viewMode === 'grid' ? <MapPinIcon className="w-4 h-4"/> : <LayoutGridIcon className="w-4 h-4"/>}
                        {viewMode === 'grid' ? 'Map View' : 'Grid View'}
                    </button>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-3 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest"
                    >
                        List My Asset
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                
                {/* 2. Professional Sidebar Filters */}
                <aside className="w-80 bg-white dark:bg-[#0b1120] border-r border-gray-100 dark:border-white/10 p-8 hidden xl:flex flex-col space-y-10 overflow-y-auto no-scrollbar">
                    
                    {/* Categories Nav */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Asset Categories</p>
                        {(['all', 'machinery', 'labor', 'logistics', 'storage', 'water'] as (ResourceType | 'all')[]).map(type => (
                            <button 
                                key={type}
                                onClick={() => setActiveType(type)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${activeType === type ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${activeType === type ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/5 group-hover:bg-white'}`}>
                                        {type === 'all' ? <LayoutGridIcon className="w-4 h-4"/> : getTypeIcon(type as ResourceType)}
                                    </div>
                                    <span className="text-sm font-bold capitalize">{type}</span>
                                </div>
                                {activeType === type && <ChevronRightIcon className="w-4 h-4"/>}
                            </button>
                        ))}
                    </div>

                    {/* Discovery Filters */}
                    <div className="space-y-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Refine Search</p>
                        
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Max Budget</label>
                                <span className="text-xs font-black text-primary">₹{maxPrice}</span>
                            </div>
                            <input 
                                type="range" min="100" max="10000" step="100" value={maxPrice} onChange={e => setMaxPrice(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        <div className="flex items-center justify-between py-4 border-t border-gray-50 dark:border-white/5">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Verified Assets Only</label>
                            <button 
                                onClick={() => setOnlyVerified(!onlyVerified)}
                                className={`w-10 h-5 rounded-full relative transition-colors ${onlyVerified ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${onlyVerified ? 'left-6' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>

                    {/* AI Advisor Mini-Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700"><SparklesIcon className="w-20 h-20"/></div>
                        <h4 className="text-lg font-black flex items-center mb-2"><SparklesIcon className="w-5 h-5 mr-2 text-yellow-300"/> Bundle Expert</h4>
                        <p className="text-xs opacity-80 leading-relaxed mb-4">Ask me which assets you need for specific crop cycles.</p>
                        <input 
                            type="text" value={aiQuery} onChange={e => setAiQuery(e.target.value)}
                            placeholder="Need help for harvest?"
                            className="w-full bg-white/10 border-white/20 text-xs p-3 rounded-xl placeholder-white/40 focus:ring-2 focus:ring-white/50 outline-none mb-3"
                        />
                        <button 
                            onClick={handleAskAi}
                            className="w-full py-2.5 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isAiThinking ? <Spinner className="w-4 h-4 text-indigo-600"/> : "Match My Needs"}
                        </button>
                    </div>
                </aside>

                {/* 3. Main Display Area */}
                <main className="flex-1 bg-gray-50 dark:bg-black p-8 overflow-y-auto custom-scrollbar">
                    
                    {aiResponse && (
                        <div className="mb-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-800 animate-slideDown flex gap-6 items-start">
                            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg"><SparklesIcon className="w-6 h-6"/></div>
                            <div className="flex-grow pt-1">
                                <h4 className="text-indigo-900 dark:text-indigo-200 font-black text-sm uppercase tracking-widest mb-2">AI Recommendation</h4>
                                <div className="prose prose-sm dark:prose-invert text-indigo-800 dark:text-indigo-300 max-w-none leading-relaxed italic"><MarkdownRenderer content={aiResponse} /></div>
                            </div>
                            <button onClick={() => setAiResponse(null)} className="p-2 text-indigo-300 hover:text-indigo-600 transition-colors"><XIcon className="w-5 h-5"/></button>
                        </div>
                    )}

                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
                            {filteredResources.map(res => {
                                const dist = (res as any).liveDist;
                                const isNearby = dist !== undefined && dist < 10;
                                
                                return (
                                    <div 
                                        key={res.id} 
                                        onClick={() => setSelectedResource(res)}
                                        className="bg-white dark:bg-[#111827] rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col group transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                                    >
                                        <div className="h-60 relative overflow-hidden">
                                            <img src={res.imageUrl} alt={res.name} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            
                                            {/* Labels */}
                                            <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md ${res.availability === 'Available' ? 'bg-emerald-500/80' : 'bg-red-500/80'}`}>
                                                    {res.availability}
                                                </span>
                                                {isNearby && (
                                                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-blue-500/80 backdrop-blur-md flex items-center gap-1.5 shadow-xl animate-pulse-glow">
                                                        <NavigationIcon className="w-3 h-3 fill-current" /> Near You
                                                    </span>
                                                )}
                                            </div>

                                            <div className="absolute bottom-6 left-8 right-8">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <div className="p-1 bg-primary/20 text-primary-light rounded-md">
                                                        {getTypeIcon(res.type)}
                                                    </div>
                                                    <span className="text-[10px] font-black text-primary-light uppercase tracking-widest">{res.category}</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-white tracking-tight leading-tight line-clamp-1">{res.name}</h3>
                                            </div>
                                        </div>

                                        <div className="p-8 space-y-6 flex-grow flex flex-col">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="text-sm font-black text-gray-900 dark:text-white">{res.rating}</span>
                                                    <span className="text-xs text-gray-400 font-bold">({res.reviews} reviews)</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                                    <MapPinIcon className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{dist !== undefined ? `${dist.toFixed(1)} km` : res.location}</span>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{res.description}</p>

                                            <div className="grid grid-cols-2 gap-3">
                                                {res.specs.slice(0, 2).map((s, i) => (
                                                    <div key={i} className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-100 dark:border-white/10">
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{s.label}</p>
                                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{s.value}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-auto pt-8 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Rental Rate</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-3xl font-black text-gray-900 dark:text-white">₹{res.price}</span>
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase">/{res.unit}</span>
                                                    </div>
                                                </div>
                                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 transition-transform group-hover:scale-110 active:scale-95">
                                                    <PhoneIcon className="w-6 h-6" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Placeholder for Map mode until Leaflet integration is wired */
                        <div className="h-full w-full bg-gray-200 dark:bg-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-gray-400 border-4 border-dashed border-gray-300 dark:border-slate-700">
                             <MapPinIcon className="w-20 h-20 mb-4 opacity-20"/>
                             <h3 className="text-2xl font-black uppercase tracking-widest">Interactive Exchange Map</h3>
                             <p className="text-sm font-medium mt-2">Visualizing {filteredResources.length} assets across your region.</p>
                             <button onClick={() => setViewMode('grid')} className="mt-8 px-6 py-2.5 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20">Back to Grid</button>
                        </div>
                    )}

                    {filteredResources.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                            <ConstructionIcon className="w-24 h-24 text-gray-200 dark:text-slate-800 mb-6"/>
                            <h3 className="text-3xl font-black text-gray-400 dark:text-slate-700 tracking-tighter italic">"No matches in your local orbit"</h3>
                            <p className="text-gray-500 mt-2 max-w-sm">Try broadening your budget or changing categories.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* 4. Deep-Detail Overlay */}
            {selectedResource && (
                <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl animate-fadeIn" onClick={() => setSelectedResource(null)}>
                    <div className="bg-white dark:bg-[#0f172a] rounded-[3.5rem] shadow-2xl w-full max-w-6xl border border-white/10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        
                        {/* Immersive Visual Column */}
                        <div className="md:w-5/12 h-[300px] md:h-auto relative bg-black">
                            <img src={selectedResource.imageUrl} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
                            
                            <div className="absolute top-10 left-10 flex flex-col gap-4">
                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2.5rem] text-white w-fit shadow-2xl">
                                    <p className="text-[10px] font-black text-primary-light uppercase tracking-[0.2em] mb-3">Owner Verification</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary-light border border-primary/30">
                                            <ShieldCheckIcon className="w-8 h-8"/>
                                        </div>
                                        <div>
                                            <p className="text-xl font-black tracking-tight">{selectedResource.trustIndex}%</p>
                                            <p className="text-[9px] font-bold text-gray-300 uppercase">Trust Index</p>
                                        </div>
                                    </div>
                                </div>
                                {selectedResource.maintenanceLog && (
                                    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-white flex items-center gap-3">
                                        <RefreshCwIcon className="w-4 h-4 text-emerald-400"/>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Last Service: {selectedResource.maintenanceLog}</span>
                                    </div>
                                )}
                            </div>

                            <div className="absolute bottom-12 left-10 right-10">
                                <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase text-white bg-primary shadow-2xl mb-4 inline-block">Asset ID: {selectedResource.id}</span>
                                <h2 className="text-5xl font-black text-white tracking-tighter leading-none">{selectedResource.name}</h2>
                            </div>
                        </div>

                        {/* Professional Specs & Booking Column */}
                        <div className="md:w-7/12 p-8 md:p-16 overflow-y-auto space-y-12 no-scrollbar bg-card-light dark:bg-[#0f172a]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Management</p>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{selectedResource.ownerName}</h3>
                                </div>
                                <button onClick={() => setSelectedResource(null)} className="p-3 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-400"><XIcon className="w-6 h-6"/></button>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
                                    <StarIcon className="w-6 h-6 mb-2 text-yellow-400 fill-current"/>
                                    <p className="text-lg font-black">{selectedResource.rating}</p>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase">Rating</p>
                                </div>
                                <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
                                    <ClockIcon className="w-6 h-6 mb-2 text-blue-500"/>
                                    <p className="text-lg font-black">{selectedResource.nextAvailable}</p>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase">Next Slot</p>
                                </div>
                                <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
                                    <MapPinIcon className="w-6 h-6 mb-2 text-red-500"/>
                                    <p className="text-lg font-black">{selectedResource.location.split(',')[0]}</p>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase">Location</p>
                                </div>
                                <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
                                    <ShieldCheckIcon className={`w-6 h-6 mb-2 ${selectedResource.isVerified ? 'text-green-500' : 'text-gray-400'}`}/>
                                    <p className="text-lg font-black">{selectedResource.isVerified ? 'YES' : 'NO'}</p>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase">Verified</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] border-b border-gray-100 dark:border-white/5 pb-4">Detailed Specifications</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                                    {selectedResource.specs.map((s, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-white/5">
                                            <span className="text-xs text-gray-500 font-bold uppercase">{s.label}</span>
                                            <span className="text-sm font-black text-gray-900 dark:text-white">{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                                <h4 className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] mb-4">Operator Notes</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                    {selectedResource.description}
                                </p>
                            </div>

                            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-gray-100 dark:border-white/5">
                                <div className="text-center sm:text-left">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Total Rate Est.</p>
                                    <div className="flex items-baseline justify-center sm:justify-start gap-2">
                                        <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">₹{selectedResource.price}</span>
                                        <span className="text-sm font-black text-gray-500 uppercase tracking-widest">/{selectedResource.unit}</span>
                                    </div>
                                </div>
                                <a 
                                    href={`tel:${selectedResource.contact}`}
                                    className="w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-[2.5rem] font-black shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 text-xl"
                                >
                                    <PhoneIcon className="w-8 h-8"/> Confirm Reservation
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. Modern Listing Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl animate-fadeIn">
                    <div className="bg-white dark:bg-[#0f172a] rounded-[3.5rem] shadow-2xl w-full max-w-xl border border-white/10 overflow-hidden flex flex-col">
                        <div className="p-12">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-4xl font-black tracking-tighter">List Your Asset</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400"><XIcon className="w-7 h-7"/></button>
                            </div>

                            <form className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-[0.2em]">Asset Name</label>
                                        <input required placeholder="e.g. 10 Tonne Sonalika Tractor" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none transition-all shadow-inner font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-[0.2em]">Asset Type</label>
                                        <select className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none transition-all shadow-inner font-bold appearance-none cursor-pointer">
                                            <option value="machinery">Machinery</option>
                                            <option value="labor">Labor</option>
                                            <option value="logistics">Logistics</option>
                                            <option value="storage">Storage</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-[0.2em]">Price (₹)</label>
                                        <input type="number" required placeholder="500" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none transition-all shadow-inner font-bold" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-[0.2em]">Description & Quality</label>
                                    <textarea rows={3} placeholder="Tell us about the condition, availability, or crew size..." className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary outline-none transition-all resize-none shadow-inner text-sm font-medium"></textarea>
                                </div>

                                <div className="flex gap-6 pt-4">
                                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-black rounded-3xl uppercase tracking-widest text-xs">Discard</button>
                                    <button type="submit" className="flex-1 py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/30 uppercase tracking-widest text-xs active:scale-95 transition-all">Go Live</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourceSharing;
