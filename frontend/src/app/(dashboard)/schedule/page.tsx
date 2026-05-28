"use client";

import { MatteCard } from "@/components/ui/MatteCard";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
const DAYS = ["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16", "Sat 17", "Sun 18"];

export default function SchedulePage() {
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
                        <button className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="px-4 text-sm font-medium">May 12 - May 18</span>
                        <button className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-medium rounded-lg transition-colors text-sm">
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
                        <div key={day} className="p-4 text-center border-r border-white/5 last:border-0">
                            <span className="text-sm font-medium text-zinc-300">{day}</span>
                        </div>
                    ))}
                </div>

                {/* Time Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-8 relative min-h-[800px]">
                        {/* Time labels column */}
                        <div className="border-r border-white/5 bg-white/[0.01]">
                            {HOURS.map(hour => (
                                <div key={hour} className="h-20 border-b border-white/5 p-2 text-right">
                                    <span className="text-xs text-zinc-500">{hour}:00 {hour >= 12 ? 'PM' : 'AM'}</span>
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
                            
                            {/* Vertical lines */}
                            {DAYS.map((day, i) => (
                                <div key={day} className="border-r border-white/5 h-full last:border-0" />
                            ))}

                            {/* Dummy Events */}
                            <div className="absolute top-[40px] left-[14.28%] w-[13.5%] h-[120px] bg-cyan-400/20 border border-cyan-400/40 rounded-lg p-3 m-1 shadow-lg shadow-cyan-900/20 backdrop-blur-sm">
                                <p className="text-xs font-semibold text-cyan-300">Data Structures</p>
                                <p className="text-[10px] text-cyan-500 mt-1">09:00 AM - 10:30 AM</p>
                            </div>

                            <div className="absolute top-[200px] left-[42.85%] w-[13.5%] h-[80px] bg-rose-400/20 border border-rose-400/40 rounded-lg p-3 m-1 shadow-lg shadow-rose-900/20 backdrop-blur-sm">
                                <p className="text-xs font-semibold text-rose-300">React Hooks</p>
                                <p className="text-[10px] text-rose-500 mt-1">11:00 AM - 12:00 PM</p>
                            </div>

                            <div className="absolute top-[360px] left-[71.42%] w-[13.5%] h-[160px] bg-emerald-400/20 border border-emerald-400/40 rounded-lg p-3 m-1 shadow-lg shadow-emerald-900/20 backdrop-blur-sm">
                                <p className="text-xs font-semibold text-emerald-300">Deep Work Session</p>
                                <p className="text-[10px] text-emerald-500 mt-1">01:00 PM - 03:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </MatteCard>
        </div>
    );
}
