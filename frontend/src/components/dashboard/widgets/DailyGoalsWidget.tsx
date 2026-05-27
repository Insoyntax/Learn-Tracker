"use client";

import { motion } from "framer-motion";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { CheckSquare, Square, Sword, ArrowRight } from "lucide-react";
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
                    border: "border-accent",
                    bg: "bg-accent/10 hover:bg-accent",
                    text: "text-accent group-hover:text-black",
                    neon: "text-accent",
                    shadow: "hover:shadow-[2px_2px_0px_0px_var(--color-accent)]"
                };
            case 'A':
                return {
                    border: "border-fuchsia-500",
                    bg: "bg-fuchsia-500/10 hover:bg-fuchsia-500",
                    text: "text-fuchsia-500 group-hover:text-black",
                    neon: "text-fuchsia-500",
                    shadow: "hover:shadow-[2px_2px_0px_0px_var(--color-fuchsia-500)]"
                };
            case 'B':
                return {
                    border: "border-cyan-500",
                    bg: "bg-cyan-500/10 hover:bg-cyan-500",
                    text: "text-cyan-500 group-hover:text-black",
                    neon: "text-cyan-500",
                    shadow: "hover:shadow-[2px_2px_0px_0px_var(--color-cyan-500)]"
                };
            case 'C':
            default:
                return {
                    border: "border-white/20",
                    bg: "bg-transparent hover:bg-white/10",
                    text: "text-slate-300 group-hover:text-white",
                    neon: "text-slate-500",
                    shadow: "hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                };
        }
    };

    return (
        <BrutalCard className={`flex flex-col p-0 ${className}`}>
            {/* Header */}
            <div className="p-6 border-b-2 border-white/20 flex items-center gap-3">
                <div className="p-2 border-2 border-accent bg-transparent shadow-[2px_2px_0px_0px_var(--color-accent)]">
                    <Sword className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-Outfit font-bold text-xl tracking-tighter text-white uppercase">Active Bounties</h3>
                {activeQuests.length > 0 && (
                    <span className="ml-auto flex h-6 w-6 items-center justify-center border-2 border-accent text-xs font-Outfit font-bold text-accent shadow-[2px_2px_0px_0px_var(--color-accent)]">
                        {activeQuests.length}
                    </span>
                )}
            </div>

            {/* List Body */}
            <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
                {displayQuests.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <Sword className="w-10 h-10 mb-3 text-slate-500" />
                        <p className="text-sm font-Inter font-bold text-slate-400">No active bounties.</p>
                        <Link href="/quests" className="mt-4 px-6 py-3 bg-transparent border-2 border-primary text-primary font-Outfit font-bold uppercase transition-all shadow-[4px_4px_0px_0px_var(--color-primary)] hover:shadow-[2px_2px_0px_0px_var(--color-primary)] hover:translate-y-0.5 hover:translate-x-0.5">
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
                                    w-full text-left p-4 border-2 transition-all duration-300 group relative overflow-hidden flex items-center gap-4 hover:-translate-y-0.5
                                    ${styles.border} ${styles.bg} ${styles.shadow}
                                `}
                            >
                                {/* Rank Letter Watermark */}
                                <div className="absolute right-0 -bottom-4 pointer-events-none select-none opacity-20 group-hover:opacity-10 transition-opacity mix-blend-overlay">
                                    <span className={`text-[60px] font-Outfit font-black italic ${styles.neon}`}>
                                        {quest.rank}
                                    </span>
                                </div>

                                <motion.div whileTap={{ scale: 0.8 }} className="relative z-10 shrink-0">
                                    <Square className={`w-6 h-6 ${styles.text} group-hover:hidden`} />
                                    <CheckSquare className={`w-6 h-6 hidden group-hover:block ${styles.text}`} />
                                </motion.div>

                                <div className="flex-1 min-w-0 relative z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 text-[10px] font-Outfit font-black tracking-wider border-2 ${styles.border} ${styles.text} bg-transparent`}>
                                            RANK {quest.rank}
                                        </span>
                                        <span className={`text-xs font-Outfit font-bold ${styles.text}`}>+{quest.xpReward} XP</span>
                                    </div>
                                    <p className={`text-sm font-Inter font-bold line-clamp-1 transition-colors ${styles.text}`}>
                                        {quest.title}
                                    </p>
                                </div>
                            </motion.button>
                        );
                    })
                )}
            </div>

            {/* Footer Nav */}
            <div className="mt-auto border-t-2 border-white/20 p-4 flex justify-center bg-white/5">
                <Link href="/quests" className="text-xs font-Outfit font-bold uppercase text-slate-300 hover:text-primary flex items-center gap-2 transition-colors group">
                    View All Bounties <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </BrutalCard>
    );
};
