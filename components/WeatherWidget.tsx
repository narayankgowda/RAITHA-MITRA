import React from 'react';
import { mockWeatherData } from '../data/weatherData';
import { getWeatherIcon } from '../utils/weatherUtils';

interface WeatherWidgetProps {
  onNavigate: () => void;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ onNavigate }) => {
  const weather = mockWeatherData;

  return (
    <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-md border border-border-light dark:border-border-dark h-full flex flex-col">
      <h3 className="font-bold mb-2 text-lg">Weather in {weather.city}</h3>
      <div className="flex items-center gap-4">
        <div className="text-4xl text-primary dark:text-primary-light">
          {getWeatherIcon(weather.condition.toLowerCase().replace(' ', '-'), "w-16 h-16")}
        </div>
        <div>
          <p className="text-4xl font-bold">{weather.currentTemp}°C</p>
          <p className="text-gray-600 dark:text-gray-400">{weather.condition}</p>
        </div>
      </div>
      <div className="flex-grow mt-4 space-y-2">
        <p className="font-semibold text-sm">Forecast:</p>
        {weather.daily.slice(1, 4).map((day, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span>{day.day}</span>
            <div className="flex items-center gap-2">
              {getWeatherIcon(day.icon, "w-6 h-6 text-gray-500")}
              <span>{day.high}° / {day.low}°</span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onNavigate} className="mt-4 w-full text-sm text-center py-2 bg-primary-light text-white font-semibold rounded-lg hover:bg-primary transition-colors">
        View Full Forecast
      </button>
    </div>
  );
};

export default WeatherWidget;