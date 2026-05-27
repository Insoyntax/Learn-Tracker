"use client";

import { motion } from "framer-motion";
import { X, Flame, Trophy, Zap, PieChart } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

// Mock 7-day activity data
const weekActivity = [
    { day: "Mon", hours: 2.5, level: 3 },
    { day: "Tue", hours: 1.0, level: 1 },
    { day: "Wed", hours: 3.0, level: 4 },
    { day: "Thu", hours: 0.5, level: 1 },
    { day: "Fri", hours: 4.0, level: 4 },
    { day: "Sat", hours: 2.0, level: 2 },
    { day: "Sun", hours: 3.5, level: 3 },
];

const levelColors: Record<number, string> = {
    0: "bg-white/5",
    1: "bg-emerald-500/30",
    2: "bg-emerald-500/50",
    3: "bg-emerald-500/70",
    4: "bg-emerald-500",
};

export const StreakDetailModal = ({ onClose }: { onClose: () => void }) => {
    const { xp, level, streak, maxXp, xpByCategory } = useDashboardStore((s) => s.userStats);
    const progress = Math.min((xp / maxXp) * 100, 100);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative z-10 w-full max-w-md bg-gray-900/95 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/10">
                        <Flame className="w-6 h-6 text-orange-400 fill-orange-400/20" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Daily Progress</h2>
                        <p className="text-xs text-gray-400">Your learning activity this week</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                        <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                        <p className="text-xl font-bold text-white">{streak}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Day Streak</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                        <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                        <p className="text-xl font-bold text-white">Level {level}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Current</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                        <Zap className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                        <p className="text-xl font-bold text-white">{xp.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total XP</p>
                    </div>
                </div>

                {/* XP Progress */}
                <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>XP to Next Level</span>
                        <span className="tabular-nums">{xp.toLocaleString()} / {maxXp.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        />
                    </div>
                </div>

                {/* XP Distribution */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <PieChart className="w-4 h-4 text-slate-400" />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">XP Distribution</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                        {(!xpByCategory || Object.keys(xpByCategory).length === 0) ? (
                            <p className="text-[10px] text-gray-500 text-center py-2">No skill data yet. Complete roadmap steps!</p>
                        ) : (
                            Object.entries(xpByCategory)
                                .sort(([, a], [, b]) => b - a)
                                .map(([cat, catXp]) => (
                                    <div key={cat} className="group">
                                        <div className="flex justify-between text-[10px] mb-1.5">
                                            <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{cat}</span>
                                            <span className="text-gray-500 tabular-nums">{catXp} XP</span>
                                        </div>
                                        <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${xp > 0 ? Math.min((catXp / xp) * 100, 100) : 0}%` }}
                                                className="h-full bg-indigo-500"
                                            />
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>

                {/* 7-Day Activity Chart */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">7-Day Activity</p>
                    <div className="grid grid-cols-7 gap-2">
                        {weekActivity.map((day) => (
                            <div key={day.day} className="flex flex-col items-center gap-1.5">
                                <div className="w-full space-y-1">
                                    {[4, 3, 2, 1].map((row) => (
                                        <motion.div
                                            key={row}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: row * 0.05 + 0.2 }}
                                            className={`w-full aspect-square rounded-sm ${day.level >= row ? levelColors[day.level] : levelColors[0]
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-[9px] text-gray-500 font-medium">{day.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>,
        document.body
    );
};
