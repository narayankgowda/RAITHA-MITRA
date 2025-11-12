import React, { useState, useMemo } from 'react';
import { vetData, Vet } from '../data/vetData';
import { calculateDistance, Coordinates } from '../utils/locationUtils';
import Spinner from './Spinner';
import { MapPinIcon, PhoneIcon } from './icons';

interface VetWithDistance extends Vet {
    distance?: number;
}

const VetConnect: React.FC = () => {
    const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
    const [vets, setVets] = useState<VetWithDistance[]>(vetData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFindVets = () => {
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
                    const vetsWithDist = vetData.map(vet => ({
                        ...vet,
                        distance: calculateDistance(location, vet.location),
                    })).sort((a, b) => a.distance - b.distance);
                    setVets(vetsWithDist);
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
    
    return (
        <div>
             <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">Connect with a Veterinarian</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Find qualified vets near you for professional animal care.</p>
            </div>

            {!userLocation && (
                <div className="text-center p-8">
                     {isLoading ? (
                        <Spinner />
                    ) : (
                        <button
                            onClick={handleFindVets}
                            className="flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-md"
                        >
                            <MapPinIcon className="w-5 h-5 mr-2" />
                            Find Vets Near Me
                        </button>
                    )}
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vets.map(vet => (
                    <div key={vet.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-md p-4 flex flex-col items-center text-center border border-border-light dark:border-border-dark">
                        <img src={vet.image} alt={vet.name} className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-primary" />
                        <h3 className="font-bold text-lg">{vet.name}</h3>
                        <p className="text-sm text-primary dark:text-primary-light font-semibold">{vet.specialty}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{vet.city}</p>
                        {vet.distance !== undefined && (
                             <p className="text-xs font-bold my-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{vet.distance.toFixed(1)} km away</p>
                        )}
                        <div className="flex items-center mt-2">
                             <span className='text-yellow-400'>★</span>
                             <span className="text-sm font-semibold ml-1">{vet.rating}</span>
                        </div>
                        <a href={`tel:${vet.phone}`} className="mt-4 w-full flex items-center justify-center py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                            <PhoneIcon className="w-4 h-4 mr-2" />
                            {vet.phone}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VetConnect;
