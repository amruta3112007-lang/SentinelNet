/**
 * logic/gpsController.js
 * 
 * ADAPTIVE GPS POLLING
 * 
 * GPS polling uses adaptive intervals based on:
 * - SOS active state (aggressive polling)
 * - Battery level (conservative when low)
 * - Movement detection (reduce when stationary)
 * 
 * Location deltas are stored locally for crash recovery.
 */

import { persistLocation, getLastKnownLocation } from './sosEngine';

const GPS_INTERVALS = {
    AGGRESSIVE: 3000,    // 3s - during SOS
    NORMAL: 15000,       // 15s - default
    CONSERVATIVE: 60000, // 60s - low battery
    STATIONARY: 120000   // 2min - no movement detected
};

let watchId = null;
let currentInterval = GPS_INTERVALS.NORMAL;
let lastPosition = null;

/**
 * Calculates if user is stationary based on recent positions.
 */
const isStationary = (newPos, oldPos, threshold = 5) => {
    if (!oldPos) return false;

    const R = 6371e3;
    const φ1 = (oldPos.lat * Math.PI) / 180;
    const φ2 = (newPos.lat * Math.PI) / 180;
    const Δφ = ((newPos.lat - oldPos.lat) * Math.PI) / 180;
    const Δλ = ((newPos.lng - oldPos.lng) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return distance < threshold; // Less than threshold meters = stationary
};

/**
 * Determines optimal polling interval based on context.
 */
export const getOptimalInterval = (context = {}) => {
    const { isSOSActive, batteryLevel, isLowPowerMode } = context;

    if (isSOSActive) {
        return GPS_INTERVALS.AGGRESSIVE;
    }

    if (isLowPowerMode || batteryLevel < 15) {
        return GPS_INTERVALS.CONSERVATIVE;
    }

    if (lastPosition && isStationary(lastPosition, getLastKnownLocation())) {
        return GPS_INTERVALS.STATIONARY;
    }

    return GPS_INTERVALS.NORMAL;
};

/**
 * Starts adaptive GPS tracking.
 */
export const startTracking = (onLocation, onError, context = {}) => {
    if (!navigator.geolocation) {
        onError?.('Geolocation not supported');
        return null;
    }

    // Try to recover from last known position first
    const recovered = getLastKnownLocation();
    if (recovered) {
        console.log('[GPSController] Recovered last known position:', recovered);
        onLocation?.(recovered);
    }

    const options = {
        enableHighAccuracy: !context.isLowPowerMode,
        timeout: 10000,
        maximumAge: context.isSOSActive ? 0 : 30000
    };

    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: Date.now()
            };

            // Persist for crash recovery
            persistLocation(location);
            lastPosition = location;

            onLocation?.(location);
        },
        (error) => {
            console.error('[GPSController] Error:', error.message);

            // Fallback to last known
            const fallback = getLastKnownLocation();
            if (fallback) {
                onLocation?.(fallback);
            } else {
                onError?.(error.message);
            }
        },
        options
    );

    console.log('[GPSController] Tracking started with interval context:', context);
    return watchId;
};

/**
 * Stops GPS tracking.
 */
export const stopTracking = () => {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        console.log('[GPSController] Tracking stopped');
    }
};

/**
 * Gets current tracking status.
 */
export const getTrackingStatus = () => ({
    isTracking: watchId !== null,
    currentInterval,
    lastPosition
});
