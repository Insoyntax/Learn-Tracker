"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MatteCard } from "@/components/ui/MatteCard";
import { Flame, TrendingUp } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useState, useMemo } from "react";
import { StreakDetailModal } from "./StreakDetailModal";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

/** Generate a 7×8 (56 cells) mock activity matrix from today going back */
function buildHeatmapGrid(streak: number): Array<{ active: boolean; intensity: number }> {
    const cells = Array.from({ length: 56 }, (_, i) => {
        const daysAgo = 55 - i;
        const isInStreak = daysAgo < streak;
        const randomFill = Math.random();

        if (isInStreak) {
            return { active: true, intensity: 0.5 + randomFill * 0.5 };
        }
        return { active: randomFill > 0.6, intensity: randomFill * 0.4 };
    });
    return cells;
}

export const StreakWidget = ({ className }: { className?: string }) => {
    const userStats = useDashboardStore((s) => s.userStats);
    const xp = userStats?.xp ?? 0;
    const maxXp = userStats?.maxXp ?? 500;
    const level = userStats?.level ?? 1;
    const streak = userStats?.streak ?? 0;
    const xpByCategory = userStats?.xpByCategory ?? {};
    const progress = Math.min((xp / Math.max(maxXp, 1)) * 100, 100);

    const [showModal, setShowModal] = useState(false);

    const heatmap = useMemo(() => buildHeatmapGrid(streak), [streak]);

    // Radar data from xpByCategory (top 5)
    const radarData = useMemo(() => {
        const entries = Object.entries(xpByCategory).slice(0, 6);
        if (entries.length === 0) {
            return [
                { subject: "Code", A: 40 },
                { subject: "Math", A: 25 },
                { subject: "Lang", A: 60 },
                { subject: "Design", A: 30 },
                { subject: "Science", A: 50 },
            ];
        }
        const max = Math.max(...entries.map(([, v]) => v), 1);
        return entries.map(([k, v]) => ({
            subject: k.slice(0, 6),
            A: Math.round((v / max) * 100),
        }));
    }, [xpByCategory]);

    return (
        <>
            <motion.button
                onClick={() => setShowModal(true)}
                className={`text-left w-full h-full ${className}`}
                whileTap={{ scale: 0.99 }}
            >
                <MatteCard
                    className="flex flex-col justify-between p-6 h-full"
                >
                    {/* ── Header ── */}
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-white/40 text-[10px] tracking-widest uppercase mb-1">Daily Progress</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-semibold text-white tabular-nums">{streak}</h3>
                                <span className="text-white/30 text-sm">day streak</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            {/* Level badge */}
                            <div
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium"
                                style={{
                                    background: "rgba(56,189,248,0.1)",
                                    border: "1px solid rgba(56,189,248,0.2)",
                                    color: "#38bdf8",
                                }}
                            >
                                <TrendingUp className="w-3 h-3" />
                                Lv {level}
                            </div>
                            {/* Flame icon */}
                            <div
                                className="p-2 rounded-xl"
                                style={{
                                    background: "rgba(251,146,60,0.1)",
                                    border: "1px solid rgba(251,146,60,0.2)",
                                }}
                            >
                                <Flame className="w-4 h-4 text-orange-400" />
                            </div>
                        </div>
                    </div>

                    {/* ── Dot Matrix Heatmap ── */}
                    <div className="mb-4">
                        <p className="text-white/25 text-[9px] tracking-widest uppercase mb-2">56-Day Activity</p>
                        <div className="grid grid-cols-8 gap-1">
                            {heatmap.map((cell, i) => (
                                <div
                                    key={i}
                                    className="heatmap-dot aspect-square rounded-[3px]"
                                    style={{
                                        background: cell.active
                                            ? `rgba(56, 189, 248, ${0.2 + cell.intensity * 0.8})`
                                            : "rgba(255,255,255,0.04)",
                                        boxShadow: cell.active && cell.intensity > 0.7
                                            ? `0 0 6px rgba(56, 189, 248, ${cell.intensity * 0.4})`
                                            : "none",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ── Radar Chart (Skill Levels) ── */}
                    <div className="h-24 -mx-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="80%">
                                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                                <PolarAngleAxis
                                    dataKey="subject"
                                    tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9 }}
                                />
                                <Radar
                                    name="Skills"
                                    dataKey="A"
                                    stroke="rgba(56,189,248,0.6)"
                                    fill="rgba(56,189,248,0.08)"
                                    strokeWidth={1.5}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* ── XP Progress Bar ── */}
                    <div className="mt-4">
                        <div className="flex justify-between text-[9px] text-white/30 uppercase tracking-widest mb-1.5">
                            <span>XP Progress</span>
                            <span>{xp.toLocaleString()} / {maxXp.toLocaleString()}</span>
                        </div>
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    background: "linear-gradient(90deg, #38bdf8, #a78bfa)",
                                    boxShadow: "0 0 8px rgba(56,189,248,0.4)",
                                }}
                                initial={false}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>
                    </div>
                </MatteCard>
            </motion.button>

            <AnimatePresence>
                {showModal && <StreakDetailModal onClose={() => setShowModal(false)} />}
            </AnimatePresence>
        </>
    );
};
