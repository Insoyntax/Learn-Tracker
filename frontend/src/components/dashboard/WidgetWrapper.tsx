"use client";

import React, { forwardRef } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { GripVertical, X } from "lucide-react";

interface WidgetWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    id: string;
    children: React.ReactNode;
}

export const WidgetWrapper = forwardRef<HTMLDivElement, WidgetWrapperProps>(
    ({ id, children, className, style, ...props }, ref) => {
        const isEditMode = useDashboardStore((s) => s.isEditMode);
        const removeWidget = useDashboardStore((s) => s.removeWidget);

        return (
            <div
                ref={ref}
                style={style}
                className={`relative h-full w-full group transition-all duration-200 ${className || ""}`}
                {...props}
            >
                {/* Drag Handle & Controls - Visible only in Edit Mode */}
                {isEditMode && (
                    <div className="absolute top-2 right-2 z-50 flex items-center bg-black/80 backdrop-blur-md rounded-lg border border-white/10 p-1 shadow-lg cursor-default select-none animate-in fade-in zoom-in-95 duration-200">
                        {/* Drag Handle - Targeted by react-grid-layout via 'drag-handle' class */}
                        <div
                            className="drag-handle cursor-move p-1 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-colors"
                            title="Drag to move"
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                        >
                            <GripVertical size={14} />
                        </div>

                        <div className="w-[1px] h-3 bg-white/20 mx-1" />

                        {/* Remove Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                // Prevent drag start if clicking the button (though handle is separate)
                                removeWidget(id);
                            }}
                            className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-500/20 transition-colors"
                            title="Remove widget"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                {/* Inner Content Container */}
                <div className="h-full w-full overflow-hidden rounded-2xl relative">
                    {/* Dotted overlay in edit mode to suggest 'droppable' area? */}
                    {isEditMode && (
                        <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-indigo-500/30 rounded-2xl z-40 bg-indigo-500/5 animate-pulse" />
                    )}
                    {children}
                </div>
            </div>
        );
    }
);

WidgetWrapper.displayName = "WidgetWrapper";
