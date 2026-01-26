import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { shouldTriggerAlert } from '../logic/alertDecisionEngine';
import { getEffectForSeverity, triggerAlarm, stopAlarm } from '../logic/DecisionEngine';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [isSOSActive, setIsSOSActive] = useState(false);
    const [activeAlerts, setActiveAlerts] = useState([]);
    const [logs, setLogs] = useState({ sos: [], services: [] });
    const [socket, setSocket] = useState(null);

    // Initialize Socket.io
    useEffect(() => {
        const newSocket = io('/');
        setSocket(newSocket);

        newSocket.on('new_alert', (alert) => {
            // Use the explicit Alert Decision Engine to determine if this user is affected
            if (userLocation && shouldTriggerAlert(userLocation, alert)) {
                setActiveAlerts(prev => [...prev, alert]);

                const effect = getEffectForSeverity(alert.severity);
                if (effect.alarm) triggerAlarm();
            }
        });

        return () => newSocket.close();
    }, [userLocation]);

    // Track User Location
    useEffect(() => {
        if ('geolocation' in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    setUserLocation(newLoc);

                    // If SOS is active, log location updates to server
                    if (isSOSActive) {
                        axios.post('/api/sos/start', { userId: 'demo-user', location: newLoc }).catch(console.error);
                    }
                },
                (err) => console.error("Error fetching location:", err),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, [isSOSActive]);

    const toggleSOS = async () => {
        const newState = !isSOSActive;
        setIsSOSActive(newState);
        if (newState) {
            await axios.post('/api/sos/start', { userId: 'demo-user', location: userLocation });
        } else {
            await axios.post('/api/sos/stop', { userId: 'demo-user' });
            stopAlarm();
        }
    };

    const requestService = async (service) => {
        const res = await axios.post('/api/service/request', { service, location: userLocation, userId: 'demo-user' });
        setLogs(prev => ({ ...prev, services: [...prev.services, res.data.entry] }));
    };

    const dismissAlert = (id) => {
        setActiveAlerts(prev => prev.filter(a => a.id !== id));
        if (activeAlerts.length <= 1) stopAlarm();
    };

    return (
        <AppContext.Provider value={{
            userLocation,
            isSOSActive,
            toggleSOS,
            activeAlerts,
            dismissAlert,
            requestService,
            logs
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
