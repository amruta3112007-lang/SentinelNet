/**
 * Alert Decision Engine
 * Determines UI behavior based on alert severity.
 */

export const SEVERITIES = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
};

export const getEffectForSeverity = (severity) => {
    switch (severity.toUpperCase()) {
        case SEVERITIES.HIGH:
            return {
                color: 'severity-high',
                vibrate: true,
                alarm: true,
                priority: 1,
                persistent: true
            };
        case SEVERITIES.MEDIUM:
            return {
                color: 'severity-medium',
                vibrate: true,
                alarm: false,
                priority: 2,
                persistent: false
            };
        case SEVERITIES.LOW:
        default:
            return {
                color: 'severity-low',
                vibrate: false,
                alarm: false,
                priority: 3,
                persistent: false
            };
    }
};

/**
 * Plays an alarm sound for high-severity alerts.
 * Mock implementation for browser environment.
 */
export const triggerAlarm = () => {
    // In a real PWA, this would play a specific sound file
    console.log("[ALARM] Triggering continuous alarm sound...");
    if ('vibrate' in navigator) {
        navigator.vibrate([500, 200, 500, 200, 500]);
    }
};

/**
 * Stops all alarms.
 */
export const stopAlarm = () => {
    console.log("[ALARM] Stopping all alarms.");
    if ('vibrate' in navigator) {
        navigator.vibrate(0);
    }
};
