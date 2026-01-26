import { useState, useEffect } from 'react';

/**
 * Custom hook to monitor battery level and state.
 * Triggers Low Power Mode UI when battery < 15%.
 */
export const useBattery = () => {
    const [battery, setBattery] = useState({
        level: 100,
        charging: false,
        isLow: false
    });

    useEffect(() => {
        let batteryInstance = null;

        const updateBattery = () => {
            setBattery({
                level: Math.round(batteryInstance.level * 100),
                charging: batteryInstance.charging,
                isLow: batteryInstance.level < 0.15
            });
        };

        if ('getBattery' in navigator) {
            navigator.getBattery().then(bat => {
                batteryInstance = bat;
                updateBattery();
                bat.addEventListener('levelchange', updateBattery);
                bat.addEventListener('chargingchange', updateBattery);
            });
        }

        return () => {
            if (batteryInstance) {
                batteryInstance.removeEventListener('levelchange', updateBattery);
                batteryInstance.removeEventListener('chargingchange', updateBattery);
            }
        };
    }, []);

    return battery;
};
