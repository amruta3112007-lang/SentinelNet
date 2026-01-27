/**
 * logic/zoneMatcher.js
 * 
 * ZONE MATCHING WITH TIME-BOUNDED VALIDITY
 * 
 * Users are mapped to zones using:
 * - Point-in-polygon checks (simplified to radius for MVP)
 * - Cached last-known position
 * - Time-bounded validity window
 * 
 * Failure modes:
 * - User position is stale → conservative inclusion
 * - GPS unavailable → fallback to last zone
 * - Zone resolution fails → no alert (silence preferred over false panic)
 */

const LOCATION_STALENESS_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
const CONSERVATIVE_RADIUS_MULTIPLIER = 1.5; // Expand zone for stale locations

/**
 * Calculates distance between two coordinates in meters.
 * Uses the Haversine formula for spherical distance.
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

/**
 * Checks if a location is stale based on timestamp.
 */
export const isLocationStale = (location) => {
    if (!location?.timestamp) return true;
    return Date.now() - location.timestamp > LOCATION_STALENESS_THRESHOLD_MS;
};

/**
 * Checks if a user is within a radius-based affected zone.
 * Implements time-bounded validity and conservative inclusion for stale data.
 * 
 * @param {Object} userLocation - { lat, lng, timestamp? }
 * @param {Object} zone - { center: { lat, lng }, radius: meters }
 * @returns {Object} - { isInside, confidence, reason }
 */
export const isInsideZone = (userLocation, zone) => {
    // Validation
    if (!userLocation || !zone || !zone.center) {
        return {
            isInside: false,
            confidence: 0,
            reason: 'INVALID_INPUT'
        };
    }

    const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        zone.center.lat,
        zone.center.lng
    );

    let effectiveRadius = zone.radius;
    let confidence = 1.0;
    let reason = 'FRESH_LOCATION';

    // Handle stale location with conservative inclusion
    if (isLocationStale(userLocation)) {
        effectiveRadius = zone.radius * CONSERVATIVE_RADIUS_MULTIPLIER;
        confidence = 0.7;
        reason = 'STALE_LOCATION_CONSERVATIVE';
    }

    const isInside = distance <= effectiveRadius;

    return {
        isInside,
        confidence,
        reason,
        distance,
        effectiveRadius
    };
};

/**
 * Validates a zone definition.
 */
export const isValidZone = (zone) => {
    return (
        zone &&
        zone.center &&
        typeof zone.center.lat === 'number' &&
        typeof zone.center.lng === 'number' &&
        typeof zone.radius === 'number' &&
        zone.radius > 0
    );
};

/**
 * Predefined disaster zones for demo purposes.
 */
export const PREDEFINED_ZONES = [
    {
        id: 'zone-downtown',
        name: 'Downtown Area',
        center: { lat: 12.9716, lng: 77.5946 },
        radius: 5000
    },
    {
        id: 'zone-airport',
        name: 'Airport Region',
        center: { lat: 13.1989, lng: 77.7068 },
        radius: 8000
    },
    {
        id: 'zone-industrial',
        name: 'Industrial Zone',
        center: { lat: 12.9141, lng: 77.6380 },
        radius: 3000
    }
];
