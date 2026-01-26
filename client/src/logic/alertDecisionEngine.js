/**
 * logic/alertDecisionEngine.js
 * 
 * Responsibilities:
 * - Accept userLocation and alertPayload.
 * - Decide whether an alert should be triggered for the specific user.
 * 
 * This is pure, testable logic independent of the UI or DOM.
 */

import { isInsideZone } from './zoneMatcher';

/**
 * Decides if an alert should trigger for a user based on their location.
 * 
 * @param {Object} userLocation - The current GPS coordinates of the user { lat, lng }.
 * @param {Object} alertPayload - The disaster payload { type, severity, zone }.
 * @returns {Boolean} - True if the alert should be triggered for this user.
 */
export const shouldTriggerAlert = (userLocation, alertPayload) => {
    // 1. Basic validation
    if (!userLocation || !alertPayload || !alertPayload.zone) {
        console.warn("[DecisionEngine] Missing required data for alert decision.");
        return false;
    }

    // 2. Location matching: userLocation must be inside the affected_zone
    const isMatch = isInsideZone(userLocation, alertPayload.zone);

    // LOG: Why this decision was made
    console.log(`[DecisionEngine] Alert ${alertPayload.type} (${alertPayload.severity}) targeting zone ${alertPayload.zone.name}. User match: ${isMatch}`);

    return isMatch;
};
