"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Clock, Link as LinkIcon, Play, Trash2 } from "lucide-react";
import { MatteCard } from "@/components/ui/MatteCard";
import { useDashboardStore, PlannedSession } from "@/store/useDashboardStore";
import { useRouter } from "next/navigation";
import { format, differenceInMinutes } from "date-fns";

interface SessionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: PlannedSession | null;
}

export const SessionDetailModal = ({ isOpen, onClose, session }: SessionDetailModalProps) => {
    const deletePlannedSession = useDashboardStore((s) => s.deletePlannedSession);
    const setTargetMinutes = useDashboardStore((s) => s.setTargetMinutes);
    const setTimerCategory = useDashboardStore((s) => s.setTimerCategory);
    
    // We can also trigger the timer directly if we want, or just set context and route
    const router = useRouter();

    if (!isOpen || !session) return null;

    const handleDelete = () => {
        deletePlannedSession(session.id);
        onClose();
    };

    const handleStartFocus = () => {
        const durationMins = differenceInMinutes(new Date(session.endTime), new Date(session.startTime));
        
        // Contextualize timer
        setTargetMinutes(durationMins > 0 ? durationMins : 60);
        setTimerCategory(session.referenceType === 'custom' ? session.title : `${session.referenceType}: ${session.title}`);
        
        // Handoff to dashboard
        router.push("/dashboard");
    };

    const start = new Date(session.startTime);
    const end = new Date(session.endTime);

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
                    className="relative w-full max-w-sm z-10"
                >
                    <MatteCard className="p-0 overflow-hidden border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                        {/* Header Color Block */}
                        <div className="bg-cyan-500/10 border-b border-cyan-500/20 p-5 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-cyan-50">{session.title}</h2>
                                <p className="text-cyan-400/80 text-xs font-medium uppercase tracking-wider mt-1">{session.referenceType}</p>
                            </div>
                            <button onClick={onClose} className="p-1 -mr-2 -mt-2 text-zinc-400 hover:text-zinc-100 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 space-y-5">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-zinc-300 text-sm">
                                    <CalendarIcon className="w-4 h-4 text-zinc-500" />
                                    <span>{format(start, 'EEEE, MMMM do')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-300 text-sm">
                                    <Clock className="w-4 h-4 text-zinc-500" />
                                    <span>{format(start, 'h:mm a')} - {format(end, 'h:mm a')} ({differenceInMinutes(end, start)} min)</span>
                                </div>
                                {session.referenceId && (
                                    <div className="flex items-center gap-3 text-zinc-300 text-sm">
                                        <LinkIcon className="w-4 h-4 text-zinc-500" />
                                        <span className="truncate">Linked ID: {session.referenceId}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-2 flex flex-col gap-2">
                                <button 
                                    onClick={handleStartFocus}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                                >
                                    <Play className="w-4 h-4 fill-zinc-950" />
                                    Start Focus Session
                                </button>
                                
                                <button 
                                    onClick={handleDelete}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-rose-400 hover:bg-rose-400/10 rounded-xl transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Block
                                </button>
                            </div>
                        </div>
                    </MatteCard>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
