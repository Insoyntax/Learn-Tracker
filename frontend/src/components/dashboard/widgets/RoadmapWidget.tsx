"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Map, CheckCircle2, Circle, Trophy, RotateCcw } from "lucide-react";
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
                    colors: ["#6366f1", "#818cf8", "#a5b4fc", "#fbbf24", "#34d399"],
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.7 },
                    colors: ["#6366f1", "#818cf8", "#a5b4fc", "#fbbf24", "#34d399"],
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
            <GlassCard className={`p-6 flex items-center justify-center ${className}`}>
                <div className="text-center">
                    <Map className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No active roadmap selected.</p>
                </div>
            </GlassCard>
        );
    }

    return (
        <GlassCard className={`p-6 relative overflow-hidden flex flex-col ${className}`}>
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Eyebrow */}
            <p className="relative z-10 text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">🗺️ Active Roadmap</p>

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
                            <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-lg" />
                        </motion.div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white mb-1">Path Mastered! 🏆</h3>
                            <p className="text-sm text-gray-400">You completed all steps in {title}</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
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
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/10">
                                    <Map className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white tracking-tight">📍 {title}</h3>
                                    <p className="text-[10px] text-blue-400/80 font-medium tracking-wider uppercase">{category}</p>
                                </div>
                            </div>
                            <motion.span
                                key={safeProgress}
                                initial={{ scale: 1.2, color: "#818cf8" }}
                                animate={{ scale: 1, color: "#9ca3af" }}
                                className="text-xs font-mono bg-white/5 px-2 py-1 rounded-md border border-white/5 tabular-nums"
                            >
                                {safeProgress}%
                            </motion.span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-5">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                                initial={false}
                                animate={{ width: `${safeProgress}%` }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>

                        {/* Steps list */}
                        <div className="space-y-2.5 flex-1 overflow-y-auto pr-2">
                            {steps.map((step, idx) => (
                                <motion.button
                                    key={step.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.08 + 0.15 }}
                                    onClick={() => handleToggle(step.id)}
                                    className={`
                                        group w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left
                                        ${step.isCompleted
                                            ? "bg-blue-500/5 border-blue-500/10 hover:bg-blue-500/10"
                                            : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                                        }
                                    `}
                                >
                                    <motion.div
                                        initial={false}
                                        animate={{ scale: step.isCompleted ? [1.3, 1] : 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {step.isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-600 group-hover:text-gray-400 shrink-0 transition-colors" />
                                        )}
                                    </motion.div>

                                    <span className={`text-sm font-medium transition-colors ${step.isCompleted ? "text-gray-400 line-through decoration-gray-600" : "text-gray-200"}`}>
                                        {step.title}
                                    </span>

                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400">
                                            {step.isCompleted ? "Undo" : "+50 XP"}
                                        </span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
};
