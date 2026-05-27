"use client";

import { Activity, TrendingUp } from "lucide-react";

export const AnalyticsWidget = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex flex-col h-full bg-slate-900/50 p-5 rounded-2xl border border-white/5 relative ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                        <Activity size={14} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-300">Study Heatmap</h3>
                </div>
                <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <TrendingUp size={12} /> +12%
                </div>
            </div>

            <div className="flex-1 grid grid-cols-7 gap-1.5 content-center opacity-80">
                {Array.from({ length: 28 }).map((_, i) => (
                    <div
                        key={i}
                        className={`aspect-square rounded-sm ${Math.random() > 0.6 ? "bg-emerald-500/80" :
                                Math.random() > 0.3 ? "bg-emerald-500/30" : "bg-slate-800"
                            }`}
                    />
                ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-slate-500 font-medium">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
            </div>
        </div>
    );
};
