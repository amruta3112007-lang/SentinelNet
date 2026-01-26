import React from 'react';
import { useAppContext } from '../hooks/AppContext';
import { AlertTriangle, MapPin, Clock, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Alerts = () => {
    const { activeAlerts, dismissAlert } = useAppContext();

    const getSeverityStyle = (severity) => {
        switch (severity) {
            case 'HIGH': return 'bg-red-500/20 border-red-500 text-red-500';
            case 'MEDIUM': return 'bg-orange-500/20 border-orange-500 text-orange-500';
            case 'LOW': return 'bg-emerald-500/20 border-emerald-500 text-emerald-500';
            default: return 'bg-slate-500/20 border-slate-500 text-slate-500';
        }
    };

    return (
        <div className="p-6 pb-24 space-y-6 max-w-md mx-auto min-h-screen">
            <header>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Emergency <span className="text-red-500">Alerts</span></h1>
                <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">Live Disaster Intelligence</p>
            </header>

            <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                    {activeAlerts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 glass rounded-3xl"
                        >
                            <div className="bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="text-emerald-500" />
                            </div>
                            <h2 className="text-white font-bold italic">ZONE SAFE</h2>
                            <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">No active incidents detected</p>
                        </motion.div>
                    ) : (
                        activeAlerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`glass p-5 rounded-3xl border-l-8 ${getSeverityStyle(alert.severity)}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">Severity: {alert.severity}</span>
                                        <h3 className="text-xl font-black text-white italic uppercase">{alert.type}</h3>
                                    </div>
                                    <button onClick={() => dismissAlert(alert.id)} className="text-slate-400 hover:text-white">
                                        <XCircle size={20} />
                                    </button>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-xs text-slate-300">
                                        <MapPin size={14} className="text-red-500" />
                                        <span>Affected Zone: {alert.zone.name || 'Current Location Radius'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-300">
                                        <Clock size={14} />
                                        <span>Triggered: {new Date(alert.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </div>

                                <div className="bg-black/20 p-4 rounded-2xl">
                                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-2">Immediate Instructions</h4>
                                    <p className="text-sm text-slate-100 leading-relaxed font-medium italic">{alert.instructions}</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Alerts;
