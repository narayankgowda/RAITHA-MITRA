
import { WeatherData, HourlyForecast, DailyForecast } from '../data/weatherData';

const API_KEY = process.env.WEATHER_API_KEY || 'c3696cf540508bde31a94df08918dec2';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const mapIcon = (iconCode: string): string => {
    const code = iconCode.substring(0, 2);
    const day = iconCode.endsWith('d');
    
    switch(code) {
        case '01': return day ? 'clear-day' : 'clear-night';
        case '02': return day ? 'partly-cloudy-day' : 'partly-cloudy-night';
        case '03': return 'cloudy';
        case '04': return 'cloudy';
        case '09': return 'showers-day';
        case '10': return 'rain';
        case '11': return 'thunderstorms';
        case '13': return 'snow';
        case '50': return 'fog';
        default: return 'clear-day';
    }
};

const getDayName = (dateStr: string, index: number): string => {
    if (index === 0) return 'Today';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

// Approximate Moon Phase calculation
const getMoonPhase = (date: Date): { phase: string, icon: any } => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 3) { year--; month += 12; }
    ++month;
    let c = 365.25 * year;
    let e = 30.6 * month;
    let jd = c + e + day - 694039.09; // jd is total days elapsed
    jd /= 29.5305882; // divide by the moon cycle
    let b = parseInt(jd.toString()); // int(jd) -> b, take integer part of jd
    jd -= b; // subtract integer part to leave fractional part of original jd
    b = Math.round(jd * 8); // scale fraction from 0-8 and round
    if (b >= 8) b = 0; // 0 and 8 are the same so turn 8 into 0
    
    switch (b) {
        case 0: return { phase: 'New Moon', icon: 'new' };
        case 1: return { phase: 'Waxing Crescent', icon: 'waxing-crescent' };
        case 2: return { phase: 'First Quarter', icon: 'first-quarter' };
        case 3: return { phase: 'Waxing Gibbous', icon: 'waxing-gibbous' };
        case 4: return { phase: 'Full Moon', icon: 'full' };
        case 5: return { phase: 'Waning Gibbous', icon: 'waning-gibbous' };
        case 6: return { phase: 'Last Quarter', icon: 'last-quarter' };
        case 7: return { phase: 'Waning Crescent', icon: 'waning-crescent' };
        default: return { phase: 'Full Moon', icon: 'full' };
    }
};

const getAirQualityStatus = (aqi: number) => {
    // OpenWeatherMap returns AQI 1-5
    switch(aqi) {
        case 1: return { label: 'Good', desc: 'Air quality is considered satisfactory.' };
        case 2: return { label: 'Fair', desc: 'Air quality is acceptable.' };
        case 3: return { label: 'Moderate', desc: 'Members of sensitive groups may experience health effects.' };
        case 4: return { label: 'Poor', desc: 'Everyone may begin to experience health effects.' };
        case 5: return { label: 'Very Poor', desc: 'Health warnings of emergency conditions.' };
        default: return { label: 'Unknown', desc: 'No data available.' };
    }
}

export const getRealWeatherForecast = async (lat: number, lon: number): Promise<WeatherData> => {
    try {
        // 1. Fetch Current Weather
        const currentRes = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!currentRes.ok) throw new Error('Failed to fetch current weather');
        const currentData = await currentRes.json();

        // 2. Fetch 5 Day Forecast
        const forecastRes = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!forecastRes.ok) throw new Error('Failed to fetch forecast');
        const forecastData = await forecastRes.json();

        // 3. Fetch Air Pollution Data
        const airRes = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        let aqiData = { list: [{ main: { aqi: 1 } }] };
        if (airRes.ok) {
            aqiData = await airRes.json();
        }

        // Process Hourly (Take first 8 segments)
        const hourly: HourlyForecast[] = forecastData.list.slice(0, 8).map((item: any) => ({
            time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true }).replace(':00', ''),
            temp: Math.round(item.main.temp),
            condition: item.weather[0].main,
            icon: mapIcon(item.weather[0].icon),
            pop: item.pop // Probability of precipitation
        }));

        if (hourly.length > 0) {
            hourly[0].time = 'Now';
            hourly[0].temp = Math.round(currentData.main.temp);
        }

        // Process Daily
        const dailyMap: Record<string, { highs: number[], lows: number[], condition: string, icon: string, pops: number[] }> = {};
        forecastData.list.forEach((item: any) => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!dailyMap[date]) {
                dailyMap[date] = { highs: [], lows: [], condition: item.weather[0].main, icon: item.weather[0].icon, pops: [] };
            }
            dailyMap[date].highs.push(item.main.temp_max);
            dailyMap[date].lows.push(item.main.temp_min);
            dailyMap[date].pops.push(item.pop || 0);
            
            if (item.sys.pod === 'd') {
                 if(item.weather[0].main.includes('Rain')) {
                     dailyMap[date].condition = item.weather[0].main;
                     dailyMap[date].icon = item.weather[0].icon;
                 } else if (dailyMap[date].icon.includes('night')) {
                     dailyMap[date].condition = item.weather[0].main;
                     dailyMap[date].icon = item.weather[0].icon;
                 }
            }
        });

        const daily: DailyForecast[] = Object.keys(dailyMap).slice(0, 7).map((dateStr, index) => {
            const dayData = dailyMap[dateStr];
            return {
                day: getDayName(dateStr, index),
                date: formatDate(dateStr),
                high: Math.round(Math.max(...dayData.highs)),
                low: Math.round(Math.min(...dayData.lows)),
                condition: dayData.condition,
                icon: mapIcon(dayData.icon),
                pop: Math.max(...dayData.pops),
                summary: `Highs around ${Math.round(Math.max(...dayData.highs))}°`
            };
        });

        // --- Generate Rich Features from Basic Data ---
        
        // 1. Climate Stats (Mocked based on current temp)
        const currentHigh = Math.round(currentData.main.temp_max);
        const climateStats = [
            { label: 'Hottest month', month: 'March', value: `${currentHigh + 5}°`, icon: 'hot' },
            { label: 'Coldest month', month: 'December', value: `${currentHigh - 15}°`, icon: 'cold' },
            { label: 'Wettest month', month: 'July', value: '280mm', icon: 'wet' },
            { label: 'Windiest month', month: 'July', value: '28km/h', icon: 'wind' },
        ];

        // 2. Trends (Mock 15 days curve)
        const trends = Array.from({ length: 15 }, (_, i) => {
            const baseHigh = currentHigh;
            const baseLow = currentHigh - 10;
            return {
                day: `Day ${i+1}`,
                high: Math.round(baseHigh + Math.sin(i / 2) * 3),
                low: Math.round(baseLow + Math.sin(i / 2) * 2)
            };
        });

        // 3. Calendar (Current Month Mock)
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const calendar = Array.from({ length: daysInMonth }, (_, i) => {
            const dayNum = i + 1;
            const isToday = dayNum === today.getDate();
            const cond = dayNum % 5 === 0 ? 'Rain' : (dayNum % 3 === 0 ? 'Cloudy' : 'Sunny');
            const icon = cond === 'Rain' ? 'rain' : (cond === 'Cloudy' ? 'cloudy' : 'clear-day');
            return {
                date: dayNum,
                day: new Date(today.getFullYear(), today.getMonth(), dayNum).toLocaleDateString('en-US', { weekday: 'short' }),
                high: currentHigh + (dayNum % 3),
                low: currentHigh - 10 + (dayNum % 2),
                icon: icon,
                isToday
            };
        });

        const deg = currentData.wind.deg;
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const windDir = directions[Math.round(deg / 22.5) % 16];
        const moonData = getMoonPhase(new Date());
        const rawAqi = aqiData.list[0]?.main?.aqi || 1;
        const aqiInfo = getAirQualityStatus(rawAqi);
        const aqiValue = rawAqi * 50; 
        const mockUvIndex = 7;

        return {
            city: currentData.name,
            currentTemp: Math.round(currentData.main.temp),
            condition: currentData.weather[0].description.charAt(0).toUpperCase() + currentData.weather[0].description.slice(1),
            high: daily.length > 0 ? daily[0].high : Math.round(currentData.main.temp_max),
            low: daily.length > 0 ? daily[0].low : Math.round(currentData.main.temp_min),
            feelsLike: Math.round(currentData.main.feels_like),
            humidity: currentData.main.humidity,
            windSpeed: Math.round(currentData.wind.speed * 3.6),
            windDir,
            windDeg: deg,
            uvIndex: mockUvIndex, 
            uvLabel: mockUvIndex > 7 ? 'High' : (mockUvIndex > 2 ? 'Moderate' : 'Low'),
            pressure: currentData.main.pressure,
            visibility: currentData.visibility / 1000,
            dewPoint: Math.round(currentData.main.temp - ((100 - currentData.main.humidity) / 5)),
            cloudCover: currentData.clouds.all,
            moonPhase: moonData.phase,
            moonPhaseIcon: moonData.icon,
            sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase(),
            sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase(),
            coordinates: { lat: currentData.coord.lat, lon: currentData.coord.lon },
            airQuality: {
                index: aqiValue,
                status: aqiInfo.label,
                description: aqiInfo.desc
            },
            hourly,
            daily,
            lifestyle: [],
            climateStats,
            trends,
            calendar,
            monthlyOverview: { sunnyDays: 20, rainDays: 5, avgHigh: currentHigh, avgLow: currentHigh - 10 }
        };

    } catch (error) {
        console.error("Weather Service Error:", error);
        throw error;
    }
};
