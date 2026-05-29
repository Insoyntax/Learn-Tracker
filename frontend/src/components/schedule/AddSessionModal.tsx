"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Clock, Link as LinkIcon } from "lucide-react";
import { MatteCard } from "@/components/ui/MatteCard";
import { useDashboardStore, PlannedSession } from "@/store/useDashboardStore";

interface AddSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialStartTime: string | null; // ISO string
}

export const AddSessionModal = ({ isOpen, onClose, initialStartTime }: AddSessionModalProps) => {
    const addPlannedSession = useDashboardStore((s) => s.addPlannedSession);
    const studioTasks = useDashboardStore((s) => s.studioTasks);
    const roadmaps = useDashboardStore((s) => s.roadmaps);

    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState(60); // minutes
    const [referenceType, setReferenceType] = useState<'custom' | 'roadmap' | 'studio'>('custom');
    const [referenceId, setReferenceId] = useState<string>("");

    if (!isOpen) return null;

    const handleSave = () => {
        if (!title || !initialStartTime) return;
        
        const start = new Date(initialStartTime);
        const end = new Date(start.getTime() + duration * 60000);

        const newSession: Omit<PlannedSession, "id"> = {
            title,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            referenceType,
            referenceId: referenceId || undefined,
        };

        addPlannedSession(newSession);
        
        // Reset and close
        setTitle("");
        setDuration(60);
        setReferenceType('custom');
        setReferenceId("");
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md z-10"
                >
                    <MatteCard className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-zinc-100">Add Study Session</h2>
                            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Session Title</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Deep Work: Data Structures"
                                    className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Start Time</label>
                                    <div className="flex items-center gap-2 bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-zinc-300">
                                        <Clock className="w-4 h-4 text-zinc-500" />
                                        <span>{initialStartTime ? new Date(initialStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Duration (mins)</label>
                                    <select 
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-cyan-500/50 transition-all"
                                    >
                                        <option value={30}>30 mins</option>
                                        <option value={60}>60 mins (1 hr)</option>
                                        <option value={90}>90 mins (1.5 hr)</option>
                                        <option value={120}>120 mins (2 hr)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Link Context</label>
                                <div className="flex gap-2 mb-2">
                                    {['custom', 'roadmap', 'studio'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setReferenceType(type as any)}
                                            className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors capitalize ${
                                                referenceType === type 
                                                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                                                    : 'bg-[#121212] border-white/10 text-zinc-400 hover:text-zinc-200'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                
                                {referenceType === 'roadmap' && (
                                    <select 
                                        value={referenceId}
                                        onChange={(e) => setReferenceId(e.target.value)}
                                        className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-cyan-500/50 transition-all"
                                    >
                                        <option value="">Select Roadmap...</option>
                                        {roadmaps.map(r => (
                                            <option key={r.id} value={r.id.toString()}>{r.title}</option>
                                        ))}
                                    </select>
                                )}

                                {referenceType === 'studio' && (
                                    <select 
                                        value={referenceId}
                                        onChange={(e) => setReferenceId(e.target.value)}
                                        className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-cyan-500/50 transition-all"
                                    >
                                        <option value="">Select Studio Task...</option>
                                        {studioTasks.map(t => (
                                            <option key={t.id} value={t.id}>{t.title}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button 
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={!title}
                                className="px-5 py-2.5 text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Schedule Session
                            </button>
                        </div>
                    </MatteCard>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
