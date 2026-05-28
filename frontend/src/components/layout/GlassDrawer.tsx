"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home, Map, BookOpen, Clock, Settings,
    Sword, Brain, Archive, Clapperboard,
    X, Zap
} from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";

const navItems = [
    { icon: Home, label: "Dashboard", href: "/", accent: "text-sky-400" },
    { icon: Clapperboard, label: "Creator Studio", href: "/studio", accent: "text-violet-400" },
    { icon: Sword, label: "Tavern Quests", href: "/quests", accent: "text-amber-400" },
    { icon: Archive, label: "Inventory", href: "/inventory", accent: "text-emerald-400" },
    { icon: Brain, label: "Flashcards", href: "/flashcards", accent: "text-fuchsia-400" },
    { icon: Map, label: "Roadmaps", href: "/roadmaps", accent: "text-cyan-400" },
    { icon: BookOpen, label: "Resources", href: "/resources", accent: "text-orange-400" },
    { icon: Clock, label: "Study Logs", href: "/logs", accent: "text-green-400" },
];

const bottomItems = [
    { icon: Settings, label: "Settings", href: "/settings", accent: "text-slate-400" },
];

/** Drawer width */
const DRAWER_WIDTH = 280;

export const GlassDrawer = () => {
    const pathname = usePathname();
    const isSidebarOpen = useDashboardStore((s) => s.isSidebarOpen);
    const toggleSidebar = useDashboardStore((s) => s.toggleSidebar);
    const userName = useDashboardStore((s) => s.settings.userName);
    const level = useDashboardStore((s) => s.userStats.level);

    const renderLink = (item: typeof navItems[number]) => {
        const isActive = pathname === item.href;
        return (
            <Link
                key={item.href}
                href={item.href}
                onClick={toggleSidebar}
                className={`
                    group flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm
                    transition-all duration-300 relative overflow-hidden
                    ${isActive
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"
                    }
                `}
            >
                {/* Active indicator glow */}
                {isActive && (
                    <motion.div
                        layoutId="activeDrawerNav"
                        className="absolute inset-0 rounded-2xl"
                        style={{
                            background: "linear-gradient(135deg, rgba(56,189,248,0.12), rgba(167,139,250,0.08))",
                            border: "1px solid rgba(255,255,255,0.08)",
                        }}
                    />
                )}

                <item.icon
                    className={`w-4.5 h-4.5 shrink-0 relative z-10 transition-colors duration-300
                        ${isActive ? item.accent : "text-white/30 group-hover:text-white/60"}`}
                />
                <span className="relative z-10 tracking-tight font-medium">{item.label}</span>

                {isActive && (
                    <div className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 relative z-10 ${item.accent.replace("text-", "bg-")} animate-pulse`} />
                )}
            </Link>
        );
    };

    return (
        <AnimatePresence>
            {isSidebarOpen && (
                <>
                    {/* ── Backdrop Overlay ── */}
                    <motion.div
                        key="drawer-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="fixed inset-0 z-40"
                        style={{
                            background: "rgba(0, 0, 0, 0.6)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                        }}
                        onClick={toggleSidebar}
                    />

                    {/* ── Glass Drawer Panel ── */}
                    <motion.aside
                        key="drawer-panel"
                        initial={{ x: -DRAWER_WIDTH, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -DRAWER_WIDTH, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed left-0 top-0 bottom-0 z-50 flex flex-col"
                        style={{
                            width: DRAWER_WIDTH,
                            background: "rgba(10, 10, 15, 0.85)",
                            backdropFilter: "blur(80px) saturate(180%)",
                            WebkitBackdropFilter: "blur(80px) saturate(180%)",
                            borderRight: "1px solid rgba(255,255,255,0.07)",
                            boxShadow: "20px 0 60px rgba(0,0,0,0.6), inset -1px 0 0 rgba(255,255,255,0.04)",
                        }}
                    >
                        {/* Top shimmer line */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                        {/* ── Logo Header ── */}
                        <div className="flex items-center justify-between px-5 pt-8 pb-6">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(56,189,248,0.3), rgba(167,139,250,0.3))",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        boxShadow: "0 0 20px rgba(56,189,248,0.15)",
                                    }}
                                >
                                    <Zap className="w-4 h-4 text-sky-300" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm tracking-tight">Learn Tracker</p>
                                    <p className="text-white/30 text-[10px] tracking-wide">Spatial OS</p>
                                </div>
                            </div>

                            <button
                                onClick={toggleSidebar}
                                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-all"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* ── Nav Items ── */}
                        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
                            {navItems.map(renderLink)}
                        </nav>

                        {/* ── Divider ── */}
                        <div className="mx-5 h-px bg-white/[0.06]" />

                        {/* ── Bottom: Settings + Profile ── */}
                        <div className="px-3 py-4 space-y-0.5">
                            {bottomItems.map(renderLink)}
                        </div>

                        {/* ── User Profile Card ── */}
                        <div className="px-4 pb-8">
                            <div
                                className="flex items-center gap-3 p-3 rounded-2xl"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                {/* Avatar orb */}
                                <div
                                    className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold text-sky-300"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(167,139,250,0.15))",
                                        border: "1px solid rgba(56,189,248,0.2)",
                                    }}
                                >
                                    {userName.slice(0, 1).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white/80 text-sm font-medium truncate">{userName}</p>
                                    <p className="text-white/30 text-[10px]">Level {level} Learner</p>
                                </div>
                                <div
                                    className="px-2 py-0.5 rounded-full text-[9px] font-medium text-sky-400"
                                    style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)" }}
                                >
                                    PRO
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};
