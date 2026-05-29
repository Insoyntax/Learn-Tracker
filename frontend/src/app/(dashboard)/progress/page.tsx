"use client";

import { MatteCard } from "@/components/ui/MatteCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CheckCircle2, TrendingUp, BarChart3, Trophy } from "lucide-react";

import { useDashboardStore } from "@/store/useDashboardStore";

export default function ProgressPage() {
    const roadmaps = useDashboardStore(s => s.roadmaps || []);

    return (
        <div className="h-full flex flex-col space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Progress</h1>
                    <p className="text-zinc-400 mt-1">Track your roadmap completions and study analytics.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Col: Roadmaps List */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">Active Roadmaps</h2>
                    
                    <div className="space-y-4">
                        {roadmaps.length > 0 ? (
                            roadmaps.map((r, i) => (
                                <RoadmapProgressCard 
                                    key={r.id}
                                    title={r.title} 
                                    category={r.tags?.[0] || "General"} 
                                    progress={r.progress || 0} 
                                    color={i % 3 === 0 ? "cyan" : i % 3 === 1 ? "rose" : "emerald"}
                                />
                            ))
                        ) : (
                            <MatteCard className="p-6 flex flex-col items-center justify-center text-center opacity-50 border-dashed min-h-[200px]">
                                <p className="text-sm text-zinc-400 font-medium">No roadmaps to track.</p>
                            </MatteCard>
                        )}
                    </div>
                </div>

                {/* Right Col: Analytics */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">Weekly Overview</h2>
                    
                    <MatteCard className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-semibold text-zinc-300">Study Hours</h3>
                            <BarChart3 className="w-4 h-4 text-zinc-500" />
                        </div>
                        {/* Dummy Bar Chart */}
                        <div className="flex items-end justify-between h-32 gap-2 mt-4">
                            {[40, 70, 45, 90, 60, 20, 80].map((h, i) => (
                                <div key={i} className="w-full bg-white/5 rounded-t-sm relative group">
                                    <div 
                                        className="absolute bottom-0 w-full bg-cyan-400 rounded-t-sm transition-all duration-500"
                                        style={{ height: `${h}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                <span key={i} className="text-[10px] text-zinc-500 w-full text-center">{d}</span>
                            ))}
                        </div>
                    </MatteCard>

                    <MatteCard className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-zinc-300">Achievements</h3>
                            <Trophy className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="space-y-4 mt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-200">7 Day Streak!</p>
                                    <p className="text-xs text-zinc-500">Completed yesterday</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-400/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-200">First Roadmap</p>
                                    <p className="text-xs text-zinc-500">Completed 2 weeks ago</p>
                                </div>
                            </div>
                        </div>
                    </MatteCard>
                </div>

            </div>
        </div>
    );
}

function RoadmapProgressCard({ title, category, progress, color }: any) {
    const colorMap: any = {
        cyan: "bg-cyan-400",
        rose: "bg-rose-400",
        emerald: "bg-emerald-400",
    };

    return (
        <MatteCard className="p-5">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-base font-medium text-zinc-100">{title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{category}</p>
                </div>
                <span className="text-sm font-bold text-zinc-200">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full ${colorMap[color]}`} 
                    style={{ width: `${progress}%` }}
                />
            </div>
        </MatteCard>
    );
}
