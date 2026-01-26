/**
 * Location Intelligence Module
 * Handles proximity checks for disaster zones.
 */

/**
 * Calculates distance between two coordinates in meters.
 * Uses Haversine formula.
 */
export const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

/**
 * Checks if a user is within an affected zone.
 * @param {Object} userLoc - { lat, lng }
 * @param {Object} zone - { center: { lat, lng }, radius: meters }
 */
export const isUserInZone = (userLoc, zone) => {
    if (!userLoc || !zone || !zone.center) return false;
    const distance = getDistance(
        userLoc.lat,
        userLoc.lng,
        zone.center.lat,
        zone.center.lng
    );
    return distance <= zone.radius;
};

/**
 * Mock disaster zones for demo purposes.
 */
export const MOCK_ZONES = [
    {
        id: 'zone-1',
        name: 'Downtown Area',
        center: { lat: 12.9716, lng: 77.5946 }, // Bangalore example
        radius: 5000 // 5km
    }
];
