"use client";

import { useState, useMemo } from "react";

import { GlassCard } from "@/components/ui/GlassCard";
import { ActivityHeatmap } from "@/components/logs/ActivityHeatmap";
import { ManualLogModal } from "@/components/logs/ManualLogModal";
import { StatsDetailsModal } from "@/components/logs/StatsDetailsModal";
import { useDashboardStore, StudyLog } from "@/store/useDashboardStore";
import { Clock, Calendar, Trophy, Flame, Plus, ArrowRight, History, BarChart3, PieChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function LogsPage() {
    const studyLogs = useDashboardStore((s) => s.studyLogs);
    const streak = useDashboardStore((s) => s.userStats.streak);

    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [selectedStat, setSelectedStat] = useState<'time' | 'streak' | 'focus' | null>(null);

    // ─── Stats Calculation ────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const totalMinutes = studyLogs.reduce((acc, log) => acc + log.durationMinutes, 0);
        const totalHours = (totalMinutes / 60).toFixed(1);

        // Top Category
        const catMap: Record<string, number> = {};
        studyLogs.forEach(log => {
            catMap[log.category] = (catMap[log.category] || 0) + log.durationMinutes;
        });
        const topCategory = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];

        return {
            totalHours,
            topCategory: topCategory ? topCategory[0] : "N/A",
            topCategoryMinutes: topCategory ? topCategory[1] : 0,
        };
    }, [studyLogs]);

    const sortedLogs = useMemo(() => {
        return [...studyLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [studyLogs]);

    return (
        <>
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
                        Analytics & History
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Visualize your consistency and track every minute of learning.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/5"
                    >
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <span>Focus Timer</span>
                    </Link>
                    <button
                        onClick={() => setIsLogModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Log Session</span>
                    </button>
                </div>
            </header>

            {/* ─── Analytics Section ────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Heatmap Card (Spans 2 cols) */}
                <GlassCard className="md:col-span-2 p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-lg font-semibold text-white">Study Consistency</h3>
                    </div>
                    <ActivityHeatmap />
                </GlassCard>

                {/* KPI Cards */}
                <div className="flex flex-col gap-4">
                    <GlassCard
                        hoverEffect
                        onClick={() => setSelectedStat('time')}
                        className="flex-1 p-5 flex items-center justify-between cursor-pointer group"
                    >
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 group-hover:text-indigo-400 transition-colors">Total Time</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">{stats.totalHours}</span>
                                <span className="text-sm text-gray-500">hrs</span>
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                    </GlassCard>

                    <GlassCard
                        hoverEffect
                        onClick={() => setSelectedStat('streak')}
                        className="flex-1 p-5 flex items-center justify-between cursor-pointer group"
                    >
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 group-hover:text-orange-400 transition-colors">Current Streak</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">{streak}</span>
                                <span className="text-sm text-gray-500">days</span>
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                            <Flame className="w-6 h-6" />
                        </div>
                    </GlassCard>

                    <GlassCard
                        hoverEffect
                        onClick={() => setSelectedStat('focus')}
                        className="flex-1 p-5 flex items-center justify-between cursor-pointer group"
                    >
                        <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 group-hover:text-purple-400 transition-colors">Top Focus</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-white truncate max-w-[120px]">{stats.topCategory}</span>
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                            <PieChart className="w-6 h-6" />
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* ─── History List ─────────────────────────────────────────────────── */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <History className="w-5 h-5 text-gray-400" />
                    Session History
                </h2>

                <div className="space-y-3">
                    {sortedLogs.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 bg-white/5 rounded-2xl border border-white/5">
                            <p>No study logs yet. Start the timer or log a session!</p>
                        </div>
                    ) : (
                        sortedLogs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors"
                            >
                                {/* Date */}
                                <div className="min-w-[80px] text-center">
                                    <div className="text-sm font-bold text-white">
                                        {new Date(log.date).getDate()}
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase">
                                        {new Date(log.date).toLocaleDateString(undefined, { month: 'short' })}
                                    </div>
                                </div>

                                {/* Category Badge */}
                                <div className="w-[120px] shrink-0">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-indigo-300 border border-white/10">
                                        {log.category}
                                    </span>
                                </div>

                                {/* Notes */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-300 truncate">
                                        {log.notes || <span className="text-gray-600 italic">No notes added</span>}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] uppercase font-bold tracking-wider ${log.type === 'auto' ? 'text-green-500/70' : 'text-blue-500/70'}`}>
                                            {log.type === 'auto' ? 'Timer Session' : 'Manual Log'}
                                        </span>
                                    </div>
                                </div>

                                {/* Duration */}
                                <div className="text-right min-w-[80px]">
                                    <div className="text-lg font-bold text-white">
                                        {log.durationMinutes}<span className="text-xs text-gray-500 font-normal ml-1">min</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isLogModalOpen && (
                    <ManualLogModal onClose={() => setIsLogModalOpen(false)} />
                )}
                {selectedStat && (
                    <StatsDetailsModal type={selectedStat} onClose={() => setSelectedStat(null)} />
                )}
            </AnimatePresence>
        </>
    );
}
