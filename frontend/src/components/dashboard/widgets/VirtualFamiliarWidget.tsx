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
    const familiar = useDashboardStore(s => s.userStats?.familiar);
    
    // Securely fall back if data isn't hydrated yet
    const { currentHp, maxHp, level, lastFedAt } = familiar || { currentHp: 100, maxHp: 100, level: 1, lastFedAt: new Date().toISOString() };

    const [localHp, setLocalHp] = useState(currentHp);
    const [isTalking, setIsTalking] = useState(false);
    const [quote, setQuote] = useState(QUOTES[0]);

    useEffect(() => {
        const calculateDrain = () => {
            const lastFedTime = new Date(lastFedAt).getTime();
            const now = Date.now();
            const hoursElapsed = (now - lastFedTime) / (1000 * 60 * 60);
            
            const deducted = Math.floor(hoursElapsed * 1);
            const simulatedHp = Math.max(0, currentHp - deducted);
            setLocalHp(simulatedHp);
        };

        calculateDrain();
        const interval = setInterval(calculateDrain, 60000);
        return () => clearInterval(interval);
    }, [currentHp, lastFedAt]);

    const hpPercentage = Math.min((localHp / maxHp) * 100, 100);

    const hpColor = hpPercentage > 50
        ? "bg-primary"
        : hpPercentage > 20
            ? "bg-accent"
            : "bg-red-500 animate-pulse";

    const handlePetInteract = () => {
        if (isTalking) return;
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        setIsTalking(true);

        setTimeout(() => {
            setIsTalking(false);
        }, 3000);
    };

    return (
        <div className={`h-full flex flex-col items-center justify-center p-4 relative bg-card border-2 border-white/20 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] ${className}`}>

            {/* Top Level indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-transparent border-2 border-accent shadow-[2px_2px_0px_0px_var(--color-accent)]">
                <Sparkles className="w-3 h-3 text-accent" />
                <span className="text-[10px] font-Outfit font-bold text-accent uppercase">Lvl {level}</span>
            </div>

            {/* Speech Bubble */}
            <AnimatePresence>
                {isTalking && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        className="absolute top-10 bg-white border-2 border-black text-black text-xs font-Inter font-bold px-4 py-2 shadow-[4px_4px_0px_0px_var(--color-primary)] z-20 whitespace-nowrap"
                    >
                        {quote}
                        {/* Brutalism tail */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-black border-r-[6px] border-r-transparent"></div>
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-t-[6px] border-t-white border-r-[4px] border-r-transparent"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Familiar Avatar (Line-art SVG) */}
            <motion.button
                onClick={handlePetInteract}
                className="relative z-10 w-24 h-24 mt-6 flex items-center justify-center focus:outline-none cursor-pointer group"
                whileTap={{ scale: 1.1, y: -10 }}
            >
                <motion.div
                    animate={{
                        y: [-2, 2, -2],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-20 h-20 transition-all"
                >
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
                        {/* Minimalist Tech Blob Body */}
                        <path d="M20 50 C20 20, 80 20, 80 50 C80 80, 70 90, 50 90 C30 90, 20 80, 20 50 Z" stroke="white" strokeWidth="4" fill="transparent"/>
                        {/* Eyes */}
                        <rect x="35" y="45" width="8" height="8" fill="var(--color-primary)" />
                        <rect x="57" y="45" width="8" height="8" fill="var(--color-primary)" />
                        {/* Mouth/Glitch */}
                        <path d="M42 65 L58 65" stroke="white" strokeWidth="4" strokeLinecap="square"/>
                        {/* Antenna */}
                        <path d="M50 22 L50 10" stroke="white" strokeWidth="4"/>
                        <circle cx="50" cy="10" r="4" fill="var(--color-accent)"/>
                    </svg>
                </motion.div>
            </motion.button>

            {/* Health Bar UI Container */}
            <div className="w-full mt-8 space-y-2 z-10">
                <div className="flex justify-between items-center px-1">
                    <span className="flex items-center gap-1 text-[10px] font-Outfit font-bold text-slate-100 uppercase">
                        <Heart className="w-3 h-3 text-red-500 fill-red-500" /> HP
                    </span>
                    <span className="text-[10px] font-Outfit font-bold text-slate-300 tabular-nums">
                        {localHp} / {maxHp}
                    </span>
                </div>

                {/* Visual HP Track */}
                <div className="h-3 w-full bg-transparent overflow-hidden border-2 border-white/20">
                    <motion.div
                        className={`h-full ${hpColor}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${hpPercentage}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    />
                </div>
            </div>
        </div>
    );
};
