import React from 'react';
import { Flame, Droplets, Wind, Info } from 'lucide-react';

const Instructions = () => {
    const guides = [
        {
            type: 'Fire Safety',
            icon: <Flame className="text-red-500" />,
            color: 'border-red-500/50',
            steps: [
                "Stay low to the ground to avoid smoke.",
                "Check doors for heat before opening.",
                "If your clothes catch fire: Stop, Drop, and Roll.",
                "Use stairs, never the elevator.",
                "Meet at a pre-arranged safe location."
            ]
        },
        {
            type: 'Flood Safety',
            icon: <Droplets className="text-blue-500" />,
            color: 'border-blue-500/50',
            steps: [
                "Move to higher ground immediately.",
                "Avoid walking or driving through flood waters.",
                "Disconnect electrical appliances if safe.",
                "Listen to local radio for emergency updates.",
                "Stay away from power lines and electrical wires."
            ]
        },
        {
            type: 'Earthquake',
            icon: <Wind className="text-emerald-500" />,
            color: 'border-emerald-500/50',
            steps: [
                "Drop, Cover, and Hold On.",
                "Stay away from glass, windows, and heavy furniture.",
                "If outdoors, move to an open area away from buildings.",
                "Do not use elevators.",
                "Be prepared for aftershocks."
            ]
        }
    ];

    return (
        <div className="p-6 pb-24 space-y-8 max-w-md mx-auto min-h-screen">
            <header>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Safety <span className="text-emerald-500">Guides</span></h1>
                <p className="text-slate-400 text-xs font-bold tracking-widest uppercase italic">Offline Encrypted Wisdom</p>
            </header>

            <div className="space-y-6">
                {guides.map((guide) => (
                    <div key={guide.type} className={`glass p-6 rounded-[2rem] border-l-4 ${guide.color}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-white/5 rounded-2xl">
                                {guide.icon}
                            </div>
                            <h2 className="text-xl font-black text-white italic uppercase">{guide.type}</h2>
                        </div>
                        <ul className="space-y-3">
                            {guide.steps.map((step, idx) => (
                                <li key={idx} className="flex gap-3 text-sm text-slate-300 font-medium leading-relaxed">
                                    <span className="text-red-500 font-black">0{idx + 1}</span>
                                    {step}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="bg-emerald-500/10 p-5 rounded-3xl flex items-start gap-4 border border-emerald-500/30">
                <Info className="text-emerald-500 shrink-0" size={20} />
                <p className="text-[11px] text-emerald-200/80 font-medium italic">
                    These instructions are cached locally and will remain accessible even during total network blackout.
                </p>
            </div>
        </div>
    );
};

export default Instructions;
