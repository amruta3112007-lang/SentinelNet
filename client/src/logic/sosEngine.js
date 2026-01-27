/**
 * logic/sosEngine.js
 * 
 * TRANSACTIONAL SOS FLOW
 * 
 * This engine implements exactly-once semantics where possible,
 * at-least-once where necessary. Each step in the SOS flow is
 * persisted independently so failure at any step does not rollback
 * prior steps.
 * 
 * Flow:
 * SOS_TAP → Capture GPS → Persist locally → Dispatch SMS → Initiate call → Start live stream
 */

const SOS_STATE_KEY = 'sentinelnet_sos_state';
const LOCATION_HISTORY_KEY = 'sentinelnet_location_history';

/**
 * SOS Transaction States
 */
export const SOS_STATES = {
    IDLE: 'IDLE',
    GPS_CAPTURING: 'GPS_CAPTURING',
    GPS_CAPTURED: 'GPS_CAPTURED',
    SMS_DISPATCHING: 'SMS_DISPATCHING',
    SMS_DISPATCHED: 'SMS_DISPATCHED',
    CALL_INITIATING: 'CALL_INITIATING',
    STREAMING: 'STREAMING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
};

/**
 * Persists current SOS state to localStorage for crash recovery.
 */
export const persistSOSState = (state) => {
    try {
        localStorage.setItem(SOS_STATE_KEY, JSON.stringify({
            ...state,
            timestamp: Date.now()
        }));
        return true;
    } catch (e) {
        console.error('[SOSEngine] Failed to persist state:', e);
        return false;
    }
};

/**
 * Recovers SOS state after crash or app restart.
 * Returns null if no valid state exists.
 */
export const recoverSOSState = () => {
    try {
        const stored = localStorage.getItem(SOS_STATE_KEY);
        if (!stored) return null;

        const state = JSON.parse(stored);

        // State is valid for 30 minutes after last update
        const VALIDITY_WINDOW_MS = 30 * 60 * 1000;
        if (Date.now() - state.timestamp > VALIDITY_WINDOW_MS) {
            clearSOSState();
            return null;
        }

        return state;
    } catch (e) {
        console.error('[SOSEngine] Failed to recover state:', e);
        return null;
    }
};

/**
 * Clears persisted SOS state.
 */
export const clearSOSState = () => {
    localStorage.removeItem(SOS_STATE_KEY);
};

/**
 * Persists location to history for rescue optimization.
 * Maintains last 50 locations.
 */
export const persistLocation = (location) => {
    try {
        const history = JSON.parse(localStorage.getItem(LOCATION_HISTORY_KEY) || '[]');
        history.push({
            ...location,
            timestamp: Date.now()
        });

        // Keep only last 50 locations
        const trimmed = history.slice(-50);
        localStorage.setItem(LOCATION_HISTORY_KEY, JSON.stringify(trimmed));
        return true;
    } catch (e) {
        console.error('[SOSEngine] Failed to persist location:', e);
        return false;
    }
};

/**
 * Gets last known good location for crash recovery.
 */
export const getLastKnownLocation = () => {
    try {
        const history = JSON.parse(localStorage.getItem(LOCATION_HISTORY_KEY) || '[]');
        return history.length > 0 ? history[history.length - 1] : null;
    } catch (e) {
        return null;
    }
};

/**
 * Gets location history for movement prediction.
 */
export const getLocationHistory = () => {
    try {
        return JSON.parse(localStorage.getItem(LOCATION_HISTORY_KEY) || '[]');
    } catch (e) {
        return [];
    }
};

/**
 * Clears location history.
 */
export const clearLocationHistory = () => {
    localStorage.removeItem(LOCATION_HISTORY_KEY);
};

/**
 * Executes the transactional SOS flow.
 * Each step is independent and failure-tolerant.
 */
export const executeSOSFlow = async (callbacks = {}) => {
    const { onStateChange, onError, onComplete } = callbacks;

    let state = {
        phase: SOS_STATES.GPS_CAPTURING,
        location: null,
        smsDispatched: false,
        callInitiated: false,
        streamingActive: false
    };

    const updateState = (updates) => {
        state = { ...state, ...updates };
        persistSOSState(state);
        onStateChange?.(state);
    };

    // Step 1: Capture GPS snapshot
    try {
        updateState({ phase: SOS_STATES.GPS_CAPTURING });

        const position = await new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });

        const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
        };

        persistLocation(location);
        updateState({ phase: SOS_STATES.GPS_CAPTURED, location });

    } catch (gpsError) {
        // Fallback to last known location
        const lastKnown = getLastKnownLocation();
        if (lastKnown) {
            updateState({ phase: SOS_STATES.GPS_CAPTURED, location: lastKnown });
        } else {
            onError?.('GPS unavailable and no fallback location');
        }
    }

    // Step 2: Dispatch SMS payload (MOCK)
    try {
        updateState({ phase: SOS_STATES.SMS_DISPATCHING });

        // In production, this would call an SMS gateway API
        console.log('[SOSEngine] MOCK: Dispatching SMS with location:', state.location);

        // Simulate network delay
        await new Promise(r => setTimeout(r, 500));

        updateState({ phase: SOS_STATES.SMS_DISPATCHED, smsDispatched: true });

    } catch (smsError) {
        onError?.('SMS dispatch failed, continuing flow');
        // Continue flow even if SMS fails
    }

    // Step 3: Initiate optional call (MOCK)
    try {
        updateState({ phase: SOS_STATES.CALL_INITIATING });

        console.log('[SOSEngine] MOCK: Call would be initiated here');
        updateState({ callInitiated: true });

    } catch (callError) {
        // Call is optional, continue
    }

    // Step 4: Start live location stream
    updateState({ phase: SOS_STATES.STREAMING, streamingActive: true });

    onComplete?.(state);
    return state;
};

/**
 * Stops the SOS flow and clears state.
 */
export const stopSOSFlow = () => {
    clearSOSState();
    return { phase: SOS_STATES.IDLE };
};
