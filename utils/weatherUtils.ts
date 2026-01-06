
import React from 'react';
import { 
    SunIcon, MoonIcon, CloudIcon, CloudRainIcon, 
    CloudLightningIcon, CloudDrizzleIcon, CloudFogIcon, CloudSnowIcon
} from '../components/icons';

export const getWeatherIcon = (iconIdentifier: string, className?: string): React.ReactNode => {
    const props = { className: className || "w-8 h-8" };
    const key = iconIdentifier.toLowerCase().replace(/[-_]/g, ' ');
    
    if (key.includes('clear') || key.includes('sunny')) return React.createElement(SunIcon, props);
    if (key.includes('night')) return React.createElement(MoonIcon, props);
    if (key.includes('thunderstorm')) return React.createElement(CloudLightningIcon, props);
    if (key.includes('drizzle') || key.includes('shower')) return React.createElement(CloudDrizzleIcon, props);
    if (key.includes('rain')) return React.createElement(CloudRainIcon, props);
    if (key.includes('snow')) return React.createElement(CloudSnowIcon, props);
    if (key.includes('fog') || key.includes('mist') || key.includes('haze')) return React.createElement(CloudFogIcon, props);
    if (key.includes('cloud')) return React.createElement(CloudIcon, props);
    
    return React.createElement(SunIcon, props);
};
