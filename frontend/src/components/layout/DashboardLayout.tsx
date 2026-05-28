"use client";

import { ReactNode } from "react";
import { GlassDrawer } from "./GlassDrawer";
import { useDashboardStore } from "@/store/useDashboardStore";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const toggleSidebar = useDashboardStore((s) => s.toggleSidebar);
    const isSidebarOpen = useDashboardStore((s) => s.isSidebarOpen);

    return (
        <div className="relative min-h-screen bg-canvas text-white font-sans selection:bg-sky-500/20 overflow-x-hidden">

            {/* ── Ambient background gradient blobs ── */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div
                    className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-30"
                    style={{
                        background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
                <div
                    className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
                    style={{
                        background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-10"
                    style={{
                        background: "radial-gradient(ellipse, rgba(52,211,153,0.08) 0%, transparent 70%)",
                        filter: "blur(100px)",
                    }}
                />
            </div>

            {/* ── Floating Menu Trigger ── */}
            <motion.button
                onClick={toggleSidebar}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed top-6 left-6 z-30 flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300"
                style={{
                    background: isSidebarOpen ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
                aria-label="Open navigation"
            >
                <Menu className="w-4.5 h-4.5 text-white/70" />
            </motion.button>

            {/* ── Glass Drawer (floating) ── */}
            <GlassDrawer />

            {/* ── Main Content Area ── */}
            <main className="relative z-10 min-h-screen px-6 pt-20 pb-12 lg:px-12 lg:pt-20">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
