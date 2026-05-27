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
          group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative overflow-hidden
          ${isActive
                        ? 'bg-white/10 text-white shadow-inner'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'}
        `}
            >
                {isActive && (
                    <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    />
                )}

                <item.icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-300'} transition-colors`} />

                <span className="hidden lg:block font-medium text-sm">
                    {item.label}
                </span>

                {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto hidden lg:block text-indigo-400 opacity-50" />
                )}
            </Link>
        );
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-20 lg:w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl z-50 flex flex-col justify-between py-6 transition-all duration-300">

            {/* Logo Area */}
            <div className="px-4 lg:px-6 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <span className="font-bold text-white text-xl">L</span>
                </div>
                <span className="hidden lg:block font-bold text-lg tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Learn Tracker
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 lg:px-4 space-y-1">
                {navItems.map(renderNavLink)}
            </nav>

            {/* Footer / Settings + User Profile */}
            <div className="px-2 lg:px-4 mt-auto space-y-2">
                {bottomNavItems.map(renderNavLink)}

                <div className="pt-4 border-t border-white/5 flex items-center gap-3 px-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/10" />
                    <div className="hidden lg:flex flex-col">
                        <span className="text-sm font-medium text-white">{userName}</span>
                        <span className="text-xs text-gray-500">Pro Plan</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};
