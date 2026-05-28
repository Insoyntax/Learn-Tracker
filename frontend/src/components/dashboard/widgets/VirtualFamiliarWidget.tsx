"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Heart, Sparkles, Zap } from "lucide-react";
import { MatteCard } from "@/components/ui/MatteCard";

const QUOTES = [
    "You're doing great!",
    "Keep that streak alive!",
    "Focus is a superpower.",
    "Small steps, big leaps.",
    "Level up, one day at a time.",
    "The grind is sacred.",
    "Your future self thanks you.",
];

// ── AmbientOrb Component ────────────────────────────────────────────────────
interface AmbientOrbProps {
    hpPercent: number;
    isClicked: boolean;
    onInteract: () => void;
}

const AmbientOrb = ({ hpPercent, isClicked, onInteract }: AmbientOrbProps) => {
    // Determine orb state
    const isHealthy = hpPercent > 50;
    const isDanger = hpPercent <= 20;

    const orbColor = isHealthy
        ? { primary: "#34d399", secondary: "#38bdf8", glow: "rgba(52, 211, 153, 0.5)" }
        : isDanger
            ? { primary: "#f87171", secondary: "#fb923c", glow: "rgba(248, 113, 113, 0.5)" }
            : { primary: "#fb923c", secondary: "#fbbf24", glow: "rgba(251, 146, 60, 0.4)" };

    const orbScale = isHealthy ? [1, 1.08, 1] : isDanger ? [0.9, 0.95, 0.9] : [1, 1.04, 1];
    const breatheDuration = isDanger ? 1.5 : 4;

    return (
        <motion.button
            onClick={onInteract}
            className="relative flex items-center justify-center cursor-pointer focus:outline-none"
            style={{ width: 110, height: 110 }}
            whileTap={{ scale: 0.92 }}
        >
            {/* Outer ambient halo */}
            <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.18, 1], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: breatheDuration * 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    background: `radial-gradient(circle, ${orbColor.glow} 0%, transparent 70%)`,
                    filter: "blur(12px)",
                }}
            />

            {/* Middle ring glow */}
            <motion.div
                className="absolute rounded-full"
                style={{ inset: 12 }}
                animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: breatheDuration, repeat: Infinity, ease: "easeInOut" }}
            >
                <div
                    className="w-full h-full rounded-full"
                    style={{
                        background: `radial-gradient(circle at 40% 35%, ${orbColor.primary}, ${orbColor.secondary})`,
                        filter: `blur(16px)`,
                    }}
                />
            </motion.div>

            {/* Core orb sphere */}
            <motion.div
                className="relative z-10 rounded-full"
                style={{ width: 64, height: 64 }}
                animate={{ scale: orbScale, y: [-3, 3, -3] }}
                transition={{
                    scale: { duration: breatheDuration, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: breatheDuration * 0.8, repeat: Infinity, ease: "easeInOut" },
                }}
            >
                <div
                    className="w-full h-full rounded-full"
                    style={{
                        background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.4), ${orbColor.primary} 40%, ${orbColor.secondary} 80%)`,
                        boxShadow: `
                            0 0 0 1px rgba(255,255,255,0.15),
                            0 0 20px ${orbColor.glow},
                            0 0 60px ${isDanger ? "rgba(248,113,113,0.2)" : "rgba(52,211,153,0.15)"},
                            inset 0 2px 4px rgba(255,255,255,0.3)
                        `,
                    }}
                />
                {/* Specular highlight */}
                <div
                    className="absolute top-2.5 left-3 w-4 h-2.5 rounded-full opacity-60"
                    style={{ background: "rgba(255,255,255,0.7)", filter: "blur(4px)" }}
                />
            </motion.div>

            {/* Danger pulse ring */}
            {isDanger && (
                <motion.div
                    className="absolute inset-0 rounded-full border"
                    style={{ borderColor: "rgba(248,113,113,0.4)" }}
                    animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                />
            )}
        </motion.button>
    );
};

// ── Widget ──────────────────────────────────────────────────────────────────
export const VirtualFamiliarWidget = ({ className }: { className?: string }) => {
    const familiar = useDashboardStore((s) => s.userStats?.familiar);
    const { currentHp, maxHp, level, lastFedAt } = familiar ?? {
        currentHp: 100, maxHp: 100, level: 1, lastFedAt: new Date().toISOString()
    };

    const [localHp, setLocalHp] = useState(currentHp);
    const [isTalking, setIsTalking] = useState(false);
    const [quote, setQuote] = useState(QUOTES[0]);
    const [isClicked, setIsClicked] = useState(false);

    // Drain HP over time (1 HP/hour)
    useEffect(() => {
        const drain = () => {
            const elapsed = (Date.now() - new Date(lastFedAt).getTime()) / 3_600_000;
            setLocalHp(Math.max(0, currentHp - Math.floor(elapsed)));
        };
        drain();
        const t = setInterval(drain, 60_000);
        return () => clearInterval(t);
    }, [currentHp, lastFedAt]);

    const hpPercent = Math.min((localHp / Math.max(maxHp, 1)) * 100, 100);

    const isHealthy = hpPercent > 50;
    const isDanger = hpPercent <= 20;

    const hpBarColor = isHealthy
        ? "linear-gradient(90deg, #34d399, #38bdf8)"
        : isDanger
            ? "linear-gradient(90deg, #f87171, #fb923c)"
            : "linear-gradient(90deg, #fb923c, #fbbf24)";

    const handleInteract = () => {
        if (isTalking) return;
        setIsClicked(true);
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        setIsTalking(true);
        setTimeout(() => { setIsTalking(false); setIsClicked(false); }, 2800);
    };

    return (
        <MatteCard
            className={`h-full flex flex-col items-center justify-between p-6 relative ${className}`}
        >
            {/* Level badge */}
            <div className="w-full flex items-center justify-between mb-2">
                <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium text-violet-400"
                    style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}
                >
                    <Sparkles className="w-2.5 h-2.5" />
                    Level {level}
                </div>

                {/* Status pill */}
                <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium"
                    style={{
                        background: isDanger ? "rgba(248,113,113,0.1)" : "rgba(52,211,153,0.08)",
                        border: `1px solid ${isDanger ? "rgba(248,113,113,0.25)" : "rgba(52,211,153,0.2)"}`,
                        color: isDanger ? "#f87171" : "#34d399",
                    }}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${isDanger ? "bg-red-400" : "bg-emerald-400"} ${isDanger ? "animate-pulse" : ""}`}
                    />
                    {isDanger ? "Critical" : isHealthy ? "Healthy" : "Weakened"}
                </div>
            </div>

            {/* Speech Bubble */}
            <div className="relative w-full flex justify-center mb-2" style={{ minHeight: 40 }}>
                <AnimatePresence>
                    {isTalking && (
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.95 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="px-4 py-2 text-xs font-medium text-white/90 rounded-2xl whitespace-nowrap"
                            style={{
                                background: "rgba(255,255,255,0.07)",
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                            }}
                        >
                            {quote}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Orb */}
            <AmbientOrb hpPercent={hpPercent} isClicked={isClicked} onInteract={handleInteract} />

            {/* HP Bar */}
            <div className="w-full mt-6 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[10px] text-white/40">
                        <Heart className="w-3 h-3 text-red-400/70" />
                        HP
                    </span>
                    <span className="text-[10px] text-white/30 tabular-nums">{localHp} / {maxHp}</span>
                </div>

                <div
                    className="h-1.5 w-full rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                >
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: hpBarColor, boxShadow: `0 0 8px ${isDanger ? "rgba(248,113,113,0.4)" : "rgba(52,211,153,0.3)"}` }}
                        animate={{ width: `${hpPercent}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                </div>

                <p className="text-white/20 text-[9px] text-center">
                    Tap the orb to interact
                </p>
            </div>
        </MatteCard>
    );
};
