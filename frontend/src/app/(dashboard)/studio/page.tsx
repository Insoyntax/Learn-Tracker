"use client";

import { MatteCard } from "@/components/ui/MatteCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Search, Plus, MoreHorizontal, MessageSquare, Paperclip } from "lucide-react";

export default function StudioPage() {
    return (
        <div className="h-full flex flex-col space-y-6 max-w-[1600px] mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Homework Studio</h1>
                    <p className="text-zinc-400 mt-1">Manage your tasks and assignments.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400" />
                        <input 
                            type="text"
                            placeholder="Filter tasks..."
                            className="w-full sm:w-64 bg-[#1C1C1E] border border-white/5 rounded-lg py-2 pl-9 pr-4 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500/50"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium rounded-lg transition-colors text-sm">
                        <Plus className="w-4 h-4" />
                        New Task
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar pb-4">
                <div className="flex gap-6 h-full min-w-[1000px]">
                    
                    {/* To Do Column */}
                    <div className="flex-1 flex flex-col min-w-[280px]">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-zinc-500" />
                                To Do
                            </h3>
                            <span className="text-xs text-zinc-500 font-medium bg-white/5 px-2 py-0.5 rounded-full">3</span>
                        </div>
                        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                            <TaskCard 
                                title="Read Chapter 4: Neural Networks" 
                                course="Deep Learning 101"
                                priority="High" 
                                color="rose"
                            />
                            <TaskCard 
                                title="Set up Next.js Boilerplate" 
                                course="Fullstack Dev"
                                priority="Medium" 
                                color="amber"
                            />
                            <TaskCard 
                                title="Write Essay Outline" 
                                course="English Lit"
                                priority="Low" 
                                color="cyan"
                            />
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="flex-1 flex flex-col min-w-[280px]">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                In Progress
                            </h3>
                            <span className="text-xs text-zinc-500 font-medium bg-white/5 px-2 py-0.5 rounded-full">1</span>
                        </div>
                        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                            <TaskCard 
                                title="Implement JWT Authentication" 
                                course="Backend Architecture"
                                priority="High" 
                                color="rose"
                                active
                            />
                        </div>
                    </div>

                    {/* Approval Column */}
                    <div className="flex-1 flex flex-col min-w-[280px]">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                Under Review
                            </h3>
                            <span className="text-xs text-zinc-500 font-medium bg-white/5 px-2 py-0.5 rounded-full">1</span>
                        </div>
                        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                            <TaskCard 
                                title="Submit Draft for Peer Review" 
                                course="English Lit"
                                priority="Medium" 
                                color="amber"
                            />
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div className="flex-1 flex flex-col min-w-[280px]">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                Completed
                            </h3>
                            <span className="text-xs text-zinc-500 font-medium bg-white/5 px-2 py-0.5 rounded-full">2</span>
                        </div>
                        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
                            <TaskCard 
                                title="Watch Lecture 1 & 2" 
                                course="Deep Learning 101"
                                priority="Medium" 
                                color="amber"
                                completed
                            />
                            <TaskCard 
                                title="Design Database Schema" 
                                course="Backend Architecture"
                                priority="High" 
                                color="rose"
                                completed
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function TaskCard({ title, course, priority, color, active, completed }: any) {
    return (
        <MatteCard className={`p-4 cursor-pointer group transition-all hover:-translate-y-1 ${active ? 'border-cyan-500/50 shadow-cyan-900/20' : ''} ${completed ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between mb-3">
                <StatusBadge color={color as any}>{priority}</StatusBadge>
                <button className="text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>
            <h4 className={`text-sm font-medium mb-1 ${completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                {title}
            </h4>
            <p className="text-xs text-zinc-500 mb-4">{course}</p>
            
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-zinc-500">
                        <MessageSquare className="w-3 h-3" />
                        <span className="text-[10px]">2</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-500">
                        <Paperclip className="w-3 h-3" />
                        <span className="text-[10px]">1</span>
                    </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-medium">
                    US
                </div>
            </div>
        </MatteCard>
    );
}
