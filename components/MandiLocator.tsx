import React, { useState, useMemo } from 'react';
import { mandiData, Mandi } from '../data/mandiData';
import { calculateDistance, Coordinates } from '../utils/locationUtils';
import Spinner from './Spinner';
import { MapPinIcon, TrendingUpIcon, ClockIcon, NavigationIcon } from './icons';

interface MandiWithDistance extends Mandi {
    distance: number;
}

const MandiLocator: React.FC = () => {
    const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
    const [mandis, setMandis] = useState<MandiWithDistance[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMandi, setSelectedMandi] = useState<MandiWithDistance | null>(null);
    const [selectedCrop, setSelectedCrop] = useState<string>('All');

    const handleFindMarkets = () => {
        setIsLoading(true);
        setError(null);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setUserLocation(location);
                    const mandisWithDist = mandiData.map(mandi => ({
                        ...mandi,
                        distance: calculateDistance(location, mandi.location),
                    })).sort((a, b) => a.distance - b.distance);
                    setMandis(mandisWithDist);
                    setSelectedMandi(mandisWithDist[0]);
                    setIsLoading(false);
                },
                (err) => {
                    setError(`Error getting location: ${err.message}. Please enable location services.`);
                    setIsLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setIsLoading(false);
        }
    };

    const uniqueCrops = useMemo(() => {
        const allCrops = mandis.flatMap(mandi => mandi.crops.map(crop => crop.name));
        return ['All', ...Array.from(new Set(allCrops))];
    }, [mandis]);

    const bestMandiForCrop = useMemo(() => {
        if (selectedCrop === 'All' || mandis.length === 0) return null;
        
        let bestMandi: MandiWithDistance | null = null;
        let maxPrice = -1;

        mandis.forEach(mandi => {
            const crop = mandi.crops.find(c => c.name === selectedCrop);
            if (crop && crop.price > maxPrice) {
                maxPrice = crop.price;
                bestMandi = mandi;
            }
        });
        return bestMandi;

    }, [selectedCrop, mandis]);


    if (!userLocation) {
        return (
            <div className="text-center flex flex-col items-center justify-center min-h-[400px]">
                <MapPinIcon className="w-16 h-16 text-primary dark:text-primary-light mb-4" />
                <h2 className="text-2xl font-bold mb-2">Find Nearby Mandi Prices</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">Get real-time market prices for your crops by finding the agricultural markets closest to you.</p>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <button
                        onClick={handleFindMarkets}
                        className="flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                    >
                        <MapPinIcon className="w-5 h-5 mr-2" />
                        Find Nearby Markets
                    </button>
                )}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-8">
            {/* Left Panel: Controls and List */}
            <div>
                <div className="mb-4">
                    <label htmlFor="crop-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Find best price for:
                    </label>
                    <select
                        id="crop-select"
                        value={selectedCrop}
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-border-light dark:border-border-dark rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                        {uniqueCrops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                    </select>
                </div>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {mandis.map(mandi => (
                        <div
                            key={mandi.id}
                            onClick={() => setSelectedMandi(mandi)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedMandi?.id === mandi.id ? 'border-primary bg-green-50 dark:bg-green-900/20' : 'border-border-light dark:border-border-dark hover:border-primary/50'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{mandi.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{mandi.distance.toFixed(1)} km away</p>
                                </div>
                                {bestMandiForCrop?.id === mandi.id && (
                                     <span className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">Best Price</span>
                                )}
                            </div>
                            <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark">
                                <h4 className="text-sm font-semibold mb-1">Crop Prices (per quintal)</h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                    {mandi.crops.slice(0, 4).map(crop => (
                                        <div key={crop.name} className="flex justify-between">
                                            <span>{crop.name}</span>
                                            <span className="font-medium">₹{crop.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Map and Details */}
            <div className="flex flex-col">
                <div className="w-full h-64 bg-gray-200 dark:bg-slate-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    {/* Simulated Map */}
                    <img src="https://storage.googleapis.com/aistudio-marketplace-public-test-assets/map_placeholder.svg" className="w-full h-full object-cover opacity-30" alt="Map background"/>
                    {userLocation && <div className="absolute rounded-full w-4 h-4 bg-blue-500 border-2 border-white" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} title="Your Location"></div>}
                    {mandis.map(mandi => {
                        const angle = Math.atan2(mandi.location.latitude - userLocation.latitude, mandi.location.longitude - userLocation.longitude);
                        const mapDist = Math.min(mandi.distance * 2, 100);
                        const x = 50 + mapDist * Math.cos(angle);
                        const y = 50 + mapDist * Math.sin(angle);
                        return <div key={mandi.id} className={`absolute w-3 h-3 rounded-full transition-all ${selectedMandi?.id === mandi.id ? 'bg-primary scale-150' : 'bg-red-500'}`} style={{ top: `${y}%`, left: `${x}%`}} title={mandi.name}></div>
                    })}
                     <p className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">Map Simulation</p>
                </div>
                {selectedMandi && (
                    <div className="p-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
                        <h3 className="font-bold text-xl mb-2">{selectedMandi.name}</h3>
                        <div className="space-y-2">
                             <div className="flex items-center text-sm">
                                <ClockIcon className="w-4 h-4 mr-2 text-gray-500"/>
                                <span>{selectedMandi.hours}</span>
                            </div>
                            <div className="flex items-center text-sm">
                                <TrendingUpIcon className="w-4 h-4 mr-2 text-gray-500"/>
                                <span>{selectedMandi.crops.length} crops listed</span>
                            </div>
                        </div>
                        <button className="mt-4 w-full flex items-center justify-center py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
                            <NavigationIcon className="w-5 h-5 mr-2"/>
                            Get Directions
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MandiLocator;