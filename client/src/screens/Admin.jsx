import React, { useState } from 'react';
import axios from 'axios';
import { Radio, AlertCircle, Map, Zap } from 'lucide-react';

const Admin = () => {
    const [alert, setAlert] = useState({
        type: 'Flood',
        severity: 'MEDIUM',
        zone: { name: 'Downtown Area', center: { lat: 12.9716, lng: 77.5946 }, radius: 50000 },
        instructions: 'Evacuate to higher ground immediately.'
    });

    const triggerAlert = async () => {
        try {
            await axios.post('/api/alert/trigger', alert);
            window.alert("Alert Broadcasted Successfully!");
        } catch (err) {
            console.error(err);
            window.alert("Failed to broadcast alert.");
        }
    };

    return (
        <div className="p-6 pb-24 space-y-8 max-w-md mx-auto min-h-screen">
            <header>
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded mb-2 inline-block">SECURE AUTHORITY PORTAL</span>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Command <span className="text-red-500">Center</span></h1>
                <p className="text-slate-400 text-xs font-bold tracking-widest uppercase italic mt-2 animate-pulse">
                    Simulated Disaster Management Authority Dashboard
                </p>
            </header>

            <div className="glass p-6 rounded-[2rem] space-y-6">
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Disaster Type</label>
                    <select
                        value={alert.type}
                        onChange={(e) => setAlert({ ...alert, type: e.target.value })}
                        className="w-full bg-slate-800 border-white/10 text-white rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none"
                    >
                        <option>Flood</option>
                        <option>Fire</option>
                        <option>Earthquake</option>
                        <option>Toxic Gas Leak</option>
                    </select>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Severity Level</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['LOW', 'MEDIUM', 'HIGH'].map(s => (
                            <button
                                key={s}
                                onClick={() => setAlert({ ...alert, severity: s })}
                                className={`p-2 rounded-xl text-[10px] font-black tracking-widest border transition-all ${alert.severity === s
                                    ? 'bg-red-600 border-red-500 text-white'
                                    : 'bg-white/5 border-white/10 text-slate-400'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Target Instruction</label>
                    <textarea
                        value={alert.instructions}
                        onChange={(e) => setAlert({ ...alert, instructions: e.target.value })}
                        className="w-full bg-slate-800 border-white/10 text-white rounded-xl p-3 h-24 focus:ring-2 focus:ring-red-500 outline-none text-sm"
                    />
                </div>

                <button
                    onClick={triggerAlert}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-red-900/40"
                >
                    <Radio size={20} />
                    BROADCAST ALERT
                </button>
            </div>

            <div className="glass p-6 rounded-3xl space-y-4">
                <h3 className="text-white font-bold italic uppercase flex items-center gap-2">
                    <Map size={18} className="text-red-500" />
                    Active Surveillance
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-bold uppercase text-slate-400">
                        <span>Active Nodes</span>
                        <span className="text-emerald-500">● 142 CONNECTED</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-1/3 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
