"use client";

import { motion } from "framer-motion";
import { useDashboardStore } from "@/store/useDashboardStore";
import { MatteCard } from "@/components/ui/MatteCard";
import { Sword, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function QuestsPage() {
    const quests = useDashboardStore((s) => s.quests);
    const userStats = useDashboardStore((s) => s.userStats);
    const completeQuest = useDashboardStore((s) => s.completeQuest);
    const rerollQuests = useDashboardStore((s) => s.rerollQuests);
    const isGeneratingQuests = useDashboardStore((s) => s.isGeneratingQuests);
    const generateDailyQuests = useDashboardStore((s) => s.generateDailyQuests);

    const activeRoadmap = useDashboardStore((s) => s.roadmaps.find(r => r.id === s.activeRoadmapId));

    // Auto-generate quests if they are empty
    useEffect(() => {
        if (quests.length === 0 && !isGeneratingQuests) {
            generateDailyQuests(activeRoadmap?.title);
        }
    }, [quests.length, isGeneratingQuests, generateDailyQuests, activeRoadmap?.title]);

    const handleReroll = async () => {
        if (userStats.xp >= 50) {
            await rerollQuests(activeRoadmap?.title);
        }
    };

    const getRankStyles = (rank: 'S' | 'A' | 'B' | 'C') => {
        switch (rank) {
            case 'S':
                return {
                    border: "border-amber-500/50",
                    shadow: "shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_-5px_rgba(245,158,11,0.5)]",
                    bg: "bg-amber-500/[0.02] hover:bg-amber-500/[0.05]",
                    text: "text-amber-400",
                    neon: "text-amber-500",
                    glow: "drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                };
            case 'A':
                return {
                    border: "border-fuchsia-500/50",
                    shadow: "shadow-[0_0_25px_-5px_rgba(217,70,239,0.3)] hover:shadow-[0_0_35px_-5px_rgba(217,70,239,0.5)]",
                    bg: "bg-fuchsia-500/[0.02] hover:bg-fuchsia-500/[0.05]",
                    text: "text-fuchsia-400",
                    neon: "text-fuchsia-500",
                    glow: "drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]"
                };
            case 'B':
                return {
                    border: "border-cyan-500/50",
                    shadow: "shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)]",
                    bg: "bg-cyan-500/[0.02] hover:bg-cyan-500/[0.05]",
                    text: "text-cyan-400",
                    neon: "text-cyan-500",
                    glow: "drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                };
            case 'C':
            default:
                return {
                    border: "border-slate-500/40",
                    shadow: "shadow-[0_0_15px_-5px_rgba(100,116,139,0.2)] hover:shadow-[0_0_20px_-5px_rgba(100,116,139,0.3)]",
                    bg: "bg-slate-500/[0.02] hover:bg-slate-500/[0.05]",
                    text: "text-slate-400",
                    neon: "text-slate-500",
                    glow: "drop-shadow-[0_0_5px_rgba(100,116,139,0.5)]"
                };
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] text-white p-6 lg:p-10 safe-bottom">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header & Action Bar */}
                <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                                <Sword className="w-8 h-8 text-amber-500" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                                    Tavern Quest Board
                                </h1>
                                <p className="text-gray-400 text-sm mt-1">
                                    Complete bounties to earn XP. High-rank quests offer massive rewards.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hidden sm:flex">
                            <span className="text-sm font-medium text-gray-400">Your XP:</span>
                            <span className="text-sm font-bold text-amber-500 tabular-nums drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                                {userStats.xp}
                            </span>
                        </div>
                        <button
                            onClick={handleReroll}
                            disabled={isGeneratingQuests || userStats.xp < 50}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300
                                ${isGeneratingQuests
                                    ? 'bg-amber-500/20 text-amber-300/50 cursor-wait'
                                    : userStats.xp >= 50
                                        ? 'bg-amber-500 text-black hover:bg-amber-400 hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.6)]'
                                        : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                                }
                            `}
                        >
                            {isGeneratingQuests ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Rerolling...</>
                            ) : (
                                <>🎲 Reroll Bounties (-50 XP)</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Warning if insufficient XP */}
                {userStats.xp < 50 && !isGeneratingQuests && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 max-w-2xl"
                    >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm">You do not have enough XP to reroll the board. Complete bounties or flashcards to earn more XP.</p>
                    </motion.div>
                )}

                {/* Quest Board Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isGeneratingQuests ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <MatteCard key={i} className="h-48 border border-white/5 bg-white/[0.01] animate-pulse flex flex-col p-6">
                                <div className="h-6 w-24 bg-white/10 rounded mb-4" />
                                <div className="h-4 w-full bg-white/10 rounded mb-2" />
                                <div className="h-4 w-2/3 bg-white/10 rounded mb-auto" />
                                <div className="h-10 w-full bg-white/10 rounded mt-4" />
                            </MatteCard>
                        ))
                    ) : (
                        quests.map((quest, index) => {
                            const styles = getRankStyles(quest.rank);
                            const cardStyleClass = quest.isCompleted
                                ? 'border-emerald-500/30 bg-emerald-500/5 rotate-1 opacity-60'
                                : `${styles.border} ${styles.bg} ${styles.shadow}`;

                            const badgeStyleClass = quest.isCompleted
                                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                                : `bg-black/40 ${styles.border} ${styles.text}`;

                            return (
                                <motion.div
                                    key={quest.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                                    className={`relative flex flex-col h-full rounded-2xl border transition-all duration-300 overflow-hidden group ${cardStyleClass}`}
                                >
                                    {/* Stylized Rank Watermark */}
                                    <div className="absolute -top-6 -right-6 pointer-events-none select-none opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                                        <span className={`text-[120px] font-black italic ${styles.neon} ${!quest.isCompleted ? styles.glow : ''}`}>
                                            {quest.rank}
                                        </span>
                                    </div>

                                    <div className="p-6 flex flex-col h-full relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md uppercase tracking-wide ${badgeStyleClass}`}>
                                                Rank {quest.rank} Bounty
                                            </div>
                                        </div>

                                        <h3 className={`text-lg font-bold mb-6 flex-1 pr-8 leading-snug ${quest.isCompleted ? 'line-through decoration-emerald-500/50 text-gray-500' : 'text-gray-100'}`}>
                                            {quest.title}
                                        </h3>

                                        <div className="mt-auto space-y-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-400">Reward:</span>
                                                <span className={`text-lg font-black font-mono tracking-tight flex items-center gap-1.5 ${quest.isCompleted ? 'text-gray-500' : styles.text}`}>
                                                    💰 +{quest.xpReward} <span className="text-xs">XP</span>
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => completeQuest(quest.id)}
                                                disabled={quest.isCompleted}
                                                className={`
                                                    w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2
                                                    transition-all duration-300 border
                                                    ${quest.isCompleted
                                                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 cursor-default'
                                                        : 'bg-black/40 border-white/10 hover:bg-white/10 text-white hover:border-white/20'
                                                    }
                                                `}
                                            >
                                                {quest.isCompleted ? (
                                                    "Bounty Claimed ✅"
                                                ) : (
                                                    <>
                                                        Claim Bounty <Sparkles className="w-4 h-4 opacity-50" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
