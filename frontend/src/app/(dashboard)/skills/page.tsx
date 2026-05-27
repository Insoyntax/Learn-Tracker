"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore, getCategoryLevelInfo } from "@/store/useDashboardStore";
import { SkillDetailsModal } from "./SkillDetailsModal";
import { GlassCard } from "@/components/ui/GlassCard";
import { Zap, Trophy, Target, Award, Star } from "lucide-react";

// Helper to determine the glow intensity based on level
const getGlowIntensity = (level: number) => {
    if (level <= 2) return "shadow-[0_0_10px_var(--primary-glow)]";
    if (level <= 5) return "shadow-[0_0_20px_var(--primary-glow)]";
    if (level <= 10) return "shadow-[0_0_30px_var(--primary-glow)] border-primary/40";
    return "shadow-[0_0_40px_var(--primary-glow)] border-primary/60 scale-105";
};

// SVG Circular Progress
const CircularProgress = ({ progress, size = 64, strokeWidth = 4, colorClass = "text-primary" }: { progress: number, size?: number, strokeWidth?: number, colorClass?: string }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                {/* Background circle */}
                <circle
                    className="text-white/5"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress circle */}
                <motion.circle
                    className={colorClass}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute flex items-center justify-center text-xs font-bold text-white">
                {Math.round(progress)}%
            </div>
        </div>
    );
};

export default function SkillsPage() {
    const userStats = useDashboardStore(s => s.userStats);
    const { xp, level, maxXp, xpByCategory } = userStats;
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Filter categories that actually have XP
    const activeSkills = Object.entries(xpByCategory)
        .filter(([_, xp]) => xp > 0)
        .map(([name, xp]) => ({
            name,
            totalXp: xp,
            ...getCategoryLevelInfo(xp)
        }))
        .sort((a, b) => b.totalXp - a.totalXp); // Sort by highest XP first

    const totalProgress = Math.min((xp / maxXp) * 100, 100);
    const selectedSkill = selectedCategory ? activeSkills.find(s => s.name === selectedCategory) : null;

    return (
        <div className="space-y-12">

            {/* Header */}
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
                    <Target className="w-8 h-8 text-primary" />
                    Skill Tree
                </h1>
                <p className="text-gray-400">Track your progression and mastery across different domains.</p>
            </header>

            {/* Core Node (Overall Stats) */}
            <div className="flex justify-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="relative group cursor-default"
                >
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                    <GlassCard className="relative z-10 p-8 flex flex-col items-center justify-center text-center gap-4 w-64 h-64 border-primary/30 shadow-[0_0_50px_var(--primary-glow)] overflow-hidden">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

                        <div className="p-3 bg-primary/20 rounded-2xl text-primary">
                            <Trophy size={32} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Core Level</p>
                            <h2 className="text-5xl font-black text-white">{level}</h2>
                        </div>

                        <div className="w-full mt-2">
                            <div className="flex justify-between text-[10px] text-gray-400 font-medium mb-1.5 px-1">
                                <span>TOTAL XP</span>
                                <span>{xp} / {maxXp}</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${totalProgress}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                />
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 opacity-50">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <Star className="w-4 h-4 text-primary" />
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>

            {/* Branches (Skills Grid) */}
            {activeSkills.length === 0 ? (
                // Empty State
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="w-24 h-24 mb-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                        <Zap size={40} className="opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Your tree is empty</h3>
                    <p className="text-gray-400 max-w-sm">
                        Complete your first task, finish a focus session, or check off a roadmap step to unlock your skill tree!
                    </p>
                </motion.div>
            ) : (
                // Skills Grid
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                    {activeSkills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedCategory(skill.name)}
                            className="cursor-pointer"
                        >
                            <GlassCard
                                className={`p-6 flex flex-col items-center justify-center text-center gap-4 hover:-translate-y-1 transition-all duration-300 ${getGlowIntensity(skill.level)}`}
                            >
                                {/* Level Badge */}
                                <div className="absolute top-4 right-4 px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-bold text-gray-300">
                                    LVL {skill.level}
                                </div>

                                {/* Circular Progress */}
                                <div className="relative mt-2">
                                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                                    <CircularProgress progress={skill.progress} size={80} strokeWidth={6} colorClass="text-primary" />
                                </div>

                                {/* Details */}
                                <div className="w-full mt-2">
                                    <h3 className="text-lg font-bold text-white mb-1 truncate px-2" title={skill.name}>
                                        {skill.name}
                                    </h3>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                        <Award size={12} />
                                        <span>{skill.totalXp.toLocaleString()} Total XP</span>
                                    </div>
                                    <div className="mt-4 text-xs text-gray-500 font-medium">
                                        {Math.round(skill.nextLevelXp - skill.currentXp)} XP to next level
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {selectedSkill && (
                    <SkillDetailsModal
                        skill={selectedSkill}
                        onClose={() => setSelectedCategory(null)}
                    />
                )}
            </AnimatePresence>

        </div>
    );
}
