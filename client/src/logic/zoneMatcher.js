/**
 * logic/zoneMatcher.js
 * 
 * Responsibilities:
 * - Calculate distance between user location and zone center.
 * - Support radius-based zones.
 * 
 * Note: No external libraries required. This ensures zero-dependency logic.
 */

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
 * Checks if a user is within a radius-based affected zone.
 * @param {Object} userLocation - { lat, lng }
 * @param {Object} zone - { center: { lat, lng }, radius: meters }
 */
export const isInsideZone = (userLocation, zone) => {
    if (!userLocation || !zone || !zone.center) return false;

    const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        zone.center.lat,
        zone.center.lng
    );

    return distance <= zone.radius;
};
