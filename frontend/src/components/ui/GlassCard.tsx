"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
    onClick?: () => void;
}

/**
 * GlassCard — now a thin alias for SpatialCard semantics.
 * Existing widgets continue to import GlassCard unchanged.
 */
export const GlassCard = ({ children, className = "", hoverEffect = true, onClick, ...props }: GlassCardProps) => {
    return (
        <motion.div
            onClick={onClick}
            className={`
                relative overflow-hidden rounded-3xl
                bg-white/[0.03] backdrop-blur-2xl
                border border-white/[0.07]
                shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]
                transition-shadow duration-500
                ${className}
            `}
            whileHover={hoverEffect ? { scale: 1.007, y: -2 } : {}}
            whileTap={hoverEffect ? { scale: 0.997 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            {...props}
        >
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {children}
        </motion.div>
    );
};
