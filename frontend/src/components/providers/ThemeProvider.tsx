"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";

// Full color palette for each theme — primary, lighter variant, darker variant, and glow
const THEME_PALETTES: Record<string, { primary: string; light: string; dark: string; glow: string }> = {
    violet: { primary: "#8b5cf6", light: "#a78bfa", dark: "#6d28d9", glow: "rgba(139, 92, 246, 0.25)" },
    indigo: { primary: "#6366f1", light: "#818cf8", dark: "#4f46e5", glow: "rgba(99, 102, 241, 0.25)" },
    blue: { primary: "#3b82f6", light: "#60a5fa", dark: "#2563eb", glow: "rgba(59, 130, 246, 0.25)" },
    emerald: { primary: "#10b981", light: "#34d399", dark: "#059669", glow: "rgba(16, 185, 129, 0.25)" },
    orange: { primary: "#f97316", light: "#fb923c", dark: "#ea580c", glow: "rgba(249, 115, 22, 0.25)" },
    rose: { primary: "#f43f5e", light: "#fb7185", dark: "#e11d48", glow: "rgba(244, 63, 94, 0.25)" },
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const accentColor = useDashboardStore((s) => s.settings.accentColor);

    useEffect(() => {
        const palette = THEME_PALETTES[accentColor] || THEME_PALETTES.violet;
        const root = document.documentElement;

        root.style.setProperty("--accent-color", palette.primary);
        root.style.setProperty("--accent-light", palette.light);
        root.style.setProperty("--accent-dark", palette.dark);
        root.style.setProperty("--accent-glow", palette.glow);
        root.setAttribute("data-theme", accentColor);
    }, [accentColor]);

    return <>{children}</>;
};
