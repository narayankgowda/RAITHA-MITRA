import React, { useState, useEffect } from 'react';
import { WeatherData } from '../data/weatherData';
import { getWeatherForecast } from '../services/geminiService';
import { getWeatherIcon } from '../utils/weatherUtils';
import { WindIcon, SunriseIcon, DropletsIcon, SunIcon, MapPinIcon } from './icons';
import Spinner from './Spinner';

const Weather: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = () => {
        setIsLoading(true);
        setError(null);
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const forecastData = await getWeatherForecast(latitude, longitude);
                    setWeather(forecastData);
                } catch (err) {
                    setError('Failed to fetch AI weather forecast. Please try again later.');
                } finally {
                    setIsLoading(false);
                }
            },
            (err) => {
                setError(`Unable to retrieve your location: ${err.message}. Please enable location services.`);
                setIsLoading(false);
            }
        );
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    const InfoTile: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-center space-x-3">
            <div className="text-primary dark:text-primary-light">{icon}</div>
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                <p className="font-bold text-lg">{value}</p>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <Spinner />
                <p className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-400">Fetching your local forecast...</p>
                <p className="text-sm text-gray-500">Please allow location access for an accurate report.</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <MapPinIcon className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-red-700 dark:text-red-300">Location Error</h3>
                <p className="text-red-600 dark:text-red-400 max-w-md my-2">{error}</p>
                <button 
                    onClick={fetchWeather}
                    className="mt-4 px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!weather) {
        return null;
    }
    
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold">Weather Forecast for {weather.city}</h2>
                <p className="text-gray-600 dark:text-gray-400">Real-time conditions to help you plan your farm activities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm border border-border-light dark:border-border-dark flex flex-col items-center justify-center text-center">
                    <div className="text-6xl text-primary dark:text-primary-light mb-2">
                        {getWeatherIcon(weather.condition, "w-20 h-20")}
                    </div>
                    <p className="text-5xl font-bold">{weather.currentTemp}°C</p>
                    <p className="font-semibold text-lg">{weather.condition}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Feels like {weather.feelsLike}°C</p>
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <InfoTile icon={<WindIcon className="w-6 h-6"/>} label="Wind Speed" value={`${weather.windSpeed} km/h`} />
                    <InfoTile icon={<DropletsIcon className="w-6 h-6"/>} label="Humidity" value={`${weather.humidity}%`} />
                    <InfoTile icon={<SunIcon className="w-6 h-6"/>} label="UV Index" value={`${weather.uvIndex} of 11`} />
                    <InfoTile icon={<SunriseIcon className="w-6 h-6"/>} label="Sunrise" value="6:15 AM" /> {/* Note: Sunrise/sunset not from API yet */}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-3">Hourly Forecast</h3>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    {weather.hourly.map((hour, index) => (
                        <div key={index} className="flex-shrink-0 w-24 text-center bg-gray-100 dark:bg-slate-700/50 p-3 rounded-lg">
                            <p className="font-semibold text-sm">{hour.time}</p>
                            <div className="my-2 text-primary dark:text-primary-light">{getWeatherIcon(hour.icon, "w-10 h-10 mx-auto")}</div>
                            <p className="font-bold text-lg">{hour.temp}°C</p>
                        </div>
                    ))}
                </div>
            </div>

             <div>
                <h3 className="text-xl font-semibold mb-3">7-Day Forecast</h3>
                <div className="space-y-2">
                    {weather.daily.map((day, index) => (
                         <div key={index} className="grid grid-cols-4 items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50">
                            <p className="font-semibold col-span-1">{day.day}</p>
                            <div className="col-span-1 flex items-center space-x-2">
                                {getWeatherIcon(day.icon, "w-8 h-8 text-primary dark:text-primary-light")}
                                <span className="hidden md:inline text-sm text-gray-600 dark:text-gray-400">{day.condition}</span>
                            </div>
                             <div className="col-span-2 text-right">
                                <span className="font-semibold">{day.high}°</span>
                                <span className="text-gray-500"> / {day.low}°</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Weather;