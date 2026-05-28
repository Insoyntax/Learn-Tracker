"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeColor = "cyan" | "rose" | "emerald" | "amber" | "default";

interface StatusBadgeProps {
    children: ReactNode;
    color?: BadgeColor;
    className?: string;
}

const COLOR_MAP: Record<BadgeColor, string> = {
    cyan: "text-cyan-400 bg-cyan-400/10",
    rose: "text-rose-400 bg-rose-400/10",
    emerald: "text-emerald-400 bg-emerald-400/10",
    amber: "text-amber-400 bg-amber-400/10",
    default: "text-zinc-400 bg-zinc-400/10",
};

/**
 * StatusBadge — pill-shaped badges using Accent colors with 10% opacity background.
 */
export const StatusBadge = ({ children, color = "default", className }: StatusBadgeProps) => {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide",
                COLOR_MAP[color],
                className
            )}
        >
            {children}
        </span>
    );
};
