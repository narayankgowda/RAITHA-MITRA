
import React, { useState, useMemo } from 'react';
import { liveMandiPriceData, MandiPrice } from '../data/liveMandiPriceData';
import { 
    TrendingUpIcon, TrendingDownIcon, XIcon, 
    BarChart2Icon, ActivityIcon, CalculatorIcon, DollarSignIcon, SearchIcon, 
    FilterIcon, RefreshCwIcon, SparklesIcon, MapPinIcon, LayoutGridIcon
} from './icons';
import { getMarketInsight } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import Spinner from './Spinner';
import MandiLocator from './MandiLocator';

// Analytics Panel Component
const MarketAnalyticsPanel: React.FC<{ item: MandiPrice; onClose: () => void }> = ({ item, onClose }) => {
    const [sellQuantity, setSellQuantity] = useState<number | ''>(10);
    const estimatedRevenue = sellQuantity ? (item.modal_price * sellQuantity) : 0;
    
    // AI Insight State
    const isOnline = useNetworkStatus();
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

    const handleGenerateInsight = async () => {
        if (!isOnline) return;
        setIsGeneratingInsight(true);
        setAiInsight(null);
        try {
            const insight = await getMarketInsight(item.commodity, item.market, item.modal_price, item.priceHistory);
            setAiInsight(insight);
        } catch (error) {
            console.error("Failed to generate insight", error);
            setAiInsight("Unable to generate insight at this time. Please try again later.");
        } finally {
            setIsGeneratingInsight(false);
        }
    };

    // Smoother Chart Curve
    const generateSmoothChartPath = (data: number[]) => {
        if (!data || data.length === 0) return '';
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        const width = 100;
        const height = 50;
        
        // Scale points
        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / range) * height; // Invert y for SVG
            return {x, y};
        });

        // Simple line for now, but could be bezier
        return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    };

    return (
        <div className="bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col h-full overflow-y-auto animate-slideLeft w-full lg:w-[30rem] fixed lg:static inset-y-0 right-0 z-50 lg:z-auto shadow-2xl lg:shadow-none">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20 tracking-wider">{item.commodity}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">{item.market}</h3>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-red-500 transition-colors"><XIcon className="w-5 h-5"/></button>
            </div>

            <div className="p-6 space-y-8">
                {/* Price Highlights */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-2xl text-center border border-primary/10 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform"><DollarSignIcon className="w-12 h-12"/></div>
                        <p className="text-xs font-bold uppercase text-primary tracking-wider mb-1">Current Price</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">₹{item.modal_price}</p>
                        <p className="text-[10px] font-medium text-gray-500 mt-1">/ Quintal</p>
                    </div>
                    
                    <div className={`p-5 rounded-2xl text-center border shadow-sm relative overflow-hidden ${item.forecast.trend === 'up' ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800' : item.forecast.trend === 'down' ? 'bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-800' : 'bg-gray-50/50 border-gray-200 dark:bg-gray-800/50'}`}>
                        <p className="text-xs font-bold uppercase mb-1 opacity-70">AI Forecast (3d)</p>
                        <div className={`flex items-center justify-center gap-1 ${item.forecast.trend === 'up' ? 'text-green-600' : item.forecast.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                            {item.forecast.trend === 'up' && <TrendingUpIcon className="w-6 h-6"/>}
                            {item.forecast.trend === 'down' && <TrendingDownIcon className="w-6 h-6"/>}
                            {item.forecast.trend === 'stable' && <ActivityIcon className="w-6 h-6"/>}
                            <span className="text-2xl font-bold">{item.forecast.percent}%</span>
                        </div>
                        <p className="text-[10px] font-medium opacity-60 mt-1">{item.forecast.trend === 'up' ? 'Bullish Trend' : item.forecast.trend === 'down' ? 'Bearish Trend' : 'Market Stable'}</p>
                    </div>
                </div>

                {/* AI Insight Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-sm flex items-center text-indigo-800 dark:text-indigo-300 uppercase tracking-wide">
                            <SparklesIcon className="w-4 h-4 mr-2 text-indigo-500"/> AI Market Analyst
                        </h4>
                        {!aiInsight && !isGeneratingInsight && (
                            <button 
                                onClick={handleGenerateInsight} 
                                disabled={!isOnline}
                                className="text-xs bg-white dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200 px-4 py-2 rounded-lg shadow-sm border border-indigo-200 dark:border-indigo-700 font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
                            >
                                {isOnline ? 'Ask AI' : 'Offline'}
                            </button>
                        )}
                    </div>
                    
                    {isGeneratingInsight ? (
                        <div className="flex flex-col items-center justify-center py-4 text-indigo-400">
                            <Spinner className="w-6 h-6 mb-2"/>
                            <span className="text-xs animate-pulse">Analyzing price momentum...</span>
                        </div>
                    ) : aiInsight ? (
                        <div className="prose prose-sm dark:prose-invert text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                            <MarkdownRenderer content={aiInsight} />
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 italic">
                            Click 'Ask AI' to get real-time strategic advice on whether to sell now or hold your stock.
                        </p>
                    )}
                </div>

                {/* Price Trend Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-sm flex items-center text-gray-700 dark:text-gray-200 uppercase tracking-wide"><BarChart2Icon className="w-4 h-4 mr-2 text-blue-500"/> Price History (7 Days)</h4>
                    </div>
                    <div className="h-32 w-full relative group">
                        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                            {/* Gradient Defs */}
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor={item.forecast.trend === 'up' ? '#22c55e' : item.forecast.trend === 'down' ? '#ef4444' : '#3b82f6'} stopOpacity="0.2"/>
                                    <stop offset="100%" stopColor={item.forecast.trend === 'up' ? '#22c55e' : item.forecast.trend === 'down' ? '#ef4444' : '#3b82f6'} stopOpacity="0"/>
                                </linearGradient>
                            </defs>
                            
                            {/* Area fill */}
                            <path 
                                d={`${generateSmoothChartPath(item.priceHistory)} L 100,50 L 0,50 Z`} 
                                fill="url(#chartGradient)" 
                                stroke="none" 
                            />
                            
                            {/* Line */}
                            <path 
                                d={generateSmoothChartPath(item.priceHistory)} 
                                fill="none" 
                                stroke={item.forecast.trend === 'up' ? '#22c55e' : item.forecast.trend === 'down' ? '#ef4444' : '#3b82f6'} 
                                strokeWidth="3" 
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        
                        {/* Tooltip Overlay (Simple) */}
                        <div className="absolute top-0 right-0 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Latest: ₹{item.priceHistory[item.priceHistory.length-1]}
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">
                        <span>Last Week</span>
                        <span>Today</span>
                    </div>
                </div>

                {/* Sell Calculator */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-800/30">
                    <h4 className="font-bold text-sm flex items-center text-yellow-800 dark:text-yellow-500 mb-5 uppercase tracking-wide">
                        <CalculatorIcon className="w-4 h-4 mr-2"/> Profit Estimator
                    </h4>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Quantity to Sell</span>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    value={sellQuantity} 
                                    onChange={(e) => setSellQuantity(parseFloat(e.target.value) || '')} 
                                    className="w-20 p-1.5 text-sm rounded-lg border border-yellow-300 dark:border-yellow-700 bg-white dark:bg-black font-bold text-center outline-none focus:ring-2 focus:ring-yellow-500 transition-all" 
                                />
                                <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">Qtl</span>
                            </div>
                        </div>
                        
                        <input 
                            type="range" 
                            min="1" 
                            max="100" 
                            value={sellQuantity || 0} 
                            onChange={(e) => setSellQuantity(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-yellow-200 dark:bg-yellow-800 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                        />

                        <div className="flex justify-between items-center pt-4 border-t border-yellow-200 dark:border-yellow-800/50">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Est. Revenue</span>
                            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">₹{estimatedRevenue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const LiveMandiPrices: React.FC = () => {
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedMarket, setSelectedMarket] = useState('');
    const [cropSearch, setCropSearch] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    
    // Selection state for Analytics
    const [selectedItem, setSelectedItem] = useState<MandiPrice | null>(null);

    const handleRowClick = (item: MandiPrice) => {
        setSelectedItem(item);
    };

    const states = useMemo(() => [...new Set(liveMandiPriceData.map(item => item.state))], []);
    const districts = useMemo(() => {
        if (!selectedState) return [];
        return [...new Set(liveMandiPriceData.filter(item => item.state === selectedState).map(item => item.district))];
    }, [selectedState]);
    const markets = useMemo(() => {
        if (!selectedDistrict) return [];
        return [...new Set(liveMandiPriceData.filter(item => item.district === selectedDistrict).map(item => item.market))];
    }, [selectedDistrict]);

    const filteredData = useMemo(() => {
        return liveMandiPriceData.filter(item => {
            const stateMatch = !selectedState || item.state === selectedState;
            const districtMatch = !selectedDistrict || item.district === selectedDistrict;
            const marketMatch = !selectedMarket || item.market === selectedMarket;
            const cropMatch = !cropSearch || item.commodity.toLowerCase().includes(cropSearch.toLowerCase());
            return stateMatch && districtMatch && marketMatch && cropMatch;
        });
    }, [selectedState, selectedDistrict, selectedMarket, cropSearch]);

    const resetFilters = () => {
        setSelectedState('');
        setSelectedDistrict('');
        setSelectedMarket('');
        setCropSearch('');
        setSelectedItem(null);
    };

    return (
        <div className="flex flex-col h-full gap-6 animate-fadeIn max-w-7xl mx-auto">
            
            {/* Header & Ticker */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6 pb-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-green-600 dark:text-green-400">Live Feed</span>
                    </div>
                    <h2 className="text-4xl font-black text-text-light dark:text-text-dark tracking-tight">Market Intelligence</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-lg">Real-time mandi prices and AI-driven forecasts.</p>
                </div>

                {/* Market Movers Ticker */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 max-w-full lg:max-w-xl mask-linear-fade">
                    <div className="flex-shrink-0 flex flex-col justify-center px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl min-w-[140px] shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Tomato</span>
                            <TrendingUpIcon className="w-3 h-3 text-green-600"/>
                        </div>
                        <div className="flex items-end gap-1">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">₹1,200</span>
                            <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900 px-1.5 rounded">+12%</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col justify-center px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl min-w-[140px] shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Onion</span>
                            <TrendingDownIcon className="w-3 h-3 text-red-600"/>
                        </div>
                        <div className="flex items-end gap-1">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">₹1,800</span>
                            <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900 px-1.5 rounded">-5%</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col justify-center px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl min-w-[140px] shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Cotton</span>
                            <TrendingUpIcon className="w-3 h-3 text-green-600"/>
                        </div>
                        <div className="flex items-end gap-1">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">₹7,650</span>
                            <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900 px-1.5 rounded">+4%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Split View Container */}
            <div className="flex flex-col lg:flex-row h-full gap-6 overflow-hidden relative">
                
                {/* Main Content Area */}
                <div className="flex-grow flex flex-col space-y-6 h-full overflow-y-auto custom-scrollbar pr-1">
                    
                    {/* Glass Filter Bar */}
                    <div className="p-1 bg-white/80 dark:bg-[#0b1120]/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 sticky top-0 z-30">
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-100 dark:border-white/5 flex flex-col gap-4">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Search */}
                                <div className="relative flex-grow">
                                    <SearchIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={cropSearch} 
                                        onChange={e => setCropSearch(e.target.value)} 
                                        placeholder="Search commodity (e.g. Wheat, Rice)..." 
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm font-medium"
                                    />
                                </div>
                                
                                {/* Filters Group */}
                                <div className="flex gap-2 overflow-x-auto no-scrollbar items-center">
                                    <div className="relative min-w-[140px]">
                                        <FilterIcon className="absolute left-3 top-3.5 w-3.5 h-3.5 text-gray-400" />
                                        <select value={selectedState} onChange={(e) => {setSelectedState(e.target.value); setSelectedDistrict(''); setSelectedMarket('');}} className="w-full pl-9 pr-8 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary focus:outline-none appearance-none text-sm font-medium cursor-pointer">
                                            <option value="">All States</option>
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="relative min-w-[140px]">
                                        <select value={selectedDistrict} onChange={(e) => {setSelectedDistrict(e.target.value); setSelectedMarket('');}} disabled={!selectedState} className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary focus:outline-none appearance-none text-sm font-medium cursor-pointer disabled:opacity-50">
                                            <option value="">All Districts</option>
                                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="relative min-w-[140px]">
                                        <select value={selectedMarket} onChange={e => setSelectedMarket(e.target.value)} disabled={!selectedDistrict} className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary focus:outline-none appearance-none text-sm font-medium cursor-pointer disabled:opacity-50">
                                            <option value="">All Markets</option>
                                            {markets.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                    
                                    {/* Toggle View Button */}
                                    <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                                        <button 
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-black shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                            title="List View"
                                        >
                                            <LayoutGridIcon className="w-5 h-5"/>
                                        </button>
                                        <button 
                                            onClick={() => setViewMode('map')}
                                            className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-white dark:bg-black shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                            title="Map View"
                                        >
                                            <MapPinIcon className="w-5 h-5"/>
                                        </button>
                                    </div>

                                    <button onClick={resetFilters} className="px-4 py-3 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors" title="Reset Filters">
                                        <RefreshCwIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content View Switcher */}
                    {viewMode === 'map' ? (
                        <div className="animate-fadeIn">
                            <MandiLocator data={filteredData} />
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden animate-fadeIn">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-100 dark:border-gray-800">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Commodity</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Market</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Price Range</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Modal Price</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {filteredData.length > 0 ? filteredData.slice(0, 50).map((item, index) => (
                                            <tr 
                                                key={index} 
                                                onClick={() => handleRowClick(item)}
                                                className={`group cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-slate-800/50 relative ${selectedItem === item ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-1 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        <span className="font-bold text-gray-900 dark:text-white text-base">{item.commodity}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-700 dark:text-gray-300">{item.market}</div>
                                                    <div className="text-xs text-gray-500">{item.district}, {item.state}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="text-xs text-gray-500 font-mono">₹{item.min_price} - ₹{item.max_price}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-lg font-black text-primary tracking-tight">₹{item.modal_price}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                                        item.forecast.trend === 'up' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' : 
                                                        item.forecast.trend === 'down' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400' : 
                                                        'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                                                    }`}>
                                                        {item.forecast.trend === 'up' && <TrendingUpIcon className="w-3 h-3 mr-1"/>}
                                                        {item.forecast.trend === 'down' && <TrendingDownIcon className="w-3 h-3 mr-1"/>}
                                                        {item.forecast.trend === 'stable' && <ActivityIcon className="w-3 h-3 mr-1"/>}
                                                        {item.forecast.percent}%
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="text-center py-20">
                                                    <div className="flex flex-col items-center justify-center text-gray-400 opacity-60">
                                                        <SearchIcon className="w-16 h-16 mb-4 stroke-1"/>
                                                        <p className="font-semibold text-lg">No markets found</p>
                                                        <p className="text-sm">Try adjusting your filters or search query.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Analytics Side Panel */}
                {selectedItem && (
                    <div className="w-full lg:w-auto fixed lg:static inset-0 z-40 lg:z-auto bg-black/20 lg:bg-transparent flex justify-end transition-opacity duration-300" onClick={() => setSelectedItem(null)}>
                        <div onClick={e => e.stopPropagation()}>
                            <MarketAnalyticsPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .mask-linear-fade {
                    mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                }
            `}</style>
        </div>
    );
};

export default LiveMandiPrices;
