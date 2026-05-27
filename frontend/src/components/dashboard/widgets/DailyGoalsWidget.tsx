"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle2, Circle, Sword, ArrowRight } from "lucide-react";
import { useDashboardStore, Quest } from "@/store/useDashboardStore";
import Link from "next/link";

export const DailyGoalsWidget = ({ className }: { className?: string }) => {
    const quests = useDashboardStore((s) => s.quests);
    const completeQuest = useDashboardStore((s) => s.completeQuest);

    // 1. Filter out completed quests
    const activeQuests = quests.filter((q) => !q.isCompleted);

    // 2. Sort by Rank Priority (S > A > B > C)
    const rankPriority: Record<Quest['rank'], number> = {
        'S': 4,
        'A': 3,
        'B': 2,
        'C': 1
    };

    const sortedActiveQuests = [...activeQuests].sort((a, b) => {
        return rankPriority[b.rank] - rankPriority[a.rank];
    });

    // 3. Take Top 2
    const displayQuests = sortedActiveQuests.slice(0, 2);

    const getCompactRankStyles = (rank: Quest['rank']) => {
        switch (rank) {
            case 'S':
                return {
                    border: "border-amber-500/30",
                    bg: "bg-amber-500/[0.05] hover:bg-amber-500/[0.1]",
                    text: "text-amber-400",
                    neon: "text-amber-500",
                    glow: "shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]"
                };
            case 'A':
                return {
                    border: "border-fuchsia-500/30",
                    bg: "bg-fuchsia-500/[0.05] hover:bg-fuchsia-500/[0.1]",
                    text: "text-fuchsia-400",
                    neon: "text-fuchsia-500",
                    glow: "shadow-[0_0_15px_-3px_rgba(217,70,239,0.2)]"
                };
            case 'B':
                return {
                    border: "border-cyan-500/30",
                    bg: "bg-cyan-500/[0.05] hover:bg-cyan-500/[0.1]",
                    text: "text-cyan-400",
                    neon: "text-cyan-500",
                    glow: "shadow-[0_0_15px_-3px_rgba(6,182,212,0.2)]"
                };
            case 'C':
            default:
                return {
                    border: "border-slate-500/30",
                    bg: "bg-slate-500/[0.05] hover:bg-slate-500/[0.1]",
                    text: "text-slate-400",
                    neon: "text-slate-500",
                    glow: "shadow-[0_0_15px_-3px_rgba(100,116,139,0.2)]"
                };
        }
    };

    return (
        <GlassCard className={`flex flex-col ${className}`}>
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <Sword className="w-4 h-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                </div>
                <h3 className="font-bold tracking-wide text-amber-50 drop-shadow-md">ACTIVE BOUNTIES</h3>
                {activeQuests.length > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-400">
                        {activeQuests.length}
                    </span>
                )}
            </div>

            {/* List Body */}
            <div className="flex-1 p-5 flex flex-col gap-3 overflow-hidden">
                {displayQuests.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                        <Sword className="w-8 h-8 mb-3 text-slate-500" />
                        <p className="text-sm font-medium text-slate-300">No active bounties.</p>
                        <Link href="/quests" className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all">
                            Visit Quest Board
                        </Link>
                    </div>
                ) : (
                    displayQuests.map((quest) => {
                        const styles = getCompactRankStyles(quest.rank);
                        return (
                            <motion.button
                                key={quest.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                onClick={() => completeQuest(quest.id)}
                                className={`
                                    w-full text-left p-4 rounded-xl border backdrop-blur-md transition-all duration-300 group relative overflow-hidden flex items-center gap-4
                                    ${styles.border} ${styles.bg} ${styles.glow}
                                `}
                            >
                                {/* Rank Letter Watermark */}
                                <div className="absolute -right-2 -bottom-4 pointer-events-none select-none opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className={`text-[60px] font-black italic ${styles.neon}`}>
                                        {quest.rank}
                                    </span>
                                </div>

                                <motion.div whileTap={{ scale: 0.8 }} className="relative z-10 shrink-0">
                                    <Circle className={`w-5 h-5 ${styles.text} group-hover:hidden`} />
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 hidden group-hover:block" />
                                </motion.div>

                                <div className="flex-1 min-w-0 relative z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black tracking-wider border ${styles.border} ${styles.text} bg-black/40`}>
                                            RANK {quest.rank}
                                        </span>
                                        <span className="text-xs font-bold font-mono text-emerald-400">+{quest.xpReward} XP</span>
                                    </div>
                                    <p className="text-sm font-medium text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                                        {quest.title}
                                    </p>
                                </div>
                            </motion.button>
                        );
                    })
                )}
            </div>

            {/* Footer Nav */}
            <div className="mt-auto border-t border-white/5 p-3 flex justify-center bg-black/20">
                <Link href="/quests" className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors group">
                    View All Bounties <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </GlassCard>
    );
};
