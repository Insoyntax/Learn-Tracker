"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/store/useDashboardStore";
import { X, Play, Map, Clock, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SkillDetailsModalProps {
    skill: {
        name: string;
        totalXp: number;
        level: number;
        currentXp: number;
        nextLevelXp: number;
        progress: number;
    };
    onClose: () => void;
}

export const SkillDetailsModal = ({ skill, onClose }: SkillDetailsModalProps) => {
    const router = useRouter();
    const setTimerCategory = useDashboardStore(s => s.setTimerCategory);
    const roadmaps = useDashboardStore(s => s.roadmaps);
    const studyLogs = useDashboardStore(s => s.studyLogs);

    // Sync Data 1: Roadmaps
    const relatedRoadmaps = roadmaps.filter(r => r.category === skill.name);

    // Sync Data 2: Study Logs
    const relatedLogs = studyLogs.filter(l => l.category === skill.name);
    const totalMinutes = relatedLogs.reduce((acc, log) => acc + log.durationMinutes, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const recentLogs = [...relatedLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

    const handleGrind = () => {
        setTimerCategory(skill.name);
        router.push('/');
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-md h-full bg-[#0f1117] border-l border-white/10 shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-50" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10 text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative z-10 flex flex-col gap-2 mt-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 text-white text-xs font-bold rounded shadow-sm self-start">
                            Level {skill.level}
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">{skill.name}</h2>
                        <div className="text-sm text-primary font-medium flex items-center gap-1.5 mt-1">
                            <Zap className="w-4 h-4" />
                            {skill.currentXp.toLocaleString()} / {skill.nextLevelXp.toLocaleString()} XP to Next
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                    {/* Roadmaps Section */}
                    <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                            <Map className="w-4 h-4" /> ACTIVE ROADMAPS
                        </h3>
                        {relatedRoadmaps.length > 0 ? (
                            <div className="space-y-3">
                                {relatedRoadmaps.map(r => (
                                    <div key={r.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                        <span className="text-sm font-medium text-white">{r.title}</span>
                                        <span className="text-xs text-gray-400">{r.progress}%</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                                <p className="text-sm text-gray-400 mb-2">No active roadmaps found.</p>
                                <Link href="/roadmaps" className="text-xs text-primary font-medium hover:underline">
                                    Create one for this skill
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Study Logs Section */}
                    <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> RECENT ACTIVITY
                        </h3>
                        <div className="mb-4 inline-flex px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                            {totalHours} Total Hours Invested
                        </div>

                        {recentLogs.length > 0 ? (
                            <div className="space-y-3">
                                {recentLogs.map(log => (
                                    <div key={log.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs text-gray-500">{new Date(log.date).toLocaleDateString()}</span>
                                            <span className="text-xs font-medium text-emerald-400">+{log.durationMinutes}m</span>
                                        </div>
                                        {log.notes && <p className="text-sm text-gray-300 truncate">{log.notes}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">No recent study logs.</p>
                        )}
                    </section>

                </div>

                {/* Footer CTA */}
                <div className="p-6 border-t border-white/5 bg-black/20">
                    <button
                        onClick={handleGrind}
                        className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_var(--primary-glow)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Start Grinding This Skill
                    </button>
                    <p className="text-[10px] text-center text-gray-500 mt-3">This sets your timer focus and redirects to dashboard.</p>
                </div>
            </motion.div>
        </div>
    );
};
