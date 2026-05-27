"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrutalCard } from "@/components/ui/BrutalCard";
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
            <BrutalCard className={`p-8 flex items-center justify-center relative overflow-hidden ${className}`}>
                {/* SVG Line-art Doodle Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 40 L160 40 L160 160 L40 160 Z" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
                        <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="2" />
                        <path d="M100 20 L100 180" stroke="white" strokeWidth="2" />
                        <path d="M20 100 L180 100" stroke="white" strokeWidth="2" />
                        <circle cx="160" cy="40" r="4" fill="var(--color-primary)" />
                        <circle cx="40" cy="160" r="4" fill="var(--color-accent)" />
                    </svg>
                </div>
                
                <div className="text-center relative z-10">
                    <Map className="w-8 h-8 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-100 text-lg font-Outfit font-bold">No active roadmap</p>
                    <p className="text-slate-400 text-sm font-Inter mt-1">Select one to begin tracking.</p>
                </div>
            </BrutalCard>
        );
    }

    return (
        <BrutalCard className={`p-8 relative flex flex-col ${className}`}>
            {/* Eyebrow */}
            <p className="relative z-10 text-xs font-bold uppercase tracking-widest text-slate-100 mb-3 font-Outfit">🗺️ Active Roadmap</p>

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
                            <h3 className="text-2xl font-bold text-white mb-1 font-Outfit">Path Mastered! 🏆</h3>
                            <p className="text-sm text-slate-400 font-Inter">You completed all steps in {title}</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "4px 4px 0px 0px var(--color-accent)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleReset}
                            className="flex items-center gap-2 px-6 py-3 border-2 border-accent bg-transparent text-accent text-sm font-bold font-Outfit uppercase transition-all shadow-[2px_2px_0px_0px_var(--color-accent)]"
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
                                <div className="p-2.5 border-2 border-white/20 bg-transparent shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                                    <Map className="w-5 h-5 text-slate-100" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight font-Outfit">📍 {title}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase font-Outfit mt-1">{category}</p>
                                </div>
                            </div>
                            <motion.span
                                key={safeProgress}
                                initial={{ scale: 1.2, color: "var(--color-primary)" }}
                                animate={{ scale: 1, color: "var(--color-foreground)" }}
                                className="text-xs font-Outfit font-bold border-2 border-white/20 px-2 py-1 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] tabular-nums"
                            >
                                {safeProgress}%
                            </motion.span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-2 bg-transparent border-2 border-white/20 overflow-hidden mb-6">
                            <motion.div
                                className="h-full bg-primary"
                                initial={false}
                                animate={{ width: `${safeProgress}%` }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>

                        {/* Steps list */}
                        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {steps.map((step, idx) => (
                                <motion.button
                                    key={step.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.08 + 0.15 }}
                                    onClick={() => handleToggle(step.id)}
                                    className={`
                                        group w-full flex items-center gap-3 p-4 border-2 transition-all duration-200 text-left
                                        ${step.isCompleted
                                            ? "border-primary/50 bg-primary/5"
                                            : "border-white/20 bg-transparent hover:border-white/50 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
                                        }
                                    `}
                                >
                                    <motion.div
                                        initial={false}
                                        animate={{ scale: step.isCompleted ? [1.3, 1] : 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {step.isCompleted ? (
                                            <CheckSquare className="w-5 h-5 text-primary shrink-0" />
                                        ) : (
                                            <Square className="w-5 h-5 text-slate-400 group-hover:text-slate-100 shrink-0 transition-colors" />
                                        )}
                                    </motion.div>

                                    <span className={`text-sm font-Inter font-medium transition-colors ${step.isCompleted ? "text-slate-500 line-through decoration-slate-500" : "text-slate-200"}`}>
                                        {step.title}
                                    </span>

                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-Outfit font-bold border-2 border-white/20 px-2 py-0.5 text-slate-300">
                                            {step.isCompleted ? "Undo" : "+50 XP"}
                                        </span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </BrutalCard>
    );
};
