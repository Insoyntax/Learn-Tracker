"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MatteCard } from "@/components/ui/MatteCard";
import { useDashboardStore, Quest } from "@/store/useDashboardStore";
import { GlowingNode } from "@/components/ui/GlowingNode";
import { Check, Sword, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const RANK_CONFIG: Record<Quest["rank"], {
    timelineColor: string;
    nodeGlow: string;
    glowHex: string;
    badge: string;
}> = {
    S: {
        timelineColor: "rgba(251, 191, 36, 0.6)",
        nodeGlow: "0 0 20px rgba(251,191,36,0.4), 0 0 8px rgba(251,191,36,0.3)",
        glowHex: "rgba(251,191,36,0.2)",
        badge: "Rank S",
    },
    A: {
        timelineColor: "rgba(167, 139, 250, 0.6)",
        nodeGlow: "0 0 20px rgba(167,139,250,0.4), 0 0 8px rgba(167,139,250,0.3)",
        glowHex: "rgba(167,139,250,0.15)",
        badge: "Rank A",
    },
    B: {
        timelineColor: "rgba(56, 189, 248, 0.6)",
        nodeGlow: "0 0 20px rgba(56,189,248,0.35), 0 0 8px rgba(56,189,248,0.25)",
        glowHex: "rgba(56,189,248,0.12)",
        badge: "Rank B",
    },
    C: {
        timelineColor: "rgba(100, 116, 139, 0.5)",
        nodeGlow: "0 0 12px rgba(100,116,139,0.3)",
        glowHex: "rgba(100,116,139,0.08)",
        badge: "Rank C",
    },
};

export const DailyGoalsWidget = ({ className }: { className?: string }) => {
    const quests = useDashboardStore((s) => s.quests);
    const completeQuest = useDashboardStore((s) => s.completeQuest);

    const activeQuests = quests
        .filter((q) => !q.isCompleted)
        .sort((a, b) => ({ S: 4, A: 3, B: 2, C: 1 }[b.rank] - { S: 4, A: 3, B: 2, C: 1 }[a.rank]))
        .slice(0, 4);

    return (
        <MatteCard className={`flex flex-col p-0 ${className}`}>

            {/* ── Header ── */}
            <div className="px-6 pt-6 pb-4 border-b border-white/[0.05]">
                <div className="flex items-center gap-3">
                    <div
                        className="p-2 rounded-xl"
                        style={{
                            background: "rgba(251,191,36,0.1)",
                            border: "1px solid rgba(251,191,36,0.2)",
                            boxShadow: "0 0 12px rgba(251,191,36,0.1)",
                        }}
                    >
                        <Sword className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-white/90 font-semibold text-sm tracking-tight">Active Bounties</h3>
                        <p className="text-white/30 text-[10px]">{activeQuests.length} missions awaiting</p>
                    </div>
                    {activeQuests.length > 0 && (
                        <div
                            className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-amber-400"
                            style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
                        >
                            <Sparkles className="w-2.5 h-2.5" />
                            {quests.filter(q => q.isCompleted).length} done
                        </div>
                    )}
                </div>
            </div>

            {/* ── Timeline Body ── */}
            <div className="flex-1 px-6 py-4 overflow-hidden">
                {activeQuests.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-8">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            <Check className="w-5 h-5 text-emerald-400" />
                        </div>
                        <p className="text-white/40 text-sm font-medium mb-1">All clear!</p>
                        <p className="text-white/20 text-xs">No active quests.</p>
                        <Link
                            href="/quests"
                            className="mt-4 px-4 py-2 rounded-xl text-xs text-sky-400 font-medium transition-all hover:bg-sky-400/10"
                            style={{ border: "1px solid rgba(56,189,248,0.2)" }}
                        >
                            Quest Board →
                        </Link>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Vertical glowing timeline line */}
                        <div
                            className="absolute left-[15px] top-3 bottom-3 w-px"
                            style={{
                                background: "linear-gradient(to bottom, rgba(56,189,248,0.4), rgba(167,139,250,0.3), transparent)",
                                boxShadow: "0 0 6px rgba(56,189,248,0.2)",
                            }}
                        />

                        <AnimatePresence mode="popLayout">
                            {activeQuests.map((quest, i) => {
                                const cfg = RANK_CONFIG[quest.rank];
                                return (
                                    <motion.button
                                        key={quest.id}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                        transition={{ delay: i * 0.05, duration: 0.3 }}
                                        onClick={() => completeQuest(quest.id)}
                                        className="relative w-full text-left flex items-start gap-4 mb-4 last:mb-0 group"
                                    >
                                        {/* Timeline Node */}
                                        <div
                                            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 group-hover:scale-110"
                                            style={{
                                                background: `rgba(${quest.rank === 'S' ? '251,191,36' : quest.rank === 'A' ? '167,139,250' : quest.rank === 'B' ? '56,189,248' : '100,116,139'}, 0.15)`,
                                                border: `1px solid ${cfg.timelineColor}`,
                                                boxShadow: cfg.nodeGlow,
                                            }}
                                        >
                                            <span className="text-[10px] font-bold" style={{ color: cfg.timelineColor }}>
                                                {quest.rank}
                                            </span>
                                        </div>

                                        {/* Quest Card */}
                                        <div
                                            className="flex-1 min-w-0 p-3 rounded-2xl transition-all duration-300 group-hover:scale-[1.01]"
                                            style={{
                                                background: `rgba(255,255,255,0.02)`,
                                                border: "1px solid rgba(255,255,255,0.05)",
                                            }}
                                        >
                                            <div className="flex items-start gap-2 mb-1">
                                                <GlowingNode status="active" label={`Rank ${quest.rank}`} />
                                                <span className="ml-auto text-[10px] font-medium" style={{ color: cfg.timelineColor }}>
                                                    +{quest.xpReward} XP
                                                </span>
                                            </div>
                                            <p className="text-white/75 text-xs font-medium line-clamp-2 group-hover:text-white transition-colors">
                                                {quest.title}
                                            </p>
                                            {/* Hover complete hint */}
                                            <p className="text-white/20 text-[9px] mt-1 group-hover:text-emerald-400/60 transition-colors">
                                                Click to complete →
                                            </p>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* ── Footer ── */}
            <div className="px-6 pb-5 border-t border-white/[0.05] pt-3">
                <Link
                    href="/quests"
                    className="flex items-center justify-center gap-2 text-xs text-white/30 hover:text-sky-400 transition-colors group"
                >
                    View All Quests
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </MatteCard>
    );
};
