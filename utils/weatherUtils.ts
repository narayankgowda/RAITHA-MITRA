import React from 'react';
import { 
    SunIcon, MoonIcon, CloudIcon, CloudRainIcon, 
    CloudLightningIcon, CloudDrizzleIcon, CloudFogIcon, CloudSnowIcon
} from '../components/icons';

export const getWeatherIcon = (iconIdentifier: string, className?: string): React.ReactNode => {
    const props = { className: className || "w-8 h-8" };
    const key = iconIdentifier.toLowerCase();
    
    switch (key) {
        case 'clear-day':
        case 'sunny':
            return React.createElement(SunIcon, props);
        case 'clear-night':
            return React.createElement(MoonIcon, props);
        case 'cloudy':
            return React.createElement(CloudIcon, props);
        case 'partly-cloudy-day':
        case 'partly-cloudy-night':
        case 'partly cloudy':
            return React.createElement(CloudIcon, props);
        case 'rain':
            return React.createElement(CloudRainIcon, props);
        case 'showers-day':
        case 'showers-night':
        case 'showers':
            return React.createElement(CloudDrizzleIcon, props);
        case 'thunderstorms-rain':
        case 'thunderstorms':
        case 'scattered thunderstorms':
            return React.createElement(CloudLightningIcon, props);
        case 'snow':
            return React.createElement(CloudSnowIcon, props);
        case 'fog':
            return React.createElement(CloudFogIcon, props);
        default:
            return React.createElement(CloudIcon, props);
    }
};