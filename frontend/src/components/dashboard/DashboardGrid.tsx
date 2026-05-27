"use client";

import { useEffect, useState, useRef } from "react";
// import RGL, { Layout as RGLLayout, WidthProvider, Responsive } from "react-grid-layout";
import { useDashboardStore, DashboardLayoutItem } from "@/store/useDashboardStore";
import { WidgetWrapper } from "./WidgetWrapper";
import { WidgetLibraryModal } from "./WidgetLibraryModal";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./grid-layout.css";

// Widgets
import { StreakWidget } from "./widgets/StreakWidget";
import { RoadmapWidget } from "./widgets/RoadmapWidget";
import { FocusTimerWidget } from "./widgets/FocusTimerWidget";
import { DailyGoalsWidget } from "./widgets/DailyGoalsWidget";
import { QuickNoteWidget } from "./widgets/QuickNoteWidget";
import { QuoteWidget } from "./widgets/QuoteWidget";
import { AnalyticsWidget } from "./widgets/AnalyticsWidget";
import { VirtualFamiliarWidget } from "./widgets/VirtualFamiliarWidget";

// Icons
import { LayoutGrid, Plus, Save, RotateCcw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import dynamic from "next/dynamic";

// Workaround for Next.js SSR/Turbopack compatibility with react-grid-layout
const ResponsiveGridLayout: any = dynamic(
    () => import("react-grid-layout").then((mod) => {
        // @ts-ignore
        const RGLComponent = mod.ResponsiveGridLayout || mod.default?.ResponsiveGridLayout;
        return RGLComponent;
    }),
    { ssr: false }
);


const WIDGET_LABELS: Record<string, string> = {
    streak: "Daily Progress & Streak",
    roadmap: "Active Roadmap",
    timer: "Focus Timer",
    daily_goals: "Daily Goals",
    quick_note: "Quick Notes / Scratchpad",
    quote: "Daily Motivation",
    analytics: "Study Heatmap",
    familiar: "Virtual Focus Familiar",
};

export const DashboardGrid = () => {
    const {
        layout, updateLayout, isEditMode, toggleEditMode,
        resetLayout, availableWidgets, addWidget
    } = useDashboardStore();

    // Prevent hydration mismatch by mounting only on client
    const [mounted, setMounted] = useState(false);

    // Manage container width manually for RGL v2
    const gridRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState<number>(1200);

    useEffect(() => {
        if (!gridRef.current) return;
        const observer = new ResizeObserver((entries) => {
            setWidth(entries[0].contentRect.width);
        });
        observer.observe(gridRef.current);
        return () => observer.disconnect();
    }, []);

    // Manage adding widget modal state
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Safety: If layout is completely empty (e.g. first visit or bug), force default layout
        if (layout.length === 0) {
            resetLayout();
        }
    }, [layout, resetLayout]);

    // Transform store layout to RGL layout format
    const onLayoutChange = (currentLayout: any[]) => {
        // We map back to our strict type
        const newLayout: DashboardLayoutItem[] = currentLayout.map((item: any) => ({
            i: item.i,
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
            minW: item.minW,
            maxW: item.maxW,
            minH: item.minH,
            maxH: item.maxH,
        }));
        
        // Prevent infinite loop by checking if the layout actually changed coords
        if (JSON.stringify(newLayout) !== JSON.stringify(layout)) {
            updateLayout(newLayout);
        }
    };

    const getWidgetComponent = (id: string) => {
        switch (id) {
            case "streak": return <StreakWidget className="h-full" />;
            case "roadmap": return <RoadmapWidget className="h-full" />;
            case "timer": return <FocusTimerWidget className="h-full" />;
            case "daily_goals": return <DailyGoalsWidget className="h-full" />;
            case "quick_note": return <QuickNoteWidget className="h-full" />;
            case "quote": return <QuoteWidget className="h-full" />;
            case "analytics": return <AnalyticsWidget className="h-full" />;
            case "familiar": return <VirtualFamiliarWidget className="h-full" />;
            default: return (
                <div className="h-full w-full flex items-center justify-center bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed text-slate-500 text-sm">
                    Unknown Widget ({id})
                </div>
            );
        }
    };

    if (!mounted) return null;

    return (
        <div className="relative min-h-[80vh]">
            {/* Widget Library Modal */}
            <WidgetLibraryModal
                isOpen={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
            />

            {/* Edit Controls Bar */}
            <div className="flex justify-end mb-6 gap-3 items-center">
                <AnimatePresence>
                    {isEditMode && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex gap-2 items-center"
                        >
                            <button
                                onClick={resetLayout}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl border border-red-500/20 transition-colors"
                            >
                                <RotateCcw size={14} /> Reset Layout
                            </button>

                            {/* Add Widget Button (Opens Modal) */}
                            <button
                                onClick={() => setIsLibraryOpen(true)}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                <Plus size={14} /> Add Widget
                            </button>

                            <div className="w-[1px] h-6 bg-slate-700 mx-2" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={toggleEditMode}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all ${isEditMode
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/20 hover:bg-emerald-600"
                        : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                        }`}
                >
                    {isEditMode ? <><Check size={16} /> Done Editing</> : <><LayoutGrid size={16} /> Edit Dashboard</>}
                </button>
            </div>

            {/* @ts-ignore */}
            <div ref={gridRef} className="w-full">
                <ResponsiveGridLayout
                    className="layout"
                    width={width}
                    layouts={{ lg: layout }}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={140}
                    isDraggable={isEditMode}
                    isResizable={isEditMode}
                    onLayoutChange={(layout: any) => onLayoutChange(layout)}
                    margin={[24, 24]}
                    draggableHandle=".drag-handle"
                    resizeHandles={isEditMode ? ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'] : []}
                >
                    {layout.map((item) => (
                        <div key={item.i} data-grid={item} className="transition-all duration-200">
                            <WidgetWrapper id={item.i}>
                                {getWidgetComponent(item.i)}
                            </WidgetWrapper>
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};
