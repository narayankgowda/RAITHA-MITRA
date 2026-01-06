
import React, { useRef, useEffect, useState } from 'react';
import { MandiPrice } from '../data/liveMandiPriceData';
import { MapPinIcon, WifiOffIcon } from './icons';
import Spinner from './Spinner';

interface MandiLocatorProps {
    data: MandiPrice[];
}

const MandiLocator: React.FC<MandiLocatorProps> = ({ data }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    useEffect(() => {
        // Wait for Leaflet to load from CDN
        const checkLeaflet = setInterval(() => {
            if ((window as any).L) {
                clearInterval(checkLeaflet);
                setIsMapReady(true);
            }
        }, 100);
        return () => clearInterval(checkLeaflet);
    }, []);

    useEffect(() => {
        if (!isMapReady || !mapRef.current || mapInstanceRef.current) return;

        const L = (window as any).L;
        
        // Default center (Karnataka)
        const defaultCenter: [number, number] = [14.5, 75.8];
        const map = L.map(mapRef.current).setView(defaultCenter, 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        mapInstanceRef.current = map;

        // Try to get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 9);
                    L.marker([latitude, longitude], {
                        icon: L.divIcon({
                            className: 'custom-location-icon',
                            html: '<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(59,130,246,0.5);"></div>',
                            iconSize: [12, 12]
                        })
                    }).addTo(map).bindPopup("Your Location");
                },
                (error) => {
                    console.log("Geolocation denied or error, using default center.");
                }
            );
        }
    }, [isMapReady]);

    useEffect(() => {
        if (!mapInstanceRef.current || !data || data.length === 0) return;

        const L = (window as any).L;
        const map = mapInstanceRef.current;

        // Clear existing markers
        markersRef.current.forEach(marker => map.removeLayer(marker));
        markersRef.current = [];

        data.forEach(item => {
            if (item.latitude && item.longitude) {
                const marker = L.marker([item.latitude, item.longitude])
                    .addTo(map)
                    .bindPopup(`
                        <div style="text-align: center;">
                            <h3 style="font-weight: bold; margin: 0;">${item.market}</h3>
                            <p style="margin: 4px 0; color: #666;">${item.commodity}</p>
                            <p style="font-weight: bold; color: #16a34a; font-size: 14px;">₹${item.modal_price}</p>
                        </div>
                    `);
                markersRef.current.push(marker);
            }
        });

    }, [isMapReady, data]);

    if (!isMapReady) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] bg-gray-100 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <Spinner />
                <p className="mt-4 text-sm text-gray-500">Loading OpenStreetMap...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[600px] bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-border-light dark:border-border-dark overflow-hidden relative z-0">
            <div ref={mapRef} className="w-full h-full" style={{ zIndex: 0 }} />
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 px-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 z-[1000] text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center">
                <MapPinIcon className="w-4 h-4 mr-1 text-primary"/> Karnataka Markets
            </div>
        </div>
    );
};

export default MandiLocator;
