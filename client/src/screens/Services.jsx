import React, { useState } from 'react';
import { Phone, Shield, Plus, X } from 'lucide-react';
import { useAppContext } from '../hooks/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const Services = () => {
    const { requestService } = useAppContext();
    const [modal, setModal] = useState(null);

    const services = [
        { name: 'Police', icon: '🚓', color: 'bg-blue-600', number: '112', type: 'Police' },
        { name: 'Ambulance', icon: '🚑', color: 'bg-red-600', number: '108', type: 'Ambulance' },
        { name: 'Fire', icon: '🚒', color: 'bg-orange-600', number: '101', type: 'Fire' },
    ];

    const handleCall = (service) => {
        setModal(service);
        requestService(service.name);
        // Simulate real dialer delay
        setTimeout(() => {
            window.location.href = `tel:${service.number}`;
        }, 1500);
    };

    return (
        <div className="p-6 pb-24 space-y-8 max-w-md mx-auto min-h-screen">
            <header>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Emergency <span className="text-red-500">Services</span></h1>
                <p className="text-slate-400 text-xs font-bold tracking-widest uppercase italic">Mock / Demo Integration Only</p>
            </header>

            <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 mb-4">
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                    <span className="text-red-500 font-black">NOTE:</span> Services are user-initiated demo actions. No real dispatcher will be contacted during this simulation.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {services.map((service) => (
                    <button
                        key={service.name}
                        onClick={() => handleCall(service)}
                        className={`flex items-center p-6 rounded-[2rem] gap-6 transition-all active:scale-95 ${service.color}`}
                    >
                        <span className="text-5xl">{service.icon}</span>
                        <div className="text-left">
                            <h2 className="text-2xl font-black text-white italic uppercase">{service.name}</h2>
                            <p className="text-white/70 font-mono font-bold tracking-widest">{service.number}</p>
                        </div>
                        <Phone className="ml-auto text-white" />
                    </button>
                ))}
            </div>

            <div className="glass p-6 rounded-3xl border-dashed border-2 border-white/10 text-center">
                <Plus className="mx-auto text-slate-500 mb-2" />
                <h3 className="text-slate-200 font-bold uppercase text-xs">Add Emergency Contact</h3>
                <p className="text-[10px] text-slate-400 italic">Trusted individuals will be notified during SOS</p>
            </div>

            <AnimatePresence>
                {modal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <div className="text-center space-y-6">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={`${modal.color} w-32 h-32 rounded-full flex items-center justify-center mx-auto text-6xl shadow-[0_0_50px_rgba(255,255,255,0.2)]`}
                            >
                                {modal.icon}
                            </motion.div>
                            <div>
                                <h2 className="text-3xl font-black text-white italic uppercase">Calling {modal.name}</h2>
                                <p className="text-slate-400 font-bold mt-2">Connecting to dispatcher {modal.number}...</p>
                            </div>
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em] border border-red-500/50 p-2 rounded-lg">
                                Location Data: Synced to Server
                            </p>
                            <button
                                onClick={() => setModal(null)}
                                className="mt-10 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold uppercase text-sm border border-white/20"
                            >
                                Cancel Call
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Services;
