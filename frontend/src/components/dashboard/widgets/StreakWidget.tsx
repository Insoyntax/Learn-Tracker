"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BrutalCard } from "@/components/ui/BrutalCard";
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
                <BrutalCard className="flex flex-col justify-between p-8 group h-full">
                    {/* Eyebrow */}
                    <p className="relative z-10 text-xs font-bold uppercase tracking-widest text-slate-100 mb-3 font-Outfit">🔥 Daily Progress</p>

                    {/* Header */}
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="p-2.5 bg-accent/20 rounded-none border-2 border-accent shadow-[2px_2px_0px_0px_var(--color-accent)]">
                            <Flame className="w-5 h-5 text-accent fill-accent" />
                        </div>
                        <span className="px-3 py-1 bg-transparent border-2 border-white/20 text-xs font-bold text-slate-100 uppercase font-Outfit flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
                            <TrendingUp className="w-3 h-3 text-primary" />
                            Level {level}
                        </span>
                    </div>

                    {/* Streak Counter */}
                    <div className="relative z-10 mt-6">
                        <p className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mb-1 font-Outfit">Daily Streak</p>
                        <div className="flex items-baseline gap-1.5">
                            <motion.h3
                                key={streak}
                                initial={{ scale: 1.3, color: "var(--color-accent)" }}
                                animate={{ scale: 1, color: "var(--color-foreground)" }}
                                transition={{ duration: 0.3 }}
                                className="text-5xl font-Outfit font-bold tracking-tight text-accent"
                            >
                                {streak}
                            </motion.h3>
                            <span className="text-sm text-slate-300 font-bold uppercase font-Outfit">days</span>
                        </div>
                    </div>

                    {/* XP Progress */}
                    <div className="relative z-10 mt-auto pt-6">
                        <div className="flex justify-between text-[10px] uppercase tracking-wider text-slate-300 font-bold mb-2 font-Outfit">
                            <span>XP Progress</span>
                            <motion.span
                                key={xp}
                                initial={{ color: "var(--color-primary)" }}
                                animate={{ color: "var(--color-foreground)" }}
                                transition={{ duration: 0.5 }}
                                className="text-primary tabular-nums"
                            >
                                {xp.toLocaleString('en-US')} / {maxXp.toLocaleString('en-US')}
                            </motion.span>
                        </div>
                        <div className="h-2 bg-transparent border-2 border-white/20 rounded-none overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={false}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>
                    </div>
                </BrutalCard>
            </motion.button>

            <AnimatePresence>
                {showModal && <StreakDetailModal onClose={() => setShowModal(false)} />}
            </AnimatePresence>
        </>
    );
};
