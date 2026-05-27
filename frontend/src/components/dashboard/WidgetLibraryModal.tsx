"use client";

import { X, Plus, LayoutGrid, CheckCircle } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { motion, AnimatePresence } from "framer-motion";

interface WidgetLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WidgetLibraryModal = ({ isOpen, onClose }: WidgetLibraryModalProps) => {
    const availableWidgets = useDashboardStore(s => s.availableWidgets);
    const layout = useDashboardStore(s => s.layout);
    const addWidget = useDashboardStore(s => s.addWidget);

    // Filter out widgets already in layout
    const unusedWidgets = availableWidgets.filter(wId => !layout.some(l => l.i === wId));

    const WIDGET_DISPLAY_NAMES: Record<string, string> = {
        streak: "Daily Progress & Streak",
        roadmap: "Active Roadmap",
        timer: "Focus Timer",
        daily_goals: "Daily Goals",
        quick_note: "Quick Notes",
        quote: "Daily Motivation",
        analytics: "Study Heatmap",
        familiar: "Virtual Focus Familiar",
    };

    const WIDGET_DESCRIPTIONS: Record<string, string> = {
        streak: "Track your daily study streak and XP progress.",
        roadmap: "Visual progress of your current learning path.",
        timer: "Pomodoro-style focus timer for study sessions.",
        daily_goals: "Checklist of your daily learning objectives.",
        quick_note: "Scratchpad for temporary thoughts and ideas.",
        quote: "Inspirational quotes to keep you motivated.",
        analytics: "Visual heatmap of your study consistency.",
        familiar: "A Tamagotchi-style pet that feeds on your productivity.",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Slide-over Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-sm bg-slate-900 border-l border-white/10 shadow-2xl z-[101] p-6 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <LayoutGrid className="text-indigo-400" />
                                    Widget Library
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    Drag & drop or click to add
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {unusedWidgets.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-center p-6 border-2 border-dashed border-slate-700/50 rounded-xl">
                                    <CheckCircle className="text-emerald-500 mb-2" size={32} />
                                    <p className="text-slate-300 font-medium">All Set!</p>
                                    <p className="text-xs text-slate-500 mt-1">Everything has been added.</p>
                                </div>
                            ) : (
                                unusedWidgets.map(widgetId => (
                                    <button
                                        key={widgetId}
                                        onClick={() => {
                                            addWidget(widgetId);
                                            onClose();
                                        }}
                                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:border-indigo-500/50 hover:bg-slate-800 transition-all group text-left"
                                    >
                                        <div className="h-10 w-10 shrink-0 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                            <Plus size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-slate-200 group-hover:text-white capitalize">
                                                {WIDGET_DISPLAY_NAMES[widgetId] || widgetId.replace('_', ' ')}
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                                {WIDGET_DESCRIPTIONS[widgetId] || "Add this widget to your dashboard."}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


