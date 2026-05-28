"use client";

import { useDashboardStore } from "@/store/useDashboardStore";
import { useEffect, useState } from "react";
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
            <div 
                className={cn(
                    "absolute inset-0 rounded-full blur-md opacity-60 orb-breathe",
                    isHealthy ? "bg-emerald-400" : isDanger ? "bg-rose-400" : "bg-amber-400"
                )} 
            />
            <div 
                className={cn(
                    "relative w-full h-full rounded-full shadow-inner border border-white/20 z-10",
                    isHealthy ? "bg-emerald-500" : isDanger ? "bg-rose-500" : "bg-amber-500"
                )}
            />
        </div>
    );
};
