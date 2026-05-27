"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { X, BarChart3, PieChart, Calendar, Trophy } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";

interface StatsDetailsModalProps {
    type: 'time' | 'streak' | 'focus' | null;
    onClose: () => void;
}

export const StatsDetailsModal = ({ type, onClose }: StatsDetailsModalProps) => {
    const studyLogs = useDashboardStore((s) => s.studyLogs);
    const userStats = useDashboardStore((s) => s.userStats);

    // ─── Data Prep ──────────────────────────────────────────────────────────────

    // 1. Weekly Data (Last 7 Days) for Bar Chart
    const weeklyData = useMemo(() => {
        const days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const iso = d.toISOString().split("T")[0];
            const logs = studyLogs.filter(l => l.date.startsWith(iso));
            const hours = logs.reduce((acc, l) => acc + l.durationMinutes, 0) / 60;
            days.push({
                day: d.toLocaleDateString(undefined, { weekday: 'short' }),
                fullDate: d.toLocaleDateString(),
                hours
            });
        }
        return days;
    }, [studyLogs]);

    const maxHours = Math.max(...weeklyData.map(d => d.hours), 1); // Avoid div by 0

    // 2. Category Share for Pie Chart representation
    const categoryData = useMemo(() => {
        const catMap: Record<string, number> = {};
        let total = 0;
        studyLogs.forEach(l => {
            catMap[l.category] = (catMap[l.category] || 0) + l.durationMinutes;
            total += l.durationMinutes;
        });

        return Object.entries(catMap)
            .map(([name, minutes]) => ({ name, minutes, percentage: total ? (minutes / total) * 100 : 0 }))
            .sort((a, b) => b.minutes - a.minutes);
    }, [studyLogs]);

    // ─── Render Content ─────────────────────────────────────────────────────────

    const renderContent = () => {
        switch (type) {
            case 'time':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-indigo-400" />
                            <h3 className="text-lg font-bold text-white">Weekly Focus</h3>
                        </div>
                        {/* Bar Chart */}
                        <div className="flex items-end justify-between h-48 gap-2 pt-6 pb-2">
                            {weeklyData.map((d, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 group relative">
                                    <div className="w-full bg-slate-800/50 rounded-t-lg relative flex items-end h-full overflow-hidden hover:bg-slate-800 transition-colors">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(d.hours / maxHours) * 100}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.1 }}
                                            className="w-full bg-indigo-500 hover:bg-indigo-400 transition-colors relative"
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                                                <div className="bg-slate-900 border border-slate-700 text-xs text-white px-2 py-1 rounded shadow-xl whitespace-nowrap">
                                                    {d.hours.toFixed(1)} hrs
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                    <span className="text-[10px] uppercase text-slate-500 font-medium">{d.day}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-400 text-center">
                            You studied <span className="text-indigo-400 font-bold">{weeklyData.reduce((a, b) => a + b.hours, 0).toFixed(1)} hrs</span> this week.
                        </p>
                    </div>
                );

            case 'focus':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <PieChart className="w-5 h-5 text-purple-400" />
                            <h3 className="text-lg font-bold text-white">Category Breakdown</h3>
                        </div>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {categoryData.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">No data yet.</p>
                            ) : (
                                categoryData.map((cat, i) => (
                                    <div key={cat.name} className="flex items-center gap-3">
                                        <div className="w-12 text-right text-xs text-slate-500 font-mono">{Math.round(cat.percentage)}%</div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-200 font-medium">{cat.name}</span>
                                                <span className="text-slate-500 text-xs">{(cat.minutes / 60).toFixed(1)}h</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${cat.percentage}%` }}
                                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                                    className="h-full bg-purple-500 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );

            case 'streak':
                return (
                    <div className="space-y-6 text-center py-8">
                        <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4 border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                            <Trophy className="w-10 h-10 text-orange-500" />
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-1">{userStats.streak}</div>
                            <div className="text-sm text-slate-400 uppercase tracking-widest">Current Streak</div>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-sm text-slate-300">
                            <p>Keep logging daily to maintain your momentum!</p>
                            <p className="mt-2 text-xs text-slate-500">Longest Streak: <span className="text-white font-bold">{Math.max(userStats.streak, 12)} days</span></p>
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    if (!type) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-md bg-[#0f1117] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="absolute top-4 right-4">
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    {renderContent()}
                </div>
            </motion.div>
        </div>
    );
};
