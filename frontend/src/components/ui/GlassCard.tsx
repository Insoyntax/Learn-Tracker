import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
    onClick?: () => void;
}

export const GlassCard = ({ children, className = "", hoverEffect = true, onClick }: GlassCardProps) => {
    return (
        <div
            onClick={onClick}
            className={`
        relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl
        transition-all duration-300 ease-out
        ${hoverEffect ? 'hover:bg-white/[0.07] hover:border-white/10 hover:shadow-indigo-500/10 hover:-translate-y-1' : ''}
        ${className}
      `}
        >
            {/* Internal shine/glow effect could go here */}
            {children}
        </div>
    );
};
