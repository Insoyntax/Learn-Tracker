"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface MatteCardProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

/**
 * MatteCard — the foundational container for the Matte Dark SaaS aesthetic.
 * Features:
 *   - Solid card surface: bg-[#1C1C1E]
 *   - Faint luminous border: border-white/5
 *   - Subtle drop shadow: shadow-md shadow-black/20
 *   - Rounded corners: rounded-2xl
 */
export const MatteCard = ({
    children,
    className = "",
    onClick,
    ...props
}: MatteCardProps) => {
    return (
        <motion.div
            onClick={onClick}
            className={`
                relative overflow-hidden rounded-2xl
                bg-[#1C1C1E]
                border border-white/5
                shadow-md shadow-black/20
                ${className}
            `}
            {...props}
        >
            {children}
        </motion.div>
    );
};
