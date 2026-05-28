"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MatteCard } from "@/components/ui/MatteCard";
import { Play, Pause, RotateCcw, CheckSquare, ChevronDown } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import toast from "react-hot-toast";

const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
};

// ── Activity Ring SVG Component ─────────────────────────────────────────────
interface ActivityRingProps {
    progress: number;       // 0-100
    size?: number;          // px
    strokeWidth?: number;
    color: string;
    glowColor: string;
    label: string;
}

const ActivityRing = ({ progress, size = 100, strokeWidth = 8, color, glowColor, label }: ActivityRingProps) => {
    const r = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - Math.min(progress / 100, 1));
    const center = size / 2;

    return (
        <div className="flex flex-col items-center gap-1.5">
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                {/* Track */}
                <circle
                    cx={center} cy={center} r={r}
                    strokeWidth={strokeWidth}
                    stroke="rgba(255,255,255,0.05)"
                    fill="none"
                />
                {/* Fill */}
                <motion.circle
                    cx={center} cy={center} r={r}
                    strokeWidth={strokeWidth}
                    stroke={color}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
                />
            </svg>
            <p className="text-white/30 text-[9px] uppercase tracking-widest">{label}</p>
        </div>
    );
};

// ── Main Widget ─────────────────────────────────────────────────────────────
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
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    useEffect(() => {
        if (!isRunning && timeElapsed === 0 && defaultTimerMinutes !== targetMinutes) {
            setTargetMinutes(defaultTimerMinutes);
        }
    }, [defaultTimerMinutes, isRunning, timeElapsed, targetMinutes, setTargetMinutes]);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => tickTimer(), 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning, tickTimer]);

    useEffect(() => {
        if (targetReached && !toastFiredRef.current) {
            toastFiredRef.current = true;
            toast("🎯 Target reached! Keep going or finish.", { duration: 4000 });
        }
        if (!targetReached) toastFiredRef.current = false;
    }, [targetReached]);

    const handleFinish = () => {
        finishSession();
        toast.success("Session saved! XP Awarded ✨");
    };

    const targetSeconds = targetMinutes * 60;
    const progressPercent = Math.min((timeElapsed / Math.max(targetSeconds, 1)) * 100, 100);
    // Secondary ring: "focus depth" (oscillates with active state)
    const focusRingProgress = isRunning ? Math.min(progressPercent * 1.2, 100) : progressPercent;

    return (
        <MatteCard
            className={`p-6 flex flex-col justify-between overflow-visible relative z-20 ${className}`}
        >
            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">Pomodoro</p>
                    <p className="text-white/70 text-sm font-medium">{topic}</p>
                </div>

                {/* Category Selector */}
                <div className="relative">
                    <button
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium text-white/50 hover:text-white/80 transition-all"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)",
                        }}
                    >
                        <span>{category || "Select"}</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>

                    <AnimatePresence>
                        {isCategoryOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-2 w-36 rounded-2xl overflow-hidden z-50"
                                style={{
                                    background: "rgba(15,15,20,0.95)",
                                    backdropFilter: "blur(40px)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                                }}
                            >
                                <div className="p-1 max-h-36 overflow-y-auto custom-scrollbar">
                                    {categories.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => { setTimerCategory(c); setIsCategoryOpen(false); }}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors ${
                                                category === c
                                                    ? "bg-sky-500/15 text-sky-400"
                                                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"
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
            </div>

            {/* ── Activity Rings ── */}
            <div className="flex items-center justify-center gap-4 py-4">
                {/* Outer ring: Session progress */}
                <ActivityRing
                    progress={progressPercent}
                    size={100}
                    strokeWidth={8}
                    color={targetReached ? "#34d399" : "#38bdf8"}
                    glowColor={targetReached ? "rgba(52,211,153,0.5)" : "rgba(56,189,248,0.5)"}
                    label="Session"
                />

                {/* Time display in center area */}
                <div className="text-center px-2">
                    <motion.p
                        key={timeElapsed}
                        className="text-3xl font-semibold tabular-nums text-white tracking-tight"
                        animate={{ color: targetReached ? "#34d399" : "#f0f0f0" }}
                        transition={{ duration: 0.5 }}
                    >
                        {formatTime(timeElapsed)}
                    </motion.p>
                    <p className="text-white/25 text-[9px] uppercase tracking-widest mt-1">
                        of {targetMinutes}:00
                    </p>
                </div>

                {/* Inner ring: Focus depth */}
                <ActivityRing
                    progress={focusRingProgress}
                    size={100}
                    strokeWidth={8}
                    color={isRunning ? "#a78bfa" : "rgba(167,139,250,0.4)"}
                    glowColor="rgba(167,139,250,0.4)"
                    label="Focus"
                />
            </div>

            {/* ── Controls ── */}
            <div className="flex items-center justify-center gap-3 mt-2">
                {/* Reset */}
                {!isRunning && timeElapsed > 0 && (
                    <button
                        onClick={resetTimer}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white/30 hover:text-white/60 transition-all"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                )}

                {/* Play/Pause */}
                <motion.button
                    onClick={toggleTimer}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                    style={{
                        background: isRunning
                            ? "linear-gradient(135deg, rgba(167,139,250,0.3), rgba(56,189,248,0.2))"
                            : "linear-gradient(135deg, rgba(56,189,248,0.25), rgba(52,211,153,0.15))",
                        border: `1px solid ${isRunning ? "rgba(167,139,250,0.3)" : "rgba(56,189,248,0.3)"}`,
                        boxShadow: `0 0 24px ${isRunning ? "rgba(167,139,250,0.2)" : "rgba(56,189,248,0.2)"}`,
                    }}
                >
                    {isRunning
                        ? <Pause className="w-5 h-5 text-violet-300 fill-current" />
                        : <Play className="w-5 h-5 text-sky-300 fill-current ml-0.5" />
                    }
                </motion.button>

                {/* Finish */}
                {!isRunning && timeElapsed > 5 && (
                    <button
                        onClick={handleFinish}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-all"
                        style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}
                        title="Finish & Save"
                    >
                        <CheckSquare className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </MatteCard>
    );
};
