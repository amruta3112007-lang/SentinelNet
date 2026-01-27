/**
 * logic/alertDecisionEngine.js
 * 
 * DETERMINISTIC ALERT DECISION ENGINE
 * 
 * This engine is explicitly deterministic with no ML/probabilistic elements.
 * 
 * Why?
 * - Explainability
 * - Predictability  
 * - Auditable behavior
 * - Zero hallucination risk
 * 
 * This is a rule-driven, state-aware engine, not a probabilistic one.
 */

import { isInsideZone } from './zoneMatcher';
import { getControlSignals, executeSeverityResponse } from './severityController';

/**
 * Alert validation status codes
 */
export const DECISION_CODES = {
    TRIGGER: 'TRIGGER',
    SKIP_OUTSIDE_ZONE: 'SKIP_OUTSIDE_ZONE',
    SKIP_STALE_LOCATION: 'SKIP_STALE_LOCATION',
    SKIP_INVALID_PAYLOAD: 'SKIP_INVALID_PAYLOAD',
    SKIP_NO_LOCATION: 'SKIP_NO_LOCATION'
};

/**
 * Validates an alert payload structure.
 */
const isValidAlertPayload = (payload) => {
    return (
        payload &&
        typeof payload.type === 'string' &&
        typeof payload.severity === 'string' &&
        payload.zone &&
        payload.zone.center
    );
};

/**
 * Decides if an alert should trigger for a user based on their location.
 * Returns a decision object with full audit trail.
 * 
 * @param {Object} userLocation - The current GPS coordinates { lat, lng, timestamp? }
 * @param {Object} alertPayload - The disaster payload { type, severity, zone, instructions, authorityId? }
 * @returns {Object} - Decision object with trigger status and audit information
 */
export const shouldTriggerAlert = (userLocation, alertPayload) => {
    const decision = {
        shouldTrigger: false,
        code: null,
        reason: null,
        timestamp: Date.now(),
        inputs: {
            userLocation: userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null,
            alertType: alertPayload?.type,
            alertSeverity: alertPayload?.severity,
            zoneName: alertPayload?.zone?.name
        },
        zoneMatch: null,
        severitySignals: null
    };

    // 1. Validate user location exists
    if (!userLocation) {
        decision.code = DECISION_CODES.SKIP_NO_LOCATION;
        decision.reason = 'User location not available';
        console.log(`[DecisionEngine] ${decision.code}: ${decision.reason}`);
        return decision;
    }

    // 2. Validate alert payload structure
    if (!isValidAlertPayload(alertPayload)) {
        decision.code = DECISION_CODES.SKIP_INVALID_PAYLOAD;
        decision.reason = 'Alert payload missing required fields';
        console.log(`[DecisionEngine] ${decision.code}: ${decision.reason}`);
        return decision;
    }

    // 3. Perform zone matching with time-bounded validity
    const zoneMatch = isInsideZone(userLocation, alertPayload.zone);
    decision.zoneMatch = zoneMatch;

    if (!zoneMatch.isInside) {
        decision.code = DECISION_CODES.SKIP_OUTSIDE_ZONE;
        decision.reason = `User ${zoneMatch.distance?.toFixed(0)}m from zone center (radius: ${zoneMatch.effectiveRadius}m)`;
        console.log(`[DecisionEngine] ${decision.code}: ${decision.reason}`);
        return decision;
    }

    // 4. Alert should trigger - get severity control signals
    decision.shouldTrigger = true;
    decision.code = DECISION_CODES.TRIGGER;
    decision.reason = `User inside ${alertPayload.zone.name || 'affected zone'} (confidence: ${(zoneMatch.confidence * 100).toFixed(0)}%)`;
    decision.severitySignals = getControlSignals(alertPayload.severity);

    console.log(`[DecisionEngine] ${decision.code}: ${alertPayload.type} (${alertPayload.severity}) - ${decision.reason}`);

    return decision;
};

/**
 * Processes an alert and executes appropriate responses.
 * This is the main entry point for alert handling.
 */
export const processAlert = (userLocation, alertPayload) => {
    const decision = shouldTriggerAlert(userLocation, alertPayload);

    if (decision.shouldTrigger) {
        // Execute severity-driven responses (vibration, sound, etc.)
        executeSeverityResponse(alertPayload.severity);
    }

    return decision;
};
