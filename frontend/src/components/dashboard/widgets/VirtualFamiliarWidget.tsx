"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";

const QUOTES = [
    "You're doing great!",
    "Keep that streak burning!",
    "Focus is a superpower.",
    "One step at a time.",
    "Breathe in, breathe out.",
    "Let's conquer the day!",
];

export const VirtualFamiliarWidget = ({ className }: { className?: string }) => {
    // 1. Get gamified familiar state with fallback defaults
    const familiar = useDashboardStore(s => s.userStats?.familiar);
    const feedFamiliar = useDashboardStore(s => s.feedFamiliar);

    // Securely fall back if data isn't hydrated yet
    const { currentHp, maxHp, level, lastFedAt } = familiar || { currentHp: 100, maxHp: 100, level: 1, lastFedAt: new Date().toISOString() };

    const [localHp, setLocalHp] = useState(currentHp);
    const [isTalking, setIsTalking] = useState(false);
    const [quote, setQuote] = useState(QUOTES[0]);

    // 2. Real-time HP Drain Simulation (Deduct 1 HP per hour elapsed since last fed)
    useEffect(() => {
        const calculateDrain = () => {
            const lastFedTime = new Date(lastFedAt).getTime();
            const now = Date.now();
            const hoursElapsed = (now - lastFedTime) / (1000 * 60 * 60);

            // Calculate drained HP, bottoming out at 0
            const deducted = Math.floor(hoursElapsed * 1); // 1 HP per hour
            const simulatedHp = Math.max(0, currentHp - deducted);
            setLocalHp(simulatedHp);
        };

        calculateDrain(); // Initial calc
        const interval = setInterval(calculateDrain, 60000); // Recalculate every minute
        return () => clearInterval(interval);
    }, [currentHp, lastFedAt]);

    const hpPercentage = Math.min((localHp / maxHp) * 100, 100);

    // Color gradient based on HP thresholds
    const hpColor = hpPercentage > 50
        ? "bg-green-500"
        : hpPercentage > 20
            ? "bg-amber-400"
            : "bg-red-500 animate-pulse";

    // 3. Interaction Handler: Click to make the pet jump and talk
    const handlePetInteract = () => {
        if (isTalking) return;
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        setIsTalking(true);

        // Hide speech bubble after 3 seconds
        setTimeout(() => {
            setIsTalking(false);
        }, 3000);
    };

    return (
        <div className={`h-full flex flex-col items-center justify-center p-4 relative ${className}`}>

            {/* Background ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl" />

            {/* Top Level indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-bold text-slate-300">Lvl {level}</span>
            </div>

            {/* Speech Bubble (AnimatePresence handles mount/unmount) */}
            <AnimatePresence>
                {isTalking && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        className="absolute -top-6 bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-2xl shadow-xl z-20 whitespace-nowrap before:content-[''] before:absolute before:-bottom-1.5 before:left-1/2 before:-translate-x-1/2 before: border-4 before:border-transparent before:border-t-white"
                    >
                        {quote}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Familiar Avatar (Continuous animation loop inside a clickable button) */}
            <motion.button
                onClick={handlePetInteract}
                className="relative z-10 w-24 h-24 flex items-center justify-center rounded-full focus:outline-none cursor-pointer group"

                // Jump Interaction Animation
                whileTap={{ scale: 1.2, y: -15, transition: { type: "spring", stiffness: 400, damping: 10 } }}
            >
                {/* Continuous floating/breathing animation */}
                <motion.div
                    animate={{
                        y: [-4, 4, -4],
                        scale: [1, 1.02, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="text-6xl filter drop-shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all"
                >
                    🦉 {/* The Pet Avatar */}
                </motion.div>
            </motion.button>

            {/* Health Bar UI Container */}
            <div className="w-full mt-6 space-y-1.5 z-10">
                <div className="flex justify-between items-center px-1">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Heart className="w-3 h-3" /> HP
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-300">
                        {localHp} / {maxHp}
                    </span>
                </div>

                {/* Visual HP Track */}
                <div className="h-2.5 w-full bg-slate-950/80 rounded-full overflow-hidden border border-white/5 p-[1px] shadow-inner">
                    <motion.div
                        className={`h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${hpColor}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${hpPercentage}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    />
                </div>
            </div>

        </div>
    );
};
