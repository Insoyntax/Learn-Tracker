"use client";

import { ReactNode, useRef, useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";

interface SpatialCardProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    className?: string;
    /** Accent color for the hover spotlight (CSS color string) */
    glowColor?: string;
    /** Whether to show the mouse-tracking spotlight  */
    spotlight?: boolean;
    /** Whether to apply a subtle magnetic hover pull */
    magnetic?: boolean;
    onClick?: () => void;
}

/**
 * SpatialCard — the foundational container for all dashboard widgets.
 * Features:
 *   - Deep glassmorphism: backdrop-blur-2xl + bg-white/[0.03]
 *   - Thin luminous border: border-white/10
 *   - Mouse-tracking radial spotlight / glare effect
 *   - Subtle magnetic hover pull with Framer Motion
 *   - Extreme rounding: rounded-3xl
 */
export const SpatialCard = ({
    children,
    className = "",
    glowColor = "rgba(56, 189, 248, 0.12)",
    spotlight = true,
    magnetic = true,
    onClick,
    ...props
}: SpatialCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mousePos = useMousePosition(cardRef as React.RefObject<HTMLElement>);
    const [isHovered, setIsHovered] = useState(false);

    const springConfig = { type: "spring" as const, stiffness: 300, damping: 25 };

    return (
        <motion.div
            ref={cardRef}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                relative overflow-hidden rounded-3xl
                bg-white/[0.03] backdrop-blur-2xl
                border border-white/[0.07]
                shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]
                transition-shadow duration-500 ease-out
                ${className}
            `}
            whileHover={magnetic ? { scale: 1.008, y: -3 } : {}}
            whileTap={magnetic ? { scale: 0.995 } : {}}
            transition={springConfig}
            {...props}
        >
            {/* ── Mouse Spotlight Layer ── */}
            {spotlight && (
                <div
                    className="pointer-events-none absolute inset-0 z-0 rounded-3xl transition-opacity duration-500"
                    style={{
                        opacity: isHovered ? 1 : 0,
                        background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`,
                    }}
                />
            )}

            {/* ── Top Edge Shimmer ── */}
            <div
                className="pointer-events-none absolute top-0 left-0 right-0 h-px z-10 transition-opacity duration-500"
                style={{
                    opacity: isHovered ? 1 : 0.4,
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,${isHovered ? 0.2 : 0.05}), transparent)`,
                }}
            />

            {/* ── Content (above spotlight) ── */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
};
