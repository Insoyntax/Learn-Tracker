import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface BrutalCardProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
    onClick?: () => void;
}

export const BrutalCard = ({ children, className = "", hoverEffect = true, onClick, ...props }: BrutalCardProps) => {
    // Neo-Brutalism uses solid background, sharp 2px borders, and hard drop shadows.
    // When hovered, the card might shift slightly and the shadow adjust to feel tactile.
    const baseClasses = `
        bg-card relative overflow-hidden border-2 border-white/20
        shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]
        transition-colors duration-200 ease-out
    `;

    return (
        <motion.div
            onClick={onClick}
            className={`${baseClasses} ${className}`}
            whileHover={hoverEffect ? { 
                scale: 1.01, 
                x: -2, 
                y: -2,
                boxShadow: "6px 6px 0px 0px rgba(255,255,255,0.2)"
            } : {}}
            whileTap={hoverEffect ? { 
                scale: 0.99, 
                x: 2, 
                y: 2,
                boxShadow: "0px 0px 0px 0px rgba(255,255,255,0.1)"
            } : {}}
            {...props}
        >
            {children}
        </motion.div>
    );
};
