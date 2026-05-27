"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
            <Sidebar />
            <main className="flex-1 ml-20 lg:ml-64 p-8 lg:p-12 transition-all duration-300">
                <div className="max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
