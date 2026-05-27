"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { Clock, Play, Pause, RotateCcw, CheckSquare, ChevronDown } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import toast from "react-hot-toast";

const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
};

export const FocusTimerWidget = ({ className }: { className?: string }) => {
    const { isRunning, timeElapsed, topic, targetMinutes, targetReached } = useDashboardStore((s) => s.studyTimer);
    const category = useDashboardStore((s) => s.studyTimer.category);
    const categories = useDashboardStore((s) => s.categories);

    const toggleTimer = useDashboardStore((s) => s.toggleTimer);
    const tickTimer = useDashboardStore((s) => s.tickTimer);
    const resetTimer = useDashboardStore((s) => s.resetTimer);
    const finishSession = useDashboardStore((s) => s.finishSession);
    const setTimerCategory = useDashboardStore((s) => s.setTimerCategory);
    const setTargetMinutes = useDashboardStore((s) => s.setTargetMinutes);
    const defaultTimerMinutes = useDashboardStore((s) => s.settings.defaultTimerMinutes);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const toastFiredRef = useRef(false);

    useEffect(() => {
        if (!isRunning && timeElapsed === 0 && defaultTimerMinutes !== targetMinutes) {
            setTargetMinutes(defaultTimerMinutes);
        }
    }, [defaultTimerMinutes, isRunning, timeElapsed, targetMinutes, setTargetMinutes]);

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                tickTimer();
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, tickTimer]);

    useEffect(() => {
        if (targetReached && !toastFiredRef.current) {
            toastFiredRef.current = true;
            toast("🎯 Target Reached! Keep going or finish up.", {
                duration: 4000,
                style: {
                    background: "var(--color-card)",
                    color: "#fff",
                    border: "2px solid var(--color-primary)",
                    borderRadius: "0",
                    boxShadow: "4px 4px 0px 0px var(--color-primary)"
                },
                icon: "⏱️",
            });
        }
        if (!targetReached) {
            toastFiredRef.current = false;
        }
    }, [targetReached]);

    const handleFinish = () => {
        finishSession();
        toast.success("Session saved! XP Awarded 🌟", {
            style: { 
                background: "var(--color-card)", 
                color: "#fff", 
                border: "2px solid var(--color-accent)",
                borderRadius: "0",
                boxShadow: "4px 4px 0px 0px var(--color-accent)"
            },
        });
    };

    return (
        <BrutalCard className={`p-8 flex flex-col justify-between overflow-visible relative z-20 ${className}`}>
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="relative">
                    <button
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent text-[10px] font-bold text-slate-100 uppercase font-Outfit transition-all border-2 border-white/20 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                    >
                        <span>{category || "Select Category"}</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>

                    <AnimatePresence>
                        {isCategoryOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute top-full left-0 mt-2 w-40 bg-card border-2 border-white/20 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] z-50 overflow-hidden"
                            >
                                <div className="max-h-32 overflow-y-auto custom-scrollbar p-2 space-y-1">
                                    {categories.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                setTimerCategory(c);
                                                setIsCategoryOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 border-2 transition-all text-xs font-Outfit font-bold uppercase ${
                                                category === c 
                                                ? "bg-primary text-black border-primary" 
                                                : "bg-transparent text-slate-300 border-transparent hover:border-white/20 hover:bg-white/5"
                                            }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className={`p-2 border-2 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] transition-colors ${isRunning ? 'bg-primary border-primary text-black' : 'bg-transparent border-white/20 text-slate-100'}`}>
                    <Clock className="w-5 h-5" />
                </div>
            </div>

            {/* Timer Display */}
            <div className="mt-4 flex flex-col items-center">
                <p className="text-xs uppercase tracking-widest text-slate-300 font-bold mb-2 font-Outfit">Focus Timer</p>
                <motion.span
                    key={timeElapsed}
                    className={`text-5xl font-bold font-Outfit tabular-nums tracking-tight transition-colors duration-300 ${targetReached ? "text-primary" : "text-white"}`}
                >
                    {formatTime(timeElapsed)}
                </motion.span>
                <p className="text-sm text-slate-400 mt-2 font-Inter font-medium">{topic}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-auto pt-6 relative">
                {/* Reset Button */}
                {!isRunning && timeElapsed > 0 && (
                    <button
                        onClick={resetTimer}
                        className="w-10 h-10 bg-transparent flex items-center justify-center hover:bg-white/10 text-slate-300 transition-all border-2 border-white/20 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                        title="Reset"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                )}

                {/* Play/Pause Button */}
                <button
                    onClick={toggleTimer}
                    className={`w-14 h-14 flex items-center justify-center transition-all border-2 ${
                        isRunning
                        ? "bg-accent border-accent text-black shadow-[4px_4px_0px_0px_var(--color-accent)] hover:shadow-[2px_2px_0px_0px_var(--color-accent)] hover:translate-y-0.5 hover:translate-x-0.5"
                        : "bg-primary border-primary text-black shadow-[4px_4px_0px_0px_var(--color-primary)] hover:shadow-[2px_2px_0px_0px_var(--color-primary)] hover:translate-y-0.5 hover:translate-x-0.5"
                    }`}
                >
                    {isRunning ? (
                        <Pause className="w-6 h-6 fill-current" />
                    ) : (
                        <Play className="w-6 h-6 fill-current ml-1" />
                    )}
                </button>

                {/* Finish Button */}
                {!isRunning && timeElapsed > 5 && (
                    <button
                        onClick={handleFinish}
                        className="w-10 h-10 bg-primary/10 flex items-center justify-center hover:bg-primary text-primary hover:text-black transition-all border-2 border-primary shadow-[2px_2px_0px_0px_var(--color-primary)]"
                        title="Finish Session & Save Log"
                    >
                        <CheckSquare className="w-5 h-5" />
                    </button>
                )}
            </div>
        </BrutalCard>
    );
};
