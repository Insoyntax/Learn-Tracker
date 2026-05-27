"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Flame, TrendingUp } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useState } from "react";
import { StreakDetailModal } from "./StreakDetailModal";

export const StreakWidget = ({ className }: { className?: string }) => {
    const userStats = useDashboardStore((s) => s.userStats);
    const xp = userStats?.xp ?? 0;
    const maxXp = userStats?.maxXp ?? 100;
    const level = userStats?.level ?? 1;
    const streak = userStats?.streak ?? 0;
    const progress = Math.min((xp / Math.max(maxXp, 1)) * 100, 100);
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <motion.button
                onClick={() => setShowModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`text-left w-full h-full ${className}`}
            >
                <GlassCard className="flex flex-col justify-between p-6 group h-full">
                    {/* Dynamic Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/5 opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Eyebrow */}
                    <p className="relative z-10 text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">🔥 Daily Progress</p>

                    {/* Header */}
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="p-2.5 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/10 shadow-lg shadow-orange-500/5">
                            <Flame className="w-5 h-5 text-orange-400 fill-orange-400/20" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-gray-400 backdrop-blur-md flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Level {level}
                        </span>
                    </div>

                    {/* Streak Counter */}
                    <div className="relative z-10 mt-6">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">🔥 Daily Streak</p>
                        <div className="flex items-baseline gap-1.5">
                            <motion.h3
                                key={streak}
                                initial={{ scale: 1.3, color: "#fb923c" }}
                                animate={{ scale: 1, color: "#ffffff" }}
                                transition={{ duration: 0.3 }}
                                className="text-4xl font-bold tracking-tight"
                            >
                                {streak}
                            </motion.h3>
                            <span className="text-sm text-gray-500 font-medium">days</span>
                        </div>
                    </div>

                    {/* XP Progress */}
                    <div className="relative z-10 mt-auto pt-6">
                        <div className="flex justify-between text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">
                            <span>XP Progress</span>
                            <motion.span
                                key={xp}
                                initial={{ color: "#6366f1" }}
                                animate={{ color: "#d1d5db" }}
                                transition={{ duration: 0.5 }}
                                className="text-gray-300 tabular-nums"
                            >
                                {xp.toLocaleString('en-US')} / {maxXp.toLocaleString('en-US')}
                            </motion.span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                                initial={false}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>
                    </div>
                </GlassCard>
            </motion.button>

            <AnimatePresence>
                {showModal && <StreakDetailModal onClose={() => setShowModal(false)} />}
            </AnimatePresence>
        </>
    );
};
