"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CalendarDays,
    KanbanSquare,
    TrendingUp,
    Search,
    Bell,
    Menu,
    LogOut
} from "lucide-react";
import { VirtualFamiliarOrb } from "../dashboard/widgets/VirtualFamiliarOrb";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Schedule", href: "/schedule", icon: CalendarDays },
    { label: "Homework", href: "/studio", icon: KanbanSquare },
    { label: "Progress", href: "/progress", icon: TrendingUp },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#121212] flex flex-col md:flex-row text-zinc-100 font-sans">
            
            {/* ── Sidebar (Desktop Persistent, Mobile Drawer) ── */}
            <aside className={`
                fixed md:static top-0 left-0 h-screen w-64 bg-[#1C1C1E] border-r border-white/5 
                flex flex-col z-50 transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-white/5">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                            S
                        </div>
                        <span className="font-semibold tracking-tight">Sinau.id</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Menu</p>
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                    ${isActive 
                                        ? "bg-white/5 text-cyan-400" 
                                        : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.02]"}
                                `}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-zinc-500"}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Footer / Profile */}
                <div className="p-4 border-t border-white/5">
                    <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.02] transition-colors">
                        <LogOut className="w-4 h-4 text-zinc-500" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ── Main Content Area ── */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                
                {/* Top Navbar */}
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-[#121212]/80 backdrop-blur-md z-30">
                    <div className="flex items-center gap-4">
                        <button 
                            className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-zinc-100"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        
                        {/* Global Search */}
                        <div className="hidden md:flex items-center relative group">
                            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search everything..."
                                className="w-64 bg-white/5 border border-white/5 rounded-full py-1.5 pl-9 pr-4 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* The Familiar Orb integrated into Navbar */}
                        <VirtualFamiliarOrb className="w-8 h-8" />
                        
                        <button className="relative p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-400 border border-[#121212]" />
                        </button>
                        
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 border-2 border-[#1C1C1E] shadow-sm ml-2" />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
};
