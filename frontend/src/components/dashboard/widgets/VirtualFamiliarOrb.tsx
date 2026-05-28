"use client";

import { useDashboardStore } from "@/store/useDashboardStore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const VirtualFamiliarOrb = ({ className }: { className?: string }) => {
    const familiarHP = useDashboardStore((s) => s.userStats.familiar.currentHp);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className={cn("rounded-full bg-zinc-800", className)} />;

    const isHealthy = familiarHP > 50;
    const isDanger = familiarHP < 20;

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <motion.div 
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.8, 1, 0.8],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className={cn(
                    "w-full h-full rounded-full z-10",
                    isHealthy ? "bg-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.5)]" : 
                    isDanger ? "bg-rose-400 shadow-[0_0_24px_rgba(251,113,133,0.5)]" : 
                    "bg-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.5)]"
                )}
            />
        </div>
    );
};
