"use client";

import { useState, useEffect, useMemo } from "react";
import { MatteCard } from "@/components/ui/MatteCard";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { 
    startOfWeek, 
    endOfWeek, 
    addDays, 
    subWeeks, 
    addWeeks, 
    format, 
    isSameDay, 
    isToday, 
    differenceInMinutes, 
    startOfDay 
} from "date-fns";
import { useDashboardStore, PlannedSession } from "@/store/useDashboardStore";
import { AddSessionModal } from "@/components/schedule/AddSessionModal";
import { SessionDetailModal } from "@/components/schedule/SessionDetailModal";

const START_HOUR = 6;
const END_HOUR = 24;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR); 

export default function SchedulePage() {
    const plannedSessions = useDashboardStore((s) => s.plannedSessions || []);
    
    // Navigation state
    const [currentDate, setCurrentDate] = useState(new Date());
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    
    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<PlannedSession | null>(null);

    // Current Time Indicator
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    // Generate days of the week
    const DAYS = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    }, [weekStart]);

    const handleGridClick = (day: Date, hour: number) => {
        const slotTime = new Date(day);
        slotTime.setHours(hour, 0, 0, 0);
        setSelectedSlot(slotTime.toISOString());
        setIsAddModalOpen(true);
    };

    const calculateTopOffset = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        if (hours < START_HOUR) return 0;
        return ((hours - START_HOUR) * 80) + ((minutes / 60) * 80);
    };

    const calculateHeight = (start: Date, end: Date) => {
        const diffMins = differenceInMinutes(end, start);
        return (diffMins / 60) * 80;
    };

    return (
        <div className="h-full flex flex-col space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Schedule</h1>
                    <p className="text-zinc-400 mt-1">Manage your weekly learning sessions.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-[#1C1C1E] border border-white/5 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
                            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="px-4 text-sm font-medium">
                            {format(weekStart, "MMM d")} - {format(endOfWeek(weekStart, { weekStartsOn: 1 }), "MMM d")}
                        </span>
                        <button 
                            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
                            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <button 
                        onClick={() => {
                            setSelectedSlot(new Date().toISOString());
                            setIsAddModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-medium rounded-lg transition-colors text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Session
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <MatteCard className="flex-1 overflow-hidden flex flex-col min-h-[600px]">
                {/* Days Header */}
                <div className="grid grid-cols-8 border-b border-white/5 bg-white/[0.02]">
                    <div className="p-4 border-r border-white/5" /> {/* Empty corner */}
                    {DAYS.map(day => (
                        <div key={day.toISOString()} className={`p-4 text-center border-r border-white/5 last:border-0 ${isToday(day) ? 'bg-cyan-500/5' : ''}`}>
                            <span className={`text-sm font-medium ${isToday(day) ? 'text-cyan-400' : 'text-zinc-300'}`}>
                                {format(day, "EEE d")}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Time Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <div className="grid grid-cols-8 relative min-h-[800px]">
                        {/* Time labels column */}
                        <div className="border-r border-white/5 bg-white/[0.01]">
                            {HOURS.map(hour => (
                                <div key={hour} className="h-20 border-b border-white/5 p-2 text-right relative">
                                    <span className="text-xs text-zinc-500 relative -top-3">
                                        {format(new Date().setHours(hour, 0), "h a")}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Grid lines & Events */}
                        <div className="col-span-7 grid grid-cols-7 relative">
                            {/* Horizontal lines */}
                            <div className="absolute inset-0 pointer-events-none">
                                {HOURS.map(hour => (
                                    <div key={hour} className="h-20 border-b border-white/5 w-full" />
                                ))}
                            </div>
                            
                            {/* Vertical Columns */}
                            {DAYS.map((day, colIndex) => (
                                <div key={day.toISOString()} className="relative border-r border-white/5 h-full last:border-0 group">
                                    {/* Clickable Empty Slots */}
                                    {HOURS.map(hour => (
                                        <div 
                                            key={hour} 
                                            onClick={() => handleGridClick(day, hour)}
                                            className="h-20 w-full hover:bg-white/[0.02] cursor-pointer transition-colors"
                                        />
                                    ))}

                                    {/* Render Sessions for this day */}
                                    {plannedSessions
                                        .filter(session => isSameDay(new Date(session.startTime), day))
                                        .map(session => {
                                            const start = new Date(session.startTime);
                                            const end = new Date(session.endTime);
                                            const top = calculateTopOffset(start);
                                            const height = calculateHeight(start, end);

                                            return (
                                                <div 
                                                    key={session.id}
                                                    onClick={() => setSelectedSession(session)}
                                                    className={`absolute left-1 right-1 rounded-lg p-2 shadow-lg backdrop-blur-sm cursor-pointer hover:scale-[1.02] transition-transform overflow-hidden ${
                                                        session.referenceType === 'roadmap' ? 'bg-emerald-400/20 border border-emerald-400/40 shadow-emerald-900/20' :
                                                        session.referenceType === 'studio' ? 'bg-cyan-400/20 border border-cyan-400/40 shadow-cyan-900/20' :
                                                        'bg-rose-400/20 border border-rose-400/40 shadow-rose-900/20'
                                                    }`}
                                                    style={{ top: `${top}px`, height: `${height}px` }}
                                                >
                                                    <p className={`text-xs font-semibold truncate ${
                                                        session.referenceType === 'roadmap' ? 'text-emerald-300' :
                                                        session.referenceType === 'studio' ? 'text-cyan-300' :
                                                        'text-rose-300'
                                                    }`}>
                                                        {session.title}
                                                    </p>
                                                    {height >= 40 && (
                                                        <p className={`text-[10px] mt-1 ${
                                                            session.referenceType === 'roadmap' ? 'text-emerald-500' :
                                                            session.referenceType === 'studio' ? 'text-cyan-500' :
                                                            'text-rose-500'
                                                        }`}>
                                                            {format(start, "h:mm a")} - {format(end, "h:mm a")}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        
                                    {/* Current Time Indicator */}
                                    {isToday(day) && now.getHours() >= START_HOUR && now.getHours() < END_HOUR && (
                                        <div 
                                            className="absolute left-0 right-0 h-[2px] bg-cyan-500 z-20 pointer-events-none shadow-[0_0_8px_var(--color-cyan-500)]"
                                            style={{ top: `${calculateTopOffset(now)}px` }}
                                        >
                                            <div className="absolute left-0 -top-1.5 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_var(--color-cyan-400)] -translate-x-1/2" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </MatteCard>

            {/* Modals */}
            <AddSessionModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                initialStartTime={selectedSlot}
            />
            
            <SessionDetailModal
                isOpen={!!selectedSession}
                onClose={() => setSelectedSession(null)}
                session={selectedSession}
            />
        </div>
    );
}
