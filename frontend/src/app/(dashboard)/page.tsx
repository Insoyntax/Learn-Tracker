"use client";

import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { useDashboardStore } from "@/store/useDashboardStore";
import { motion } from "framer-motion";

export default function Home() {
    const streak = useDashboardStore((s) => s.userStats.streak);
    const level = useDashboardStore((s) => s.userStats.level);
    const userName = useDashboardStore((s) => s.settings.userName);

    return (
        <>
            {/* ── Page Header ── */}
            <header className="mb-10">
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Eyebrow */}
                    <p className="text-white/30 text-xs tracking-widest uppercase mb-3 font-medium">
                        Welcome back, {userName}
                    </p>

                    {/* Title */}
                    <h1 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-none shimmer-text mb-5">
                        Learning Space
                    </h1>

                    {/* Stats pills */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <StatPill
                            label="Day Streak"
                            value={streak}
                            color="rgba(251, 146, 60, 0.15)"
                            border="rgba(251, 146, 60, 0.25)"
                            textColor="text-orange-400"
                            glow="rgba(251, 146, 60, 0.2)"
                        />
                        <StatPill
                            label="Level"
                            value={level}
                            color="rgba(56, 189, 248, 0.1)"
                            border="rgba(56, 189, 248, 0.2)"
                            textColor="text-sky-400"
                            glow="rgba(56, 189, 248, 0.15)"
                        />
                        {/* Divider dot */}
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <p className="text-white/25 text-xs">
                            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                        </p>
                    </div>
                </motion.div>
            </header>

            {/* ── Dashboard Grid ── */}
            <DashboardGrid />
        </>
    );
}

function StatPill({
    label, value, color, border, textColor, glow
}: {
    label: string;
    value: number;
    color: string;
    border: string;
    textColor: string;
    glow: string;
}) {
    return (
        <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs"
            style={{
                background: color,
                border: `1px solid ${border}`,
                boxShadow: `0 0 12px ${glow}`,
            }}
        >
            <span className={`font-semibold tabular-nums ${textColor}`}>{value}</span>
            <span className="text-white/40">{label}</span>
        </div>
    );
}
