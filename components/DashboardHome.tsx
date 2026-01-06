
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
    CalendarIcon, CheckCircleIcon, MapPinIcon, 
    TrendingUpIcon, ActivityIcon, LeafIcon, DropletsIcon, 
    ThermometerIcon, LayersIcon, WindIcon, AlertTriangleIcon, 
    ChevronRightIcon, CloudSunIcon, DollarSignIcon, MicroscopeIcon, 
    ShovelIcon, ShoppingCartIcon, SproutIcon, CloudRainIcon,
    BarChart2Icon
} from './icons';
import { mockWeatherData } from '../data/weatherData';
import { cropCycleData } from '../data/cropCycleData';
import { getRealWeatherForecast } from '../services/weatherService';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { liveMandiPriceData } from '../data/liveMandiPriceData';

// --- Sub-Components ---

// 1. 3D Crop Card
const DashboardCropCard: React.FC<{ crop: any; onClick: () => void }> = ({ crop, onClick }) => (
    <div onClick={onClick} className="min-w-[150px] relative group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-[2rem] z-10 pointer-events-none group-hover:opacity-80 transition-opacity"></div>
        <div className="bg-white dark:bg-[#1e293b] p-3 pb-5 rounded-[2rem] shadow-lg border border-gray-100 dark:border-white/5 flex flex-col items-center transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl h-full">
            <div className="w-20 h-20 rounded-full shadow-lg mb-3 -mt-8 relative z-20 ring-4 ring-white dark:ring-[#1e293b]">
                <img src={crop.imageUrl} alt={crop.name} className="w-full h-full rounded-full object-cover"/>
                <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-white dark:border-[#1e293b] flex items-center justify-center ${crop.healthScore > 80 ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    <ActivityIcon className="w-3 h-3 text-white"/>
                </div>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-base mb-0.5">{crop.name}</h4>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-3">{crop.fieldArea} Acres</p>
            
            <div className="w-full px-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(((crop.currentStageIndex + 1) / crop.stages.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-600 h-full rounded-full" 
                        style={{ width: `${((crop.currentStageIndex + 1) / crop.stages.length) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    </div>
);

// 2. Weather Hero Widget
const WeatherHero = ({ weather, navigate }: any) => (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#4facfe] to-[#00f2fe] dark:from-blue-700 dark:to-cyan-600 rounded-[2.5rem] shadow-2xl p-8 text-white h-full group cursor-pointer" onClick={() => navigate('../weather')}>
        {/* Background Decorations */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit mb-2 border border-white/20">
                        <MapPinIcon className="w-3 h-3"/>
                        <span className="text-xs font-bold">{weather.city}</span>
                    </div>
                    <p className="text-sm font-medium opacity-90">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="text-right">
                    <CloudSunIcon className="w-16 h-16 drop-shadow-lg text-yellow-300 animate-pulse-glow"/>
                </div>
            </div>

            <div className="mt-4">
                <h1 className="text-6xl font-black tracking-tighter drop-shadow-sm">{Math.round(weather.currentTemp)}°</h1>
                <p className="text-lg font-medium opacity-90">{weather.condition}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/20">
                <div className="text-center">
                    <WindIcon className="w-5 h-5 mx-auto mb-1 opacity-80"/>
                    <p className="text-xs font-bold">{weather.windSpeed} km/h</p>
                </div>
                <div className="text-center">
                    <DropletsIcon className="w-5 h-5 mx-auto mb-1 opacity-80"/>
                    <p className="text-xs font-bold">{weather.humidity}%</p>
                </div>
                <div className="text-center">
                    <CloudRainIcon className="w-5 h-5 mx-auto mb-1 opacity-80"/>
                    <p className="text-xs font-bold">12%</p>
                </div>
            </div>
        </div>
    </div>
);

const DashboardHome: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isOnline = useNetworkStatus();
    
    const [currentWeather, setCurrentWeather] = useState(mockWeatherData);
    
    useEffect(() => {
        if (isOnline) {
            const fetchWeather = async () => {
                try {
                    const data = await getRealWeatherForecast(13.0072, 76.1032);
                    setCurrentWeather(data);
                } catch (e) {
                    console.error(e);
                }
            };
            fetchWeather();
        }
    }, [isOnline]);

    const activeCrops = cropCycleData.slice(0, 5);
    const marketHighlights = liveMandiPriceData.slice(0, 3);

    // 3. Drone Monitor Component
    const FieldMonitorHero = () => (
        <div className="relative w-full h-[22rem] rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer border-4 border-white dark:border-[#1e293b] ring-1 ring-gray-200 dark:ring-gray-700" onClick={() => navigate('../crop-monitoring')}>
            <img 
                src="https://images.unsplash.com/photo-1625246333195-5519a12860ca?q=80&w=1000&auto=format&fit=crop" 
                alt="Field Monitor" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30"></div>
            
            {/* AR Overlays */}
            <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-2xl flex items-center gap-3 shadow-lg">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
                <div>
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Live Drone Feed</p>
                    <p className="text-sm font-bold">North Field • Sector 4</p>
                </div>
            </div>

            {/* Scan Lines Animation */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_0%,_rgba(50,255,50,0.4)_50%,_transparent_100%)] bg-[length:100%_200%] animate-scan"></div>

            {/* Floating Data Points */}
            <div className="absolute top-1/3 left-1/3 group/marker">
                <div className="relative">
                    <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] animate-ping absolute"></div>
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white relative z-10"></div>
                    {/* Tooltip */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-xl opacity-0 group-hover/marker:opacity-100 transition-opacity w-40">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Soil Analysis</p>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Nitrogen</span>
                            <span className="text-xs font-bold text-green-500">Good</span>
                        </div>
                         <div className="w-full bg-gray-200 h-1 mt-1 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full w-[80%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Glass Cards */}
            <div className="absolute bottom-6 left-6 right-6 flex gap-4 overflow-x-auto no-scrollbar">
                {[
                    { label: 'Moisture', val: '62%', status: 'Optimal', color: 'blue' },
                    { label: 'Growth', val: 'V3 Stage', status: '+2 Days Ahead', color: 'green' },
                    { label: 'Pest Risk', val: 'Low', status: 'Clear', color: 'yellow' },
                ].map((item, i) => (
                    <div key={i} className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl text-white min-w-[120px] hover:bg-white/20 transition-colors">
                        <div className={`w-8 h-8 rounded-full bg-${item.color}-500/20 flex items-center justify-center mb-2`}>
                            {i===0 && <DropletsIcon className={`w-4 h-4 text-${item.color}-400`}/>}
                            {i===1 && <LayersIcon className={`w-4 h-4 text-${item.color}-400`}/>}
                            {i===2 && <MicroscopeIcon className={`w-4 h-4 text-${item.color}-400`}/>}
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{item.val}</p>
                        <p className="text-[10px] uppercase font-bold text-gray-300 mt-1">{item.label}</p>
                    </div>
                ))}
            </div>
            
            <style>{`
                @keyframes scan {
                    0% { background-position: 0% -100%; }
                    100% { background-position: 0% 200%; }
                }
                .animate-scan { animation: scan 3s linear infinite; }
            `}</style>
        </div>
    );

    const StatPill = ({ label, value, icon: Icon, color, onClick }: any) => (
        <button onClick={onClick} className="bg-white dark:bg-[#1e293b] p-4 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-1 transition-all group h-full relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-500`}>
                 <Icon className={`w-16 h-16 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div className={`p-3.5 rounded-full ${color} text-white shadow-md group-hover:scale-110 transition-transform relative z-10`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-center relative z-10">
                <h3 className="text-xl font-black text-gray-900 dark:text-white">{value}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</p>
            </div>
        </button>
    );

    const QuickToolRow = ({ label, icon: Icon, color, onClick }: any) => (
        <button 
            onClick={onClick}
            className="flex items-center w-full p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-[#1e293b] border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all group"
        >
            <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600 dark:text-${color.split('-')[1]}-400 mr-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5"/>
            </div>
            <span className="font-bold text-gray-700 dark:text-gray-200 text-sm flex-grow text-left">{label}</span>
            <div className="w-6 h-6 rounded-full bg-white dark:bg-black flex items-center justify-center shadow-sm">
                <ChevronRightIcon className="w-3 h-3 text-gray-400"/>
            </div>
        </button>
    );

    return (
        <div className="max-w-[1400px] mx-auto pb-20 font-sans space-y-8 animate-fadeIn px-2 md:px-6">
            
            {/* 1. Header & Greeting */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">Good Morning,</span><br/>
                        Narayan K.
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4"/>
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => navigate('../profile')} className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700 border-2 border-white dark:border-slate-600 shadow-md flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300">
                        NK
                    </button>
                </div>
            </div>

            {/* 2. Primary Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN (8/12) */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Top Row: Weather & Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-72">
                        <WeatherHero weather={currentWeather} navigate={navigate} />
                        <div className="grid grid-cols-2 gap-4 h-full">
                            <StatPill label="My Crops" value={cropCycleData.length} icon={LeafIcon} color="bg-green-500" onClick={() => navigate('../crop-monitoring')} />
                            <StatPill label="Tasks Due" value="3" icon={CheckCircleIcon} color="bg-red-500" onClick={() => {}} />
                            <StatPill label="Expenses" value="₹2.5k" icon={DollarSignIcon} color="bg-purple-500" onClick={() => navigate('../expense-tracker')} />
                            <StatPill label="Market" value="+5%" icon={TrendingUpIcon} color="bg-blue-500" onClick={() => navigate('../live-prices')} />
                        </div>
                    </div>

                    {/* Field Monitor */}
                    <FieldMonitorHero />

                    {/* Active Crops Rail */}
                    <div>
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                <SproutIcon className="w-6 h-6 mr-2 text-green-600"/> Active Cultivation
                            </h3>
                            <button onClick={() => navigate('../crop-monitoring')} className="text-sm font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
                                Manage All
                            </button>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-8 pt-4 px-2 no-scrollbar snap-x">
                            {activeCrops.map(crop => (
                                <div key={crop.id} className="snap-start">
                                    <DashboardCropCard crop={crop} onClick={() => navigate('../crop-monitoring')} />
                                </div>
                            ))}
                            <button 
                                onClick={() => navigate('../crop-monitoring')}
                                className="min-w-[140px] flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-400 hover:border-primary hover:text-primary transition-all group h-[220px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                                    <span className="text-2xl">+</span>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">Add Crop</span>
                            </button>
                        </div>
                    </div>

                    {/* Yield Analytics */}
                    <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Yield Projection</h3>
                                <p className="text-sm text-gray-500">Based on current soil & weather data</p>
                            </div>
                            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
                                <button className="px-4 py-1.5 bg-white dark:bg-slate-700 shadow-sm rounded-lg text-xs font-bold text-gray-800 dark:text-white">Volume</button>
                                <button className="px-4 py-1.5 text-xs font-bold text-gray-500">Revenue</button>
                            </div>
                        </div>
                        
                        <div className="h-48 flex items-end justify-between gap-4 relative z-10">
                             {[35, 45, 60, 50, 75, 85, 80].map((h, i) => (
                                 <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                     <div className="w-full bg-gray-50 dark:bg-slate-800 rounded-2xl relative h-40 overflow-hidden">
                                         <div 
                                             className={`absolute bottom-0 w-full rounded-2xl transition-all duration-1000 group-hover:opacity-80 ${i === 6 ? 'bg-gradient-to-t from-green-600 to-green-400' : 'bg-gradient-to-t from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600'}`} 
                                             style={{ height: `${h}%` }}
                                         ></div>
                                     </div>
                                     <span className={`text-xs font-bold uppercase ${i === 6 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                                        Week {i + 1}
                                     </span>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (4/12) */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Market Widget */}
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center">
                                <TrendingUpIcon className="w-5 h-5 mr-2 text-blue-500"/> Market Live
                            </h3>
                            <button onClick={() => navigate('../live-prices')} className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                                Full Report
                            </button>
                        </div>
                        <div className="space-y-4">
                            {marketHighlights.map((m, i) => (
                                <div key={i} className="group relative bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{m.commodity}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wide">{m.market}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${m.forecast.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
                                            {m.forecast.trend === 'up' ? '▲' : '▼'} {m.forecast.percent}%
                                        </span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">₹{m.modal_price}</p>
                                        {/* Mini Sparkline SVG */}
                                        <svg width="60" height="20" viewBox="0 0 60 20" className="opacity-50">
                                            <path d={`M 0,10 Q 15,${m.forecast.trend === 'up' ? 0 : 20} 30,10 T 60,${m.forecast.trend === 'up' ? 0 : 20}`} fill="none" stroke={m.forecast.trend === 'up' ? '#16a34a' : '#ef4444'} strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Tools Dock */}
                    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5">
                        <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4 px-2">Quick Actions</h3>
                        <div className="space-y-2">
                            <QuickToolRow label="Scan Pest/Disease" icon={MicroscopeIcon} color="bg-red-500" onClick={() => navigate('../pest-detector')} />
                            <QuickToolRow label="Soil Analysis" icon={ShovelIcon} color="bg-amber-500" onClick={() => navigate('../soil-analysis')} />
                            <QuickToolRow label="Buy Inputs" icon={ShoppingCartIcon} color="bg-blue-500" onClick={() => navigate('../marketplace')} />
                            <QuickToolRow label="Sell Produce" icon={DollarSignIcon} color="bg-green-500" onClick={() => navigate('../marketplace')} />
                            <QuickToolRow label="Yield Predictor" icon={BarChart2Icon} color="bg-purple-500" onClick={() => navigate('../yield-predictor')} />
                        </div>
                    </div>

                    {/* Storage Risk Card */}
                    <div className="relative bg-[#111] rounded-[2rem] p-8 text-white overflow-hidden shadow-2xl group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 text-red-400">
                                <AlertTriangleIcon className="w-5 h-5"/>
                                <span className="text-xs font-bold uppercase tracking-widest">Risk Alert</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">Storage: Silo B</h3>
                            <p className="text-gray-400 text-sm mb-6">Wheat Stock</p>
                            
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-6xl font-black text-yellow-400 leading-none">74%</span>
                                <span className="text-sm font-bold text-gray-400 mb-2">Humidity</span>
                            </div>
                            
                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mb-4">
                                <div className="bg-gradient-to-r from-yellow-400 to-red-500 h-full w-[74%] animate-pulse"></div>
                            </div>

                            <div className="flex gap-2">
                                <span className="text-[10px] bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg font-bold border border-red-500/30">Action Required</span>
                            </div>
                        </div>
                        
                        {/* Background Effect */}
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all duration-500"></div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
