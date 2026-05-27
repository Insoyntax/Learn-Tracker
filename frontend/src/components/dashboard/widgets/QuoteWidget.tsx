"use client";

import { Quote } from "lucide-react";

export const QuoteWidget = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex flex-col h-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10 p-5 rounded-2xl border border-white/5 relative overflow-hidden ${className}`}>
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <Quote size={80} className="text-white transform rotate-12" />
            </div>

            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-300">
                    <Quote size={14} />
                </div>
                <h3 className="text-sm font-semibold text-slate-300">Daily Motivation</h3>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <blockquote className="text-lg font-medium text-white leading-relaxed italic">
                    "The beautiful thing about learning is that no one can take it away from you."
                </blockquote>
                <p className="mt-3 text-xs text-slate-400 font-medium">— B.B. King</p>
            </div>
        </div>
    );
};
