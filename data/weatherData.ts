export interface HourlyForecast {
  time: string; // e.g., "3 PM"
  temp: number; // in Celsius
  condition: string; // e.g., "Sunny"
  icon: string; // Icon identifier
}

export interface DailyForecast {
  day: string; // e.g., "Mon"
  high: number; // in Celsius
  low: number; // in Celsius
  condition: string; // e.g., "Partly Cloudy"
  icon: string; // Icon identifier
}

export interface WeatherData {
  city: string;
  currentTemp: number;
  condition: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number; // in km/h
  uvIndex: number;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export const mockWeatherData: WeatherData = {
  city: 'Hubli, Karnataka',
  currentTemp: 28,
  condition: 'Partly Cloudy',
  feelsLike: 30,
  humidity: 75,
  windSpeed: 12,
  uvIndex: 7,
  hourly: [
    { time: 'Now', temp: 28, condition: 'Partly Cloudy', icon: 'partly-cloudy-day' },
    { time: '4 PM', temp: 29, condition: 'Partly Cloudy', icon: 'partly-cloudy-day' },
    { time: '5 PM', temp: 28, condition: 'Cloudy', icon: 'cloudy' },
    { time: '6 PM', temp: 27, condition: 'Cloudy', icon: 'cloudy' },
    { time: '7 PM', temp: 26, condition: 'Cloudy', icon: 'cloudy' },
    { time: '8 PM', temp: 25, condition: 'Showers', icon: 'showers-day' },
  ],
  daily: [
    { day: 'Today', high: 30, low: 22, condition: 'Scattered Thunderstorms', icon: 'thunderstorms-rain' },
    { day: 'Tue', high: 31, low: 23, condition: 'Partly Cloudy', icon: 'partly-cloudy-day' },
    { day: 'Wed', high: 32, low: 23, condition: 'Sunny', icon: 'clear-day' },
    { day: 'Thu', high: 31, low: 24, condition: 'Showers', icon: 'showers-day' },
    { day: 'Fri', high: 30, low: 22, condition: 'Thunderstorms', icon: 'thunderstorms' },
    { day: 'Sat', high: 29, low: 22, condition: 'Rain', icon: 'rain' },
    { day: 'Sun', high: 30, low: 23, condition: 'Partly Cloudy', icon: 'partly-cloudy-day' },
  ],
};
