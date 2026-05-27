"use client";

import { useDashboardStore } from "@/store/useDashboardStore";
import { useMemo } from "react";
import { motion } from "framer-motion";

interface DayData {
    date: Date;
    isoDate: string;
    minutes: number;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export const ActivityHeatmap = () => {
    const studyLogs = useDashboardStore((s) => s.studyLogs);

    const heatMapData = useMemo(() => {
        const days: DayData[] = [];
        const today = new Date();
        const totalDays = 24 * 7; // 24 weeks

        for (let i = totalDays - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const iso = d.toISOString().split("T")[0];

            const logsForDay = studyLogs.filter(l => l.date.startsWith(iso));
            const minutes = logsForDay.reduce((acc, log) => acc + log.durationMinutes, 0);

            let level: 0 | 1 | 2 | 3 | 4 = 0;
            if (minutes > 0) level = 1;
            if (minutes >= 30) level = 2;
            if (minutes >= 60) level = 3;
            if (minutes >= 120) level = 4;

            days.push({
                date: d,
                isoDate: iso,
                minutes,
                count: logsForDay.length,
                level
            });
        }
        return days;
    }, [studyLogs]);

    const weeks = useMemo(() => {
        const result = [];
        for (let i = 0; i < heatMapData.length; i += 7) {
            result.push(heatMapData.slice(i, i + 7));
        }
        return result;
    }, [heatMapData]);

    const getLevelColor = (level: number) => {
        switch (level) {
            case 0: return "bg-slate-800/40 border border-slate-700/30"; // Dull empty state
            case 1: return "bg-indigo-900/60 border border-indigo-500/30";
            case 2: return "bg-indigo-600/80 border border-indigo-400/50 shadow-[0_0_8px_rgba(99,102,241,0.4)]";
            case 3: return "bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]";
            case 4: return "bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)] border border-white/20";
            default: return "bg-slate-800/40 border border-slate-700/30";
        }
    };

    return (
        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-1.5 min-w-max">
                {weeks.map((week, wIndex) => (
                    <div key={wIndex} className="flex flex-col gap-1.5">
                        {week.map((day, dIndex) => (
                            <div key={day.isoDate} className="relative group">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: (wIndex * 7 + dIndex) * 0.002 }}
                                    className={`w-3.5 h-3.5 md:w-5 md:h-5 rounded-md ${getLevelColor(day.level)} cursor-pointer transition-all hover:scale-125 z-10 relative`}
                                />
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-slate-900/90 backdrop-blur-md text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl border border-white/10"
                                    >
                                        <div className="font-bold text-slate-200 mb-0.5">
                                            {day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </div>
                                        <div className="text-indigo-300 font-medium">
                                            {day.minutes > 0 ? `${day.minutes} mins` : "No activity"}
                                        </div>
                                    </motion.div>
                                    {/* Arrow */}
                                    <div className="w-2 h-2 bg-slate-900/90 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-white/10"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-4 text-[11px] font-medium text-slate-500 justify-end">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-4 h-4 rounded bg-slate-800/40 border border-slate-700/30" />
                    <div className="w-4 h-4 rounded bg-indigo-900/60 border border-indigo-500/30" />
                    <div className="w-4 h-4 rounded bg-indigo-600/80 border border-indigo-400/50" />
                    <div className="w-4 h-4 rounded bg-indigo-500" />
                    <div className="w-4 h-4 rounded bg-indigo-400" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
};
