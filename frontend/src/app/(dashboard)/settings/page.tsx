"use client";

import React, { useState } from "react";

import { MatteCard } from "@/components/ui/MatteCard";
import { useDashboardStore } from "@/store/useDashboardStore";
import {
    Paintbrush, Bell, Database, Check, AlertTriangle, Trash2,
    Volume2, VolumeX, User, Timer, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const COLORS = [
    { name: "violet", hex: "#8b5cf6", label: "Violet" },
    { name: "indigo", hex: "#6366f1", label: "Indigo" },
    { name: "blue", hex: "#3b82f6", label: "Blue" },
    { name: "emerald", hex: "#10b981", label: "Emerald" },
    { name: "orange", hex: "#f97316", label: "Orange" },
    { name: "rose", hex: "#f43f5e", label: "Rose" },
];

const TABS = [
    { id: "profile", icon: User, label: "Profile" },
    { id: "appearance", icon: Paintbrush, label: "Appearance" },
    { id: "timer", icon: Timer, label: "Timer Defaults" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "data", icon: Database, label: "Danger Zone" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function SettingsPage() {
    const settings = useDashboardStore((s) => s.settings);
    const updateSettings = useDashboardStore((s) => s.updateSettings);
    const resetData = useDashboardStore((s) => s.resetData);

    const [activeTab, setActiveTab] = useState<TabId>("profile");
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [localName, setLocalName] = useState(settings.userName);

    const handleNameSave = () => {
        const trimmed = localName.trim();
        if (trimmed.length === 0) {
            toast.error("Name cannot be empty.", { style: { background: "#1e1e2e", color: "#fff" } });
            return;
        }
        updateSettings({ userName: trimmed });
        toast.success(`Name updated to "${trimmed}"!`, {
            icon: "✅",
            style: { background: "#1e1e2e", color: "#fff" },
        });
    };

    const handleTimerSave = (minutes: number) => {
        if (minutes < 1 || minutes > 120) {
            toast.error("Timer must be between 1 and 120 minutes.", { style: { background: "#1e1e2e", color: "#fff" } });
            return;
        }
        updateSettings({ defaultTimerMinutes: minutes });
        toast.success(`Default timer set to ${minutes} minutes.`, {
            icon: "⏱️",
            style: { background: "#1e1e2e", color: "#fff" },
        });
    };

    const handleReset = () => {
        toast.success("All data has been reset.", {
            icon: "🧹",
            style: { background: "#1e1e2e", color: "#fff" },
        });
        // Small delay to let the toast show before reload
        setTimeout(() => resetData(), 500);
    };

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
                    Settings
                </h1>
                <p className="text-gray-400 mt-2 text-sm">
                    Customize your experience and manage your data.
                </p>
            </header>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Tabs */}
                <nav className="w-full md:w-64 flex flex-col gap-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                ? "bg-[var(--accent-color,#8b5cf6)]/10 text-[var(--accent-color,#8b5cf6)] border border-[var(--accent-color,#8b5cf6)]/20"
                                : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                                }`}
                            style={activeTab === tab.id ? {
                                backgroundColor: `color-mix(in srgb, var(--accent-color, #8b5cf6) 10%, transparent)`,
                                color: `var(--accent-color, #8b5cf6)`,
                                borderColor: `color-mix(in srgb, var(--accent-color, #8b5cf6) 20%, transparent)`,
                            } : {}}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Content Area */}
                <div className="flex-1 max-w-2xl">
                    <AnimatePresence mode="wait">

                        {/* ── PROFILE TAB ── */}
                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MatteCard className="p-8">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <User className="w-5 h-5" style={{ color: "var(--accent-color, #8b5cf6)" }} />
                                        Profile
                                    </h2>
                                    <p className="text-gray-400 text-sm mb-6">
                                        Your display name appears in the sidebar and throughout the app.
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-medium text-gray-400 mb-2 block">Display Name</label>
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={localName}
                                                    onChange={(e) => setLocalName(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                                                    placeholder="Enter your name..."
                                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                                    style={{ focusRingColor: "var(--accent-color, #8b5cf6)" } as any}
                                                    maxLength={30}
                                                />
                                                <button
                                                    onClick={handleNameSave}
                                                    className="px-6 py-3 rounded-xl text-white text-sm font-medium transition-all hover:brightness-110 shadow-lg"
                                                    style={{ backgroundColor: "var(--accent-color, #8b5cf6)" }}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <p className="text-xs text-gray-500">
                                                Current name: <span className="text-white font-medium">{settings.userName}</span>
                                            </p>
                                        </div>
                                    </div>
                                </MatteCard>
                            </motion.div>
                        )}

                        {/* ── APPEARANCE TAB ── */}
                        {activeTab === "appearance" && (
                            <motion.div
                                key="appearance"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MatteCard className="p-8">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Paintbrush className="w-5 h-5" style={{ color: "var(--accent-color, #8b5cf6)" }} />
                                        Accent Color
                                    </h2>
                                    <p className="text-gray-400 text-sm mb-6">
                                        Choose a primary color for buttons, highlights, and progress bars. Changes apply globally and instantly.
                                    </p>

                                    <div className="grid grid-cols-3 gap-4">
                                        {COLORS.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => updateSettings({ accentColor: color.name })}
                                                className={`group relative flex items-center gap-3 p-3 rounded-xl border transition-all ${settings.accentColor === color.name
                                                    ? "bg-white/10 border-white/20 shadow-lg"
                                                    : "bg-black/20 border-white/5 hover:bg-white/5"
                                                    }`}
                                                style={settings.accentColor === color.name ? {
                                                    boxShadow: `0 0 20px ${color.hex}30`,
                                                } : {}}
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-full shadow-lg"
                                                    style={{ backgroundColor: color.hex }}
                                                />
                                                <span className="text-sm font-medium text-gray-200">{color.label}</span>
                                                {settings.accentColor === color.name && (
                                                    <div className="absolute top-2 right-2 p-1 rounded-full text-white" style={{ backgroundColor: color.hex }}>
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </MatteCard>
                            </motion.div>
                        )}

                        {/* ── TIMER DEFAULTS TAB ── */}
                        {activeTab === "timer" && (
                            <motion.div
                                key="timer"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MatteCard className="p-8">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Clock className="w-5 h-5" style={{ color: "var(--accent-color, #8b5cf6)" }} />
                                        Timer Defaults
                                    </h2>
                                    <p className="text-gray-400 text-sm mb-6">
                                        Set the default duration for your Focus Timer on the dashboard.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-4 gap-3">
                                            {[15, 25, 30, 45, 60, 90].map((mins) => (
                                                <button
                                                    key={mins}
                                                    onClick={() => handleTimerSave(mins)}
                                                    className={`py-3 rounded-xl border text-sm font-medium transition-all ${settings.defaultTimerMinutes === mins
                                                        ? "text-white border-transparent shadow-lg"
                                                        : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                                                        }`}
                                                    style={settings.defaultTimerMinutes === mins ? {
                                                        backgroundColor: "var(--accent-color, #8b5cf6)",
                                                    } : {}}
                                                >
                                                    {mins} min
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                            <Timer className="w-4 h-4 text-gray-500" />
                                            <span className="text-xs text-gray-400">
                                                Current default: <span className="text-white font-bold">{settings.defaultTimerMinutes} minutes</span>
                                            </span>
                                        </div>
                                    </div>
                                </MatteCard>
                            </motion.div>
                        )}

                        {/* ── NOTIFICATIONS TAB ── */}
                        {activeTab === "notifications" && (
                            <motion.div
                                key="notifications"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MatteCard className="p-8">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Bell className="w-5 h-5" style={{ color: "var(--accent-color, #8b5cf6)" }} />
                                        Notifications
                                    </h2>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${settings.soundEnabled ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-800 text-gray-500"}`}>
                                                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Sound Effects</p>
                                                <p className="text-xs text-gray-400">Play sounds when timer completes or goals are met.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                                            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                                            style={{ backgroundColor: settings.soundEnabled ? "var(--accent-color, #8b5cf6)" : "#374151" }}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </MatteCard>
                            </motion.div>
                        )}

                        {/* ── DANGER ZONE TAB ── */}
                        {activeTab === "data" && (
                            <motion.div
                                key="data"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MatteCard className="p-8 border-red-500/20">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Database className="w-5 h-5 text-red-400" />
                                        Danger Zone
                                    </h2>

                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className="text-red-400 font-bold text-sm">Irreversible Action</h3>
                                                <p className="text-red-200/70 text-xs mt-1">
                                                    This will permanently delete all your roadmaps, study logs, resources, streaks, XP, and settings. The page will reload with a fresh state.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {!showResetConfirm ? (
                                        <button
                                            onClick={() => setShowResetConfirm(true)}
                                            className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Reset All Data
                                        </button>
                                    ) : (
                                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                            <p className="text-center text-sm text-white font-bold">Are you absolutely sure?</p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setShowResetConfirm(false)}
                                                    className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleReset}
                                                    className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/20 transition-colors"
                                                >
                                                    Yes, Delete Everything
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </MatteCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}
