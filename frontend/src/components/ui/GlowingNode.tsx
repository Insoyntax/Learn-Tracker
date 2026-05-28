"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Status = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | "active" | "done" | "pending" | string;

interface GlowingNodeProps {
    status: Status;
    label?: string;
    className?: string;
}

const STATUS_CONFIG: Record<string, { color: string; glow: string; pulse: boolean; dot: string }> = {
    IN_PROGRESS: {
        color: "text-sky-400 bg-sky-400/10 border-sky-400/20",
        glow: "shadow-[0_0_12px_rgba(56,189,248,0.25)]",
        pulse: true,
        dot: "bg-sky-400",
    },
    active: {
        color: "text-sky-400 bg-sky-400/10 border-sky-400/20",
        glow: "shadow-[0_0_12px_rgba(56,189,248,0.25)]",
        pulse: true,
        dot: "bg-sky-400",
    },
    REVIEW: {
        color: "text-violet-400 bg-violet-400/10 border-violet-400/20",
        glow: "shadow-[0_0_12px_rgba(167,139,250,0.25)]",
        pulse: true,
        dot: "bg-violet-400",
    },
    DONE: {
        color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        glow: "shadow-[0_0_12px_rgba(52,211,153,0.2)]",
        pulse: false,
        dot: "bg-emerald-400",
    },
    done: {
        color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        glow: "shadow-[0_0_12px_rgba(52,211,153,0.2)]",
        pulse: false,
        dot: "bg-emerald-400",
    },
    TODO: {
        color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
        glow: "",
        pulse: false,
        dot: "bg-zinc-500",
    },
    pending: {
        color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
        glow: "",
        pulse: false,
        dot: "bg-zinc-500",
    },
};

/**
 * GlowingNode — pill-shaped status badge with an inner glow and a pulsing dot.
 */
export const GlowingNode = ({ status, label, className }: GlowingNodeProps) => {
    const config = STATUS_CONFIG[status] ?? STATUS_CONFIG["TODO"];
    const displayLabel = label ?? status.replace("_", " ");

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide border",
                config.color,
                config.glow,
                className
            )}
        >
            <span
                className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    config.dot,
                    config.pulse && "animate-pulse"
                )}
            />
            {displayLabel}
        </span>
    );
};
