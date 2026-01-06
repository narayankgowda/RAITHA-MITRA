
import { useState, useEffect } from 'react';

const CALLBACK_NAME = 'googleMapsCallback';
// Using the provided API key directly
const GOOGLE_MAPS_API_KEY = "AIzaSyD2QCaIz-zUhDi-Jao_kFv32A-kgCXvqc4";

let loadPromise: Promise<void> | null = null;
let globalAuthError: string | null = null;
const authErrorListeners = new Set<(error: string) => void>();

// Global handler for Google Maps authentication failures (invalid key, billing issues)
const handleAuthFailure = () => {
    const errorMessage = "Google Maps Authentication Error: Billing not enabled or invalid API Key.";
    console.error(errorMessage);
    globalAuthError = errorMessage;
    authErrorListeners.forEach(listener => listener(errorMessage));
};

const loadGoogleMaps = (): Promise<void> => {
    if (loadPromise) return loadPromise;

    loadPromise = new Promise((resolve, reject) => {
        if (!GOOGLE_MAPS_API_KEY) {
            reject(new Error("Google Maps API Key is missing."));
            return;
        }

        if ((window as any).google && (window as any).google.maps) {
            resolve();
            return;
        }

        // Register the global auth failure handler
        (window as any).gm_authFailure = handleAuthFailure;

        (window as any)[CALLBACK_NAME] = () => {
            resolve();
        };

        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=marker,places&callback=${CALLBACK_NAME}&loading=async`;
        script.async = true;
        script.defer = true;
        
        script.onerror = () => {
            reject(new Error("Network Error: Failed to load Google Maps script."));
        };

        document.head.appendChild(script);
    });

    return loadPromise;
};

export const useGoogleMaps = () => {
    const [loaded, setLoaded] = useState(!!(window as any).google?.maps);
    const [error, setError] = useState<string | null>(globalAuthError);

    useEffect(() => {
        // Subscribe to global auth errors
        const handleError = (err: string) => setError(err);
        authErrorListeners.add(handleError);

        // If an error already occurred before this component mounted
        if (globalAuthError) {
            setError(globalAuthError);
        }

        if (!loaded && !globalAuthError) {
            let isMounted = true;
            loadGoogleMaps()
                .then(() => {
                    if (isMounted) setLoaded(true);
                })
                .catch((err) => {
                    if (isMounted) setError(err.message);
                });
                
            return () => { 
                isMounted = false;
                authErrorListeners.delete(handleError);
            };
        }

        return () => {
            authErrorListeners.delete(handleError);
        };
    }, [loaded]);

    return { loaded, error };
};
