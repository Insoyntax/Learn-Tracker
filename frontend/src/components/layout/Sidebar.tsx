"use client";

import { motion } from "framer-motion";
import {
    Home,
    Map,
    BookOpen,
    Clock,
    Settings,
    ChevronRight,
    Target,
    Brain,
    Archive,
    Sword,
    Clapperboard
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useDashboardStore } from "@/store/useDashboardStore";

const navItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: Clapperboard, label: "Creator Studio", href: "/studio" },
    { icon: Sword, label: "Tavern Quests", href: "/quests" },
    { icon: Archive, label: "Inventory", href: "/inventory" },
    { icon: Target, label: "Skill Tree", href: "/skills" },
    { icon: Brain, label: "Flashcards", href: "/flashcards" },
    { icon: Map, label: "Roadmaps", href: "/roadmaps" },
    { icon: BookOpen, label: "Resources", href: "/resources" },
    { icon: Clock, label: "Study Logs", href: "/logs" },
];

const bottomNavItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const userName = useDashboardStore((s) => s.settings.userName);

    const renderNavLink = (item: typeof navItems[number]) => {
        const isActive = pathname === item.href;
        return (
            <Link
                key={item.href}
                href={item.href}
                className={`
          group flex items-center gap-3 px-3 py-3 rounded-none transition-all duration-200 relative overflow-hidden border-2
          ${isActive
                        ? 'bg-primary border-primary text-black shadow-[4px_4px_0px_0px_var(--color-primary)] translate-x-1 -translate-y-1'
                        : 'bg-transparent border-transparent text-slate-400 hover:text-slate-100 hover:border-white/20 hover:bg-white/5'}
        `}
            >
                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-black' : 'group-hover:text-primary'}`} />

                <span className="hidden lg:block font-Outfit font-bold text-sm tracking-wide uppercase">
                    {item.label}
                </span>

                {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto hidden lg:block text-black opacity-70" />
                )}
            </Link>
        );
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-20 lg:w-64 border-r-2 border-white/20 bg-card z-50 flex flex-col justify-between py-6 transition-all duration-300">

            {/* Logo Area */}
            <div className="px-4 lg:px-6 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path d="M10 90 L50 10 L90 90 Z" stroke="var(--color-primary)" strokeWidth="6" strokeLinejoin="miter" />
                        <path d="M30 60 L70 60" stroke="var(--color-accent)" strokeWidth="6" />
                        <circle cx="50" cy="40" r="6" fill="var(--color-accent)" />
                    </svg>
                </div>
                <span className="hidden lg:block font-Outfit font-bold text-xl tracking-tighter text-white">
                    Learn<span className="text-primary">Tracker</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 lg:px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map(renderNavLink)}
            </nav>

            {/* Footer / Settings + User Profile */}
            <div className="px-2 lg:px-4 mt-4 space-y-2 pt-4 border-t-2 border-white/20">
                {bottomNavItems.map(renderNavLink)}

                <div className="pt-4 flex items-center gap-3 px-3">
                    <div className="w-10 h-10 border-2 border-white/20 bg-black flex items-center justify-center shrink-0">
                        <span className="font-Outfit font-bold text-primary">U</span>
                    </div>
                    <div className="hidden lg:flex flex-col">
                        <span className="text-sm font-bold text-white font-Outfit">{userName}</span>
                        <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Hacker Plan</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};
