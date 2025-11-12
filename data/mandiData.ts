import { Coordinates } from '../utils/locationUtils';

export interface CropPrice {
    name: string;
    price: number; // Price per quintal (100 kg)
}

export interface Mandi {
    id: number;
    name: string;
    location: Coordinates;
    hours: string;
    crops: CropPrice[];
}

export const mandiData: Mandi[] = [
    {
        id: 1,
        name: 'Hubli APMC Market',
        location: { latitude: 15.3647, longitude: 75.1240 },
        hours: '6:00 AM - 8:00 PM',
        crops: [
            { name: 'Onion', price: 1800 },
            { name: 'Tomato', price: 1200 },
            { name: 'Wheat', price: 2100 },
            { name: 'Cotton', price: 7500 },
        ],
    },
    {
        id: 2,
        name: 'Belagavi Main Market',
        location: { latitude: 15.8497, longitude: 74.4977 },
        hours: '7:00 AM - 9:00 PM',
        crops: [
            { name: 'Sugarcane', price: 3200 },
            { name: 'Paddy', price: 1950 },
            { name: 'Jowar', price: 2400 },
            { name: 'Tomato', price: 1250 },
        ],
    },
    {
        id: 3,
        name: 'Davanagere APMC',
        location: { latitude: 14.4644, longitude: 75.9218 },
        hours: '5:30 AM - 7:30 PM',
        crops: [
            { name: 'Maize', price: 2050 },
            { name: 'Cotton', price: 7650 },
            { name: 'Onion', price: 1850 },
            { name: 'Groundnut', price: 6200 },
        ],
    },
    {
        id: 4,
        name: 'Mysuru APMC Yard',
        location: { latitude: 12.3118, longitude: 76.6222 },
        hours: '7:00 AM - 8:00 PM',
        crops: [
            { name: 'Paddy', price: 2000 },
            { name: 'Ragi', price: 3300 },
            { name: 'Tomato', price: 1100 },
            { name: 'Sugarcane', price: 3100 },
        ],
    },
    {
        id: 5,
        name: 'Shivamogga APMC',
        location: { latitude: 13.9299, longitude: 75.5681 },
        hours: '6:00 AM - 8:30 PM',
        crops: [
            { name: 'Arecanut', price: 55000 },
            { name: 'Paddy', price: 2050 },
            { name: 'Maize', price: 2000 },
            { name: 'Ginger', price: 8500 },
        ],
    },
    {
        id: 6,
        name: 'Raichur APMC',
        location: { latitude: 16.2076, longitude: 77.3731 },
        hours: '6:30 AM - 9:00 PM',
        crops: [
            { name: 'Cotton', price: 7800 },
            { name: 'Paddy', price: 1900 },
            { name: 'Chilli', price: 15000 },
            { name: 'Jowar', price: 2350 },
        ],
    },
];
