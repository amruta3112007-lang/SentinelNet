import React from 'react';
import { useAppContext } from '../hooks/AppContext';
import { useBattery } from '../hooks/useBattery';
import { MapPin, Battery, ShieldAlert, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { userLocation, isSOSActive, toggleSOS, activeAlerts } = useAppContext();
    const battery = useBattery();

    return (
        <div className="p-6 pb-24 space-y-8 max-w-md mx-auto min-h-screen">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white italic">SENTINEL<span className="text-red-500">NET</span></h1>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Emergency System Offline</p>
                </div>
                <div className={`p-2 rounded-xl glass ${battery.isLow ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                    <Battery size={24} />
                    <span className="text-xs font-bold block text-center mt-1">{battery.level}%</span>
                </div>
            </header>

            {/* Low Power Alert */}
            {battery.isLow && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/50 p-4 rounded-2xl flex items-center gap-4"
                >
                    <ShieldAlert className="text-red-500 shrink-0" />
                    <div>
                        <p className="font-bold text-red-500 text-sm italic">LOW POWER EMERGENCY MODE ACTIVE</p>
                        <p className="text-xs text-red-200/80">GPS polling reduced. Last location synced.</p>
                    </div>
                </motion.div>
            )}

            {/* Main SOS Trigger */}
            <div className="flex flex-col items-center justify-center py-10">
                <button
                    onClick={toggleSOS}
                    className={`relative w-64 h-64 rounded-full flex flex-center transition-all duration-500 ${isSOSActive ? 'bg-red-600 scale-110 shadow-[0_0_60px_rgba(239,68,68,0.6)]' : 'bg-red-500 hover:bg-red-600'
                        }`}
                >
                    <div className={`absolute inset-0 rounded-full border-4 border-white/20 ${isSOSActive ? 'animate-ping' : ''}`} />
                    <div className="text-center w-full">
                        <h2 className="text-6xl font-black text-white italic mb-1 uppercase tracking-tighter">
                            {isSOSActive ? 'STOP' : 'SOS'}
                        </h2>
                        <p className="text-white/80 text-xs font-bold tracking-[0.2em] uppercase">
                            {isSOSActive ? 'Tracking Live...' : 'Hold for 3 Sec'}
                        </p>
                    </div>
                </button>
            </div>

            {/* Location Status */}
            <div className="glass p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-500/20 rounded-2xl">
                        <MapPin className="text-red-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-200 uppercase tracking-widest text-[10px]">Current Location</h3>
                        <p className="text-white font-mono text-sm">
                            {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Scanning GPS...'}
                        </p>
                    </div>
                </div>

                {isSOSActive && (
                    <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-4" />
                        <p className="text-xs font-medium text-slate-400 italic">SOS Transmission broadcasting locally...</p>
                    </div>
                )}
            </div>

            {/* Active Alerts Count */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass p-5 rounded-3xl">
                    <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Active Alerts</h3>
                    <p className="text-2xl font-black text-white">{activeAlerts.length}</p>
                </div>
                <div className="glass p-5 rounded-3xl">
                    <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Network</h3>
                    <div className="flex items-center gap-2">
                        <WifiOff size={16} className="text-red-500" />
                        <p className="text-sm font-bold text-white uppercase italic">Offline First</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
