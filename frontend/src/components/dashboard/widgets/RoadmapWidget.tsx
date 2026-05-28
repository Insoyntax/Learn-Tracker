"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MatteCard } from "@/components/ui/MatteCard";
import { Map, CheckSquare, Square, Trophy, RotateCcw } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import confetti from "canvas-confetti";

export const RoadmapWidget = ({ className }: { className?: string }) => {
    // Gracefully handle null activeRoadmap
    const activeRoadmap = useDashboardStore((s) => s.roadmaps.find(r => r.id === s.activeRoadmapId));
    const { id, title, category, steps, progress } = activeRoadmap || {
        id: 0,
        title: "No Active Roadmap",
        category: "Select one from Roadmaps",
        steps: [],
        progress: 0
    };

    const safeProgress = Number.isNaN(progress) || progress === undefined ? 0 : progress;

    const toggleStep = useDashboardStore((s) => s.toggleStep);
    const resetRoadmap = useDashboardStore((s) => s.resetRoadmap);

    const allDone = steps.length > 0 && steps.every((s) => s.isCompleted);
    const [showSuccess, setShowSuccess] = useState(false);
    const confettiFired = useRef(false);

    const handleToggle = useCallback(
        (stepId: number) => {
            if (activeRoadmap) {
                toggleStep(activeRoadmap.id, stepId);
            }
        },
        [toggleStep, activeRoadmap]
    );

    // Fire confetti when all steps are done, then show success state
    useEffect(() => {
        if (allDone && !confettiFired.current) {
            confettiFired.current = true;

            // Fire confetti burst
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.7 },
                    colors: ["#CFFF04", "#F59E0B", "#ffffff"],
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.7 },
                    colors: ["#CFFF04", "#F59E0B", "#ffffff"],
                });
                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();

            // Show success state after confetti
            setTimeout(() => setShowSuccess(true), 1500);
        }

        if (!allDone) {
            confettiFired.current = false;
            setShowSuccess(false);
        }
    }, [allDone]);

    const handleReset = () => {
        setShowSuccess(false);
        if (activeRoadmap) resetRoadmap(activeRoadmap.id);
    };

    if (!activeRoadmap) {
        return (
            <MatteCard className={`h-full w-full p-8 flex flex-col items-center justify-center relative overflow-hidden ${className}`}>
                <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                        <circle cx="100" cy="100" r="70" stroke="rgba(56,189,248,0.5)" strokeWidth="1" strokeDasharray="4 6" />
                        <circle cx="100" cy="100" r="40" stroke="rgba(167,139,250,0.4)" strokeWidth="1" />
                        <path d="M100 30 L100 170" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                        <path d="M30 100 L170 100" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                        <circle cx="100" cy="100" r="6" fill="rgba(56,189,248,0.4)" />
                    </svg>
                </div>
                <div className="text-center relative z-10">
                    <Map className="w-8 h-8 text-white/30 mx-auto mb-3" />
                    <p className="text-white/60 text-base font-medium">No active roadmap</p>
                    <p className="text-white/25 text-sm mt-1">Select one to begin tracking.</p>
                </div>
            </MatteCard>
        );
    }

    return (
        <MatteCard className={`p-6 relative flex flex-col ${className}`}>
            <p className="relative z-10 text-white/30 text-[10px] tracking-widest uppercase mb-4">Active Roadmap</p>

            <AnimatePresence mode="wait">
                {showSuccess ? (
                    /* ── Success State ── */
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="relative z-10 flex-1 flex flex-col items-center justify-center gap-4"
                    >
                        <motion.div
                            initial={{ rotate: -20, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", damping: 12, delay: 0.1 }}
                        >
                            <Trophy className="w-16 h-16 text-accent drop-shadow-md" />
                        </motion.div>
                        <div className="text-center">
                            <h3 className="text-2xl font-semibold text-white mb-1">Path Mastered! 🏆</h3>
                            <p className="text-sm text-white/40 mt-1">You completed all steps in {title}</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleReset}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-sky-400 transition-all"
                            style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)" }}
                        >
                            <RotateCcw className="w-4 h-4" />
                            Choose Next Path
                        </motion.button>
                    </motion.div>
                ) : (
                    /* ── Normal Roadmap ── */
                    <motion.div
                        key="roadmap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 flex flex-col flex-1"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl" style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.15)" }}>
                                    <Map className="w-4 h-4 text-sky-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white tracking-tight">{title}</h3>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{category}</p>
                                </div>
                            </div>
                            <span
                                className="text-xs font-medium px-2.5 py-1 rounded-full tabular-nums text-sky-400"
                                style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.15)" }}
                            >
                                {safeProgress}%
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-1 rounded-full overflow-hidden mb-5" style={{ background: "rgba(255,255,255,0.04)" }}>
                            <motion.div
                                className="h-full rounded-full"
                                style={{ background: "linear-gradient(90deg, #38bdf8, #a78bfa)", boxShadow: "0 0 8px rgba(56,189,248,0.4)" }}
                                initial={false}
                                animate={{ width: `${safeProgress}%` }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>

                        {/* Steps list — Glowing Timeline */}
                        <div className="relative space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {/* Timeline line */}
                            <div className="absolute left-4 top-4 bottom-4 w-px" style={{ background: "linear-gradient(to bottom, rgba(56,189,248,0.4), rgba(167,139,250,0.2), transparent)" }} />

                            {steps.map((step, idx) => (
                                <motion.button
                                    key={step.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => handleToggle(step.id)}
                                    className="group w-full flex items-center gap-4 text-left"
                                >
                                    {/* Timeline node */}
                                    <div
                                        className="shrink-0 w-8 h-8 rounded-full z-10 flex items-center justify-center transition-all duration-300"
                                        style={step.isCompleted ? {
                                            background: "rgba(52,211,153,0.15)",
                                            border: "1px solid rgba(52,211,153,0.4)",
                                            boxShadow: "0 0 12px rgba(52,211,153,0.3)",
                                        } : {
                                            background: "rgba(255,255,255,0.04)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                        }}
                                    >
                                        {step.isCompleted
                                            ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                                            : <Square className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                                        }
                                    </div>

                                    {/* Step content */}
                                    <div
                                        className="flex-1 min-w-0 p-3 rounded-xl transition-all duration-200 group-hover:bg-white/[0.03]"
                                        style={{ border: "1px solid rgba(255,255,255,0.04)" }}
                                    >
                                        <span className={`text-xs font-medium transition-colors ${
                                            step.isCompleted
                                                ? "text-white/25 line-through"
                                                : "text-white/70 group-hover:text-white/90"
                                        }`}>
                                            {step.title}
                                        </span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </MatteCard>
    );
};
