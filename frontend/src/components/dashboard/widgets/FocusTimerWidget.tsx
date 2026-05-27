"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Clock, Play, Pause, RotateCcw, CheckCircle2, ChevronDown } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import toast from "react-hot-toast";

const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
};

export const FocusTimerWidget = ({ className }: { className?: string }) => {
    const { isRunning, timeElapsed, topic, targetMinutes, targetReached } = useDashboardStore((s) => s.studyTimer);
    const category = useDashboardStore((s) => s.studyTimer.category); // Fix: Access category safely
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

    // Sync default timer from settings when timer is idle
    useEffect(() => {
        if (!isRunning && timeElapsed === 0 && defaultTimerMinutes !== targetMinutes) {
            setTargetMinutes(defaultTimerMinutes);
        }
    }, [defaultTimerMinutes, isRunning, timeElapsed, targetMinutes, setTargetMinutes]);

    // Category Dropdown State
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

    // Fire toast when target is reached
    useEffect(() => {
        if (targetReached && !toastFiredRef.current) {
            toastFiredRef.current = true;
            toast("🎯 Target Reached! Keep going or finish up.", {
                duration: 4000,
                style: {
                    background: "#1e1e2e",
                    color: "#fff",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
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
            style: { background: "#1e1e2e", color: "#fff" },
        });
    };

    return (
        <GlassCard className={`p-6 flex flex-col justify-between overflow-visible relative z-20 ${className}`}>
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="relative">
                    <button
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[10px] font-medium text-gray-400 transition-colors border border-white/5"
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
                                className="absolute top-full left-0 mt-2 w-32 bg-[#0f1117] border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden"
                            >
                                <div className="max-h-32 overflow-y-auto custom-scrollbar p-1">
                                    {categories.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                setTimerCategory(c);
                                                setIsCategoryOpen(false);
                                            }}
                                            className={`w-full text-left px-2 py-1.5 rounded text-[10px] transition-colors ${category === c ? "bg-indigo-500/20 text-indigo-400" : "text-slate-300 hover:bg-slate-800"
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

                <div className={`p-2 rounded-xl border transition-colors ${isRunning ? 'bg-green-500/10 border-green-500/10' : 'bg-purple-500/10 border-purple-500/10'}`}>
                    <Clock className={`w-4 h-4 ${isRunning ? 'text-green-400' : 'text-purple-400'}`} />
                </div>
            </div>

            {/* Timer Display */}
            <div className="mt-2 flex flex-col items-center">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">Focus Timer</p>
                <motion.span
                    key={timeElapsed}
                    className={`text-4xl font-bold font-mono tabular-nums tracking-tight transition-colors duration-300 ${targetReached ? "text-emerald-400" : "text-white"}`}
                >
                    {formatTime(timeElapsed)}
                </motion.span>
                <p className="text-xs text-gray-500 mt-1">{topic}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 mt-auto pt-4 relative">
                {/* Reset Button */}
                {!isRunning && timeElapsed > 0 && (
                    <button
                        onClick={resetTimer}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-all border border-white/5"
                        title="Reset"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                )}

                {/* Play/Pause Button */}
                <button
                    onClick={toggleTimer}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${isRunning
                        ? "bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/20"
                        : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/20"
                        }`}
                >
                    {isRunning ? (
                        <Pause className="w-5 h-5 fill-current" />
                    ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                </button>

                {/* Finish Button */}
                {!isRunning && timeElapsed > 5 && (
                    <button
                        onClick={handleFinish}
                        className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 hover:text-white text-emerald-400 transition-all border border-emerald-500/20"
                        title="Finish Session & Save Log"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </GlassCard>
    );
};
