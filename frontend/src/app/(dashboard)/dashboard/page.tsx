"use client";

import { useDashboardStore } from "@/store/useDashboardStore";
import { MatteCard } from "@/components/ui/MatteCard";
import { RoadmapWidget } from "@/components/dashboard/widgets/RoadmapWidget";
import { FocusTimerWidget } from "@/components/dashboard/widgets/FocusTimerWidget";
import { Coins, Flame, Award, Clock } from "lucide-react";

export default function DashboardPage() {
    const { settings, userStats, roadmaps, plannedSessions } = useDashboardStore();

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
                        Welcome back, {settings.userName || "Student"}
                    </h1>
                    <p className="text-zinc-400 mt-1">Here is an overview of your progress today.</p>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MatteCard className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center">
                        <Coins className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-400">XP Balance</p>
                        <p className="text-2xl font-bold text-zinc-100">{userStats.xp}</p>
                    </div>
                </MatteCard>

                <MatteCard className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                        <Award className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-400">Current Level</p>
                        <p className="text-2xl font-bold text-zinc-100">Lvl {userStats.level}</p>
                    </div>
                </MatteCard>

                <MatteCard className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-400/10 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-rose-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-400">Day Streak</p>
                        <p className="text-2xl font-bold text-zinc-100">{userStats.streak}</p>
                    </div>
                </MatteCard>

                <MatteCard className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-zinc-400">Focus Today</p>
                        <p className="text-2xl font-bold text-zinc-100">2h 15m</p>
                    </div>
                </MatteCard>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Roadmaps (My Last Courses) */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">Active Roadmaps</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {roadmaps.length > 0 ? (
                            <RoadmapWidget className="h-[320px]" />
                        ) : (
                            <MatteCard className="p-6 relative flex flex-col h-[320px] items-center justify-center text-center opacity-50 border-dashed">
                                <BookOpen className="w-6 h-6 text-zinc-400 mb-3" />
                                <p className="text-sm text-zinc-400 font-medium">No roadmaps active.</p>
                                <p className="text-xs text-zinc-500 mt-1">Visit Roadmaps to start learning.</p>
                            </MatteCard>
                        )}
                    </div>
                </div>

                {/* Right Column: Mini Schedule & Timer */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">Mini Schedule</h2>
                        <MatteCard className="p-5">
                            {plannedSessions && plannedSessions.length > 0 ? (
                                <ul className="space-y-4">
                                    {plannedSessions.slice(0, 3).map(session => (
                                        <li key={session.id} className="flex items-start gap-3">
                                            <div className={`w-2 h-2 mt-1.5 rounded-full ${
                                                session.referenceType === 'roadmap' ? 'bg-emerald-400' :
                                                session.referenceType === 'studio' ? 'bg-cyan-400' : 'bg-rose-400'
                                            }`} />
                                            <div>
                                                <p className="text-sm font-medium text-zinc-200">{session.title}</p>
                                                <p className="text-xs text-zinc-500">
                                                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center opacity-50 py-4">
                                    <p className="text-sm text-zinc-400">Your schedule is clear.</p>
                                </div>
                            )}
                        </MatteCard>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">Focus Session</h2>
                        <FocusTimerWidget />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Dummy icon for the second roadmap card
const BookOpen = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
