
export interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  icon: string;
  pop?: number;
}

export interface DailyForecast {
  day: string;
  date?: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  pop?: number;
  summary?: string;
}

export interface LifestyleTip {
    title: string;
    status: string;
    icon: string;
}

export interface ClimateStat {
    label: string;
    month: string;
    value: string;
    icon: string;
}

export interface TrendData {
    day: string;
    high: number;
    low: number;
}

export interface CalendarDay {
    date: number;
    day: string;
    high: number;
    low: number;
    icon: string;
    isToday?: boolean;
}

export interface WeatherData {
  city: string;
  currentTemp: number;
  condition: string;
  high: number;
  low: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number; // in km/h
  windDir: string;
  windDeg: number; // Degrees
  uvIndex: number;
  uvLabel: string;
  pressure: number; // hPa
  visibility: number; // km
  dewPoint: number; // Celsius
  cloudCover: number; // Percentage
  moonPhase: string;
  moonPhaseIcon: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';
  sunrise: string; // Time string
  sunset: string; // Time string
  coordinates: { lat: number; lon: number };
  airQuality: {
      index: number; // AQI value
      status: string; // "Satisfactory"
      description: string;
  };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  lifestyle: LifestyleTip[];
  // New Fields for Enhanced UI
  climateStats: ClimateStat[];
  trends: TrendData[];
  calendar: CalendarDay[];
  monthlyOverview: {
      sunnyDays: number;
      rainDays: number;
      avgHigh: number;
      avgLow: number;
  };
}

export const mockWeatherData: WeatherData = {
  city: 'Hassan',
  currentTemp: 28,
  condition: 'Partly cloudy',
  high: 31,
  low: 19,
  feelsLike: 30,
  humidity: 45,
  windSpeed: 12,
  windDir: 'NE',
  windDeg: 45,
  uvIndex: 6,
  uvLabel: 'High',
  pressure: 1012,
  visibility: 10,
  dewPoint: 16,
  cloudCover: 20,
  moonPhase: 'Waxing Gibbous',
  moonPhaseIcon: 'waxing-gibbous',
  sunrise: '6:30 AM',
  sunset: '6:45 PM',
  coordinates: { lat: 13.0072, lon: 76.1032 },
  airQuality: {
      index: 45,
      status: 'Good',
      description: 'Air quality is satisfactory.'
  },
  hourly: [
      { time: 'Now', temp: 28, condition: 'Partly Cloudy', icon: 'partly-cloudy-day', pop: 0 },
      { time: '1 PM', temp: 30, condition: 'Sunny', icon: 'clear-day', pop: 0 },
      { time: '2 PM', temp: 31, condition: 'Sunny', icon: 'clear-day', pop: 0 },
      { time: '3 PM', temp: 30, condition: 'Partly Cloudy', icon: 'partly-cloudy-day', pop: 10 },
      { time: '4 PM', temp: 29, condition: 'Cloudy', icon: 'cloudy', pop: 20 },
      { time: '5 PM', temp: 28, condition: 'Cloudy', icon: 'cloudy', pop: 20 },
      { time: '6 PM', temp: 26, condition: 'Partly Cloudy', icon: 'partly-cloudy-day', pop: 10 },
      { time: '7 PM', temp: 24, condition: 'Clear', icon: 'clear-night', pop: 0 }
  ],
  daily: [
      { day: 'Today', date: 'Oct 25', high: 31, low: 19, condition: 'Sunny', icon: 'clear-day', pop: 0 },
      { day: 'Wed', date: 'Oct 26', high: 30, low: 20, condition: 'Partly Cloudy', icon: 'partly-cloudy-day', pop: 10 },
      { day: 'Thu', date: 'Oct 27', high: 29, low: 19, condition: 'Cloudy', icon: 'cloudy', pop: 20 },
      { day: 'Fri', date: 'Oct 28', high: 28, low: 18, condition: 'Rain', icon: 'rain', pop: 60 },
      { day: 'Sat', date: 'Oct 29', high: 27, low: 18, condition: 'Rain', icon: 'rain', pop: 70 },
      { day: 'Sun', date: 'Oct 30', high: 29, low: 19, condition: 'Cloudy', icon: 'cloudy', pop: 30 },
      { day: 'Mon', date: 'Oct 31', high: 30, low: 19, condition: 'Sunny', icon: 'clear-day', pop: 0 }
  ],
  lifestyle: [],
  climateStats: [
      { label: 'Record High', month: 'April', value: '38°', icon: 'hot' },
      { label: 'Record Low', month: 'December', value: '12°', icon: 'cold' },
      { label: 'Avg Rainfall', month: 'July', value: '250mm', icon: 'wet' },
      { label: 'Max Wind', month: 'June', value: '35km/h', icon: 'wind' },
  ],
  trends: Array.from({ length: 15 }, (_, i) => ({
      day: `Day ${i+1}`,
      high: 28 + Math.sin(i / 3) * 4,
      low: 18 + Math.sin(i / 3) * 2
  })),
  calendar: Array.from({ length: 30 }, (_, i) => ({
      date: i + 1,
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i % 7],
      high: 28 + (i%3),
      low: 18 + (i%2),
      icon: i % 5 === 0 ? 'rain' : (i % 3 === 0 ? 'cloudy' : 'clear-day'),
      isToday: i === 0
  })),
  monthlyOverview: { sunnyDays: 18, rainDays: 5, avgHigh: 29, avgLow: 19 }
};
