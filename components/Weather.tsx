
import React, { useState, useEffect, useRef } from 'react';
import { WeatherData, mockWeatherData } from '../data/weatherData';
import { getRealWeatherForecast } from '../services/weatherService';
import { getWeatherIcon } from '../utils/weatherUtils';
import { 
    WindIcon, SunriseIcon, DropletsIcon, SunIcon, MapPinIcon, 
    RefreshCwIcon, ActivityIcon, EyeIcon, ThermometerIcon,
    LeafIcon, NavigationIcon, MoonIcon, CloudIcon, CalendarIcon,
    PlayCircleIcon
} from './icons';
import Spinner from './Spinner';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const KARNATAKA_CITIES = [
    { name: 'Hassan', lat: 13.0072, lon: 76.1032 },
    { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
    { name: 'Mysuru', lat: 12.2958, lon: 76.6394 },
    { name: 'Hubballi', lat: 15.3647, lon: 75.1240 },
    { name: 'Belagavi', lat: 15.8497, lon: 74.4977 },
    { name: 'Mangaluru', lat: 12.9141, lon: 74.8560 },
];

// --- Map Component with Timeline ---
const WeatherMap = ({ lat, lon }: { lat: number, lon: number }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const [timeValue, setTimeValue] = useState(0); 
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setTimeValue(prev => {
                    if (prev >= 100) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + 1;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    useEffect(() => {
        const L = (window as any).L;
        if (!mapRef.current || !L) return;

        if (mapInstance.current) {
            mapInstance.current.setView([lat, lon], 10);
            return;
        }

        const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([lat, lon], 10);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        const markerIcon = L.divIcon({
            className: 'custom-weather-marker',
            html: `<div style="background-color: #fbbf24; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(251,191,36,0.6);"></div>`,
            iconSize: [14, 14]
        });

        L.marker([lat, lon], { icon: markerIcon }).addTo(map);
        mapInstance.current = map;

        return () => {
            if(mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [lat, lon]);

    const getTimeLabel = () => {
        if (timeValue < 10) return 'NOW';
        const hours = Math.floor((timeValue / 100) * 12);
        return `+${hours}h`;
    };

    return (
        <div className="relative w-full h-[400px] bg-[#1e293b] rounded-2xl overflow-hidden shadow-lg border border-white/5">
            <div ref={mapRef} className="w-full h-full z-0 opacity-80" />
            
            {/* Top Toolbar */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
                {['Temp', 'Rain', 'Wind', 'Radar'].map((layer, i) => (
                    <button key={i} className={`p-2 rounded-lg backdrop-blur-md border border-white/10 text-xs font-bold ${i===0 ? 'bg-yellow-500 text-black' : 'bg-black/60 text-white'}`}>
                        {layer === 'Temp' && <div className="flex items-center"><ThermometerIcon className="w-4 h-4 mr-1"/> Temp</div>}
                        {layer === 'Rain' && <div className="flex items-center"><DropletsIcon className="w-4 h-4 mr-1"/> Rain</div>}
                        {layer === 'Wind' && <div className="flex items-center"><WindIcon className="w-4 h-4 mr-1"/> Wind</div>}
                        {layer === 'Radar' && <div className="flex items-center"><ActivityIcon className="w-4 h-4 mr-1"/> Radar</div>}
                    </button>
                ))}
            </div>

            {/* Bottom Timeline Player */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-xl p-3 border border-white/10 z-10 flex items-center gap-4">
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                    {isPlaying ? (
                        <div className="w-3 h-3 bg-white rounded-sm"></div>
                    ) : (
                        <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-1"></div>
                    )}
                </button>
                <div className="flex-1 relative h-1 bg-white/20 rounded-full cursor-pointer group">
                    <div className="absolute top-0 left-0 h-full bg-yellow-500 rounded-full transition-all duration-75 ease-linear" style={{ width: `${timeValue}%` }}></div>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={timeValue}
                        onChange={(e) => setTimeValue(parseInt(e.target.value))}
                        className="absolute top-[-6px] left-0 w-full h-4 opacity-0 cursor-pointer z-20"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full border-2 border-black transition-all duration-75 ease-linear z-10" style={{ left: `${timeValue}%` }}></div>
                </div>
                <div className="text-xs font-mono font-bold text-white w-12 text-right">{getTimeLabel()}</div>
            </div>
        </div>
    );
};

// --- Detailed Visuals ---

const SunArc = ({ weather }: { weather: WeatherData }) => (
    <div className="relative h-24 mt-2">
        <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
            <path d="M 10 100 Q 100 10 190 100" fill="none" stroke="url(#sunGradientWeather)" strokeWidth="4" strokeLinecap="round" />
            <defs>
                <linearGradient id="sunGradientWeather" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#fcd34d" /> 
                    <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
            </defs>
            <circle cx="100" cy="55" r="8" fill="#fbbf24" className="shadow-[0_0_15px_#fbbf24] animate-pulse" />
            <circle cx="10" cy="100" r="4" fill="white" />
            <circle cx="190" cy="100" r="4" fill="white" />
        </svg>
        <div className="flex justify-between text-xs text-gray-400 -mt-2 font-bold px-2">
            <span>{weather.sunrise}</span>
            <span>{weather.sunset}</span>
        </div>
        <p className="text-center text-xs text-yellow-500 font-bold mt-1">11 hrs 23 mins</p>
    </div>
);

const MoonPhaseWidget = ({ phase }: { phase: string }) => (
    <div className="flex flex-col items-center justify-center h-full">
        <div className="relative w-16 h-16 mb-2">
            <div className="absolute inset-0 rounded-full border-2 border-gray-600"></div>
            <div className="absolute inset-0 rounded-full bg-yellow-100 overflow-hidden">
                <div className="w-1/2 h-full bg-gray-800 absolute right-0"></div>
            </div>
        </div>
        <p className="text-2xl font-bold text-white">89%</p>
        <p className="text-xs text-gray-400">{phase}</p>
    </div>
);

const TrendChart = ({ data }: { data: any[] }) => {
    if(!data || !data.length) return null;
    const max = Math.max(...data.map(d => d.high));
    const min = Math.min(...data.map(d => d.low));
    const height = 150;
    
    // Create points string
    const highPoints = data.map((d, i) => `${(i / (data.length - 1)) * 100},${height - ((d.high - min) / (max - min)) * height}`).join(' ');
    const lowPoints = data.map((d, i) => `${(i / (data.length - 1)) * 100},${height - ((d.low - min) / (max - min)) * height}`).join(' ');

    return (
        <div className="relative w-full h-48 bg-[#1e293b] rounded-2xl p-4 border border-white/5 overflow-hidden">
            <h4 className="text-sm font-bold text-gray-300 mb-4 flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span> Temperature Trend</h4>
            <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full h-[120px] overflow-visible">
                <defs>
                    <linearGradient id="trendFillWeather" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                    </linearGradient>
                </defs>
                <path d={`M 0,${height - ((data[0].high - min) / (max - min)) * height} ${highPoints.split(' ').map(p => 'L ' + p).join(' ')} L ${data[data.length-1].day},${height} L 0,${height} Z`} fill="none" /> 
                <polyline points={highPoints} fill="none" stroke="#ef4444" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <polyline points={lowPoints} fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
            </svg>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Start</span>
                <span>End</span>
            </div>
        </div>
    );
};

const Weather: React.FC = () => {
    const isOnline = useNetworkStatus();
    const [weather, setWeather] = useState<WeatherData>(mockWeatherData);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState(KARNATAKA_CITIES[0]);

    const fetchWeather = async () => {
        setIsLoading(true);
        try {
            if (isOnline) {
                const data = await getRealWeatherForecast(selectedCity.lat, selectedCity.lon);
                setWeather(data);
            } else {
                setWeather({...mockWeatherData, city: selectedCity.name});
            }
        } catch (e) { 
            console.error(e);
            // On failure, revert to mock data to prevent crash
            setWeather({...mockWeatherData, city: selectedCity.name});
        } 
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchWeather(); }, [selectedCity, isOnline]);

    return (
        <div className="min-h-screen bg-[#0b1120] text-gray-100 font-sans p-6 animate-fadeIn pb-24">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* 1. Header Section */}
                <div className="bg-[#162032] rounded-3xl p-6 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex flex-col lg:flex-row justify-between gap-8 relative z-10">
                        {/* Current Weather */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-6">
                                <div className="group relative">
                                    <button className="flex items-center gap-2 text-2xl font-bold hover:text-blue-400 transition-colors">
                                        <MapPinIcon className="w-6 h-6 text-blue-500" /> {weather.city}, KA
                                        <NavigationIcon className="w-4 h-4 opacity-50"/>
                                    </button>
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-[#1e293b] rounded-xl shadow-xl border border-white/10 hidden group-hover:block z-50 overflow-hidden">
                                        {KARNATAKA_CITIES.map(c => (
                                            <button key={c.name} onClick={() => setSelectedCity(c)} className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 border-b border-white/5 last:border-0">
                                                {c.name}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                                <button onClick={fetchWeather} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                    <RefreshCwIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}/>
                                </button>
                            </div>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-24 h-24">
                                    {getWeatherIcon(weather.condition, "w-full h-full text-yellow-400 drop-shadow-lg")}
                                </div>
                                <div>
                                    <h1 className="text-7xl font-bold tracking-tighter text-white">{weather.currentTemp}°<span className="text-3xl font-normal text-gray-400">C</span></h1>
                                    <p className="text-xl font-medium text-blue-200">{weather.condition}</p>
                                    <p className="text-sm text-gray-400 mt-1">Feels like {weather.feelsLike}°</p>
                                </div>
                            </div>
                            
                            <p className="text-base text-gray-300 mb-6">
                                The skies will be {weather.condition.toLowerCase()}. The low will be {weather.low}°.
                            </p>

                            <div className="grid grid-cols-4 gap-4 border-t border-white/5 pt-6">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Air Quality</p>
                                    <p className="text-lg font-bold flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${weather.airQuality.index < 100 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                        {weather.airQuality.index}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Wind</p>
                                    <p className="text-lg font-bold">{weather.windSpeed} <span className="text-xs font-normal">km/h</span></p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Humidity</p>
                                    <p className="text-lg font-bold">{weather.humidity}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Visibility</p>
                                    <p className="text-lg font-bold">{weather.visibility} <span className="text-xs font-normal">km</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Map Preview */}
                        <div className="lg:w-1/3 h-64 lg:h-auto rounded-2xl overflow-hidden relative border border-white/10 group cursor-pointer">
                            <WeatherMap lat={weather.coordinates.lat} lon={weather.coordinates.lon} />
                            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs font-bold text-gray-300">Live Radar</p>
                                        <p className="text-xs text-gray-500">Precipitation & Clouds</p>
                                    </div>
                                    <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">Open Map</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Hourly & Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Hourly Scroll */}
                    <div className="lg:col-span-3 bg-[#162032] p-6 rounded-2xl border border-white/5">
                        <div className="flex gap-4 mb-4">
                            <button className="px-4 py-1.5 bg-yellow-500 text-black text-xs font-bold rounded-full">Overview</button>
                            <button className="px-4 py-1.5 bg-white/5 text-gray-400 text-xs font-bold rounded-full hover:bg-white/10">Precipitation</button>
                            <button className="px-4 py-1.5 bg-white/5 text-gray-400 text-xs font-bold rounded-full hover:bg-white/10">Wind</button>
                        </div>
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                            {weather.hourly && weather.hourly.length > 0 ? weather.hourly.map((h, i) => (
                                <div key={i} className={`flex-shrink-0 flex flex-col items-center p-4 rounded-2xl min-w-[80px] border border-white/5 transition-all ${i===0 ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-lg' : 'bg-black/20'}`}>
                                    <span className="text-xs font-bold mb-2 opacity-80">{h.time}</span>
                                    <div className="w-8 h-8 mb-2">{getWeatherIcon(h.icon, "w-full h-full")}</div>
                                    <span className="text-lg font-bold">{h.temp}°</span>
                                    <div className="h-4 flex items-center justify-center mt-1">
                                        {h.pop && h.pop > 0 ? (
                                            <span className="text-[9px] font-bold text-blue-300 flex items-center"><DropletsIcon className="w-2 h-2 mr-0.5"/> {Math.round(h.pop * 100)}%</span>
                                        ) : null}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-gray-500 text-sm">Hourly forecast unavailable</p>
                            )}
                        </div>
                    </div>

                    {/* Detail Widgets */}
                    <div className="bg-[#162032] p-5 rounded-2xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <span className="text-xs font-bold text-gray-400 uppercase">UV Index</span>
                            <SunIcon className="w-4 h-4 text-yellow-500"/>
                        </div>
                        <div className="relative h-24 flex items-center justify-center z-10">
                            {/* Gauge Background */}
                            <div className="absolute inset-0 border-[10px] border-gray-700 rounded-full border-b-transparent rotate-[135deg]"></div>
                            {/* Gauge Fill - Dynamic based on value */}
                            <div 
                                className="absolute inset-0 border-[10px] border-transparent border-t-yellow-500 rounded-full transition-transform duration-1000"
                                style={{ transform: `rotate(${45 + (weather.uvIndex / 12) * 270}deg)` }} // Approximate mapping
                            ></div>
                            <span className="text-3xl font-bold mt-4">{weather.uvIndex}</span>
                        </div>
                        <p className="text-xs text-center text-gray-400 relative z-10">{weather.uvLabel}</p>
                    </div>

                    <div className="bg-[#162032] p-5 rounded-2xl border border-white/5 relative">
                        <span className="text-xs font-bold text-gray-400 uppercase absolute top-5 left-5">AQI</span>
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-20 h-20 rounded-full border-4 border-gray-700 flex items-center justify-center relative">
                                <div className={`absolute inset-0 rounded-full border-4 border-l-transparent border-b-transparent rotate-45 ${weather.airQuality.index < 100 ? 'border-green-500' : 'border-yellow-500'}`}></div>
                                <span className="text-2xl font-bold">{weather.airQuality.index}</span>
                            </div>
                            <p className="text-xs font-bold text-yellow-500 mt-2">{weather.airQuality.status}</p>
                        </div>
                    </div>

                    <div className="bg-[#162032] p-5 rounded-2xl border border-white/5">
                        <span className="text-xs font-bold text-gray-400 uppercase">Pressure</span>
                        <div className="relative mt-6 mb-2">
                            <div className="h-2 w-full bg-gradient-to-r from-blue-900 to-blue-400 rounded-full"></div>
                            <div className="absolute -top-1 left-[60%] w-4 h-4 bg-white rounded-full border-2 border-blue-500 shadow-lg transform -translate-x-1/2"></div>
                        </div>
                        <p className="text-2xl font-bold">{weather.pressure} <span className="text-xs font-normal text-gray-500">mb</span></p>
                        <p className="text-xs text-orange-500 flex items-center mt-1">↗ Rising</p>
                    </div>

                    <div className="bg-[#162032] p-5 rounded-2xl border border-white/5">
                        <span className="text-xs font-bold text-gray-400 uppercase">Sun</span>
                        <SunArc weather={weather} />
                    </div>

                    <div className="bg-[#162032] p-5 rounded-2xl border border-white/5">
                        <span className="text-xs font-bold text-gray-400 uppercase">Moon Phase</span>
                        <MoonPhaseWidget phase={weather.moonPhase} />
                    </div>

                    <div className="bg-[#162032] p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Visibility</span>
                            <EyeIcon className="w-4 h-4 text-blue-400"/>
                        </div>
                        <div className="flex flex-col gap-1 items-center justify-center">
                            <div className="w-16 h-1.5 bg-gray-700 rounded-full"></div>
                            <div className="w-20 h-1.5 bg-gray-700 rounded-full"></div>
                            <div className="w-24 h-1.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            <div className="w-20 h-1.5 bg-gray-700 rounded-full"></div>
                        </div>
                        <p className="text-2xl font-bold text-center mt-2">{weather.visibility} <span className="text-xs font-normal text-gray-400">km</span></p>
                    </div>
                </div>

                {/* 3. Monthly Calendar & Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Calendar */}
                    <div className="bg-[#162032] p-6 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-white">Monthly Forecast</h3>
                            <button className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded">
                                {new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="text-xs text-gray-500 font-bold mb-2">{d}</div>)}
                            {weather.calendar && weather.calendar.map((day, i) => (
                                <div key={i} className={`p-2 rounded-xl flex flex-col items-center justify-center aspect-square border ${day.isToday ? 'border-yellow-500 bg-yellow-500/10' : 'border-transparent hover:bg-white/5'}`}>
                                    <span className="text-xs text-gray-400 mb-1">{day.date}</span>
                                    <div className="w-6 h-6">{getWeatherIcon(day.icon, "w-full h-full")}</div>
                                    <div className="flex gap-1 mt-1 text-[10px]">
                                        <span className="text-white font-bold">{day.high}°</span>
                                        <span className="text-gray-500">{day.low}°</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Overview Circle */}
                        <div className="bg-[#162032] p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div className="relative w-32 h-32 rounded-full border-[8px] border-orange-500 border-l-blue-600 border-b-orange-500 transform -rotate-45 flex items-center justify-center">
                                <div className="text-center transform rotate-45">
                                    <p className="text-xs text-gray-400">{new Date().getFullYear()}</p>
                                    <p className="text-xl font-bold">{new Date().toLocaleString('default', { month: 'short' })}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div>
                                    <p className="text-gray-400 flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>Sunny/Cloudy</p>
                                    <p className="text-xl font-bold">{weather.monthlyOverview.sunnyDays}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 flex items-center"><span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>Rain/Snow</p>
                                    <p className="text-xl font-bold">{weather.monthlyOverview.rainDays}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Avg High</p>
                                    <p className="text-xl font-bold text-white">{weather.monthlyOverview.avgHigh}°</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Avg Low</p>
                                    <p className="text-xl font-bold text-white">{weather.monthlyOverview.avgLow}°</p>
                                </div>
                            </div>
                        </div>

                        {/* Trends Chart */}
                        <TrendChart data={weather.trends} />

                        {/* Climate Info Table */}
                        <div className="bg-[#162032] p-6 rounded-2xl border border-white/5">
                            <h3 className="font-bold text-sm text-gray-400 uppercase mb-4">Climate Information</h3>
                            <div className="space-y-4">
                                {weather.climateStats && weather.climateStats.map((stat, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-lg ${stat.icon === 'hot' ? 'bg-red-500/20 text-red-500' : stat.icon === 'cold' ? 'bg-blue-500/20 text-blue-500' : stat.icon === 'wet' ? 'bg-blue-400/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {stat.icon === 'hot' ? <ThermometerIcon className="w-4 h-4"/> : stat.icon === 'cold' ? <ThermometerIcon className="w-4 h-4"/> : stat.icon === 'wet' ? <DropletsIcon className="w-4 h-4"/> : <WindIcon className="w-4 h-4"/>}
                                            </div>
                                            <span className="text-white font-medium">{stat.label}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-white font-bold">{stat.month}</span>
                                            <span className="text-xs text-gray-500">{stat.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Weather;
