/**
 * logic/severityController.js
 * 
 * SEVERITY AS A CONTROL SIGNAL
 * 
 * Severity is not cosmetic - it directly controls:
 * - Notification channel behavior
 * - OS-level overrides  
 * - UI blocking behavior
 * - Repetition frequency
 * 
 * This is a control signal, not metadata.
 */

export const SEVERITY_LEVELS = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
};

/**
 * Severity control signals mapped to system behavior.
 */
export const SEVERITY_CONTROL_MAP = {
    LOW: {
        level: 1,
        // Notification behavior
        overrideSilent: false,
        persistentNotification: false,
        lockScreenDisplay: false,

        // Audio/Haptic behavior
        soundEnabled: false,
        vibrationPattern: null,
        alarmMode: false,

        // UI behavior
        blockingOverlay: false,
        repetitionIntervalMs: null,

        // Color signals
        color: '#22c55e',
        bgClass: 'bg-severity-low',
        borderClass: 'border-emerald-500'
    },

    MEDIUM: {
        level: 2,
        // Notification behavior
        overrideSilent: true,
        persistentNotification: true,
        lockScreenDisplay: true,

        // Audio/Haptic behavior
        soundEnabled: true,
        vibrationPattern: [200, 100, 200], // Short pulses
        alarmMode: false,

        // UI behavior
        blockingOverlay: false,
        repetitionIntervalMs: 30000, // Repeat every 30s

        // Color signals
        color: '#f97316',
        bgClass: 'bg-severity-medium',
        borderClass: 'border-orange-500'
    },

    HIGH: {
        level: 3,
        // Notification behavior
        overrideSilent: true,
        persistentNotification: true,
        lockScreenDisplay: true,

        // Audio/Haptic behavior
        soundEnabled: true,
        vibrationPattern: [500, 200, 500, 200, 500], // Long urgent pulses
        alarmMode: true,

        // UI behavior
        blockingOverlay: true,
        repetitionIntervalMs: 10000, // Repeat every 10s

        // Color signals
        color: '#ef4444',
        bgClass: 'bg-severity-high',
        borderClass: 'border-red-500'
    }
};

/**
 * Gets control signals for a given severity level.
 */
export const getControlSignals = (severity) => {
    const normalized = severity?.toUpperCase() || 'LOW';
    return SEVERITY_CONTROL_MAP[normalized] || SEVERITY_CONTROL_MAP.LOW;
};

/**
 * Executes OS-level behavior based on severity.
 * This is the central dispatch for severity-driven actions.
 */
export const executeSeverityResponse = (severity) => {
    const signals = getControlSignals(severity);

    // Vibration control
    if (signals.vibrationPattern && 'vibrate' in navigator) {
        navigator.vibrate(signals.vibrationPattern);
    }

    // Audio control (alarm mode)
    if (signals.alarmMode) {
        console.log('[SeverityController] ALARM MODE ACTIVE - Continuous alarm would play');
        // In production: play alarm.mp3 on loop
    } else if (signals.soundEnabled) {
        console.log('[SeverityController] Alert sound triggered');
        // In production: play alert.mp3 once
    }

    return signals;
};

/**
 * Stops all severity-driven behaviors.
 */
export const stopSeverityResponse = () => {
    if ('vibrate' in navigator) {
        navigator.vibrate(0);
    }
    console.log('[SeverityController] All severity responses stopped');
};

/**
 * Compares two severity levels.
 * Returns: -1 if a < b, 0 if equal, 1 if a > b
 */
export const compareSeverity = (a, b) => {
    const levelA = SEVERITY_CONTROL_MAP[a?.toUpperCase()]?.level || 0;
    const levelB = SEVERITY_CONTROL_MAP[b?.toUpperCase()]?.level || 0;
    return levelA - levelB;
};
