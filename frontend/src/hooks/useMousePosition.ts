"use client";

import { useEffect, useRef, useState } from "react";

interface MousePosition {
    x: number;
    y: number;
}

/**
 * Tracks the mouse position relative to a given element ref.
 * Used to power the "spotlight" radial gradient on SpatialCard.
 */
export function useMousePosition(elementRef?: React.RefObject<HTMLElement | null>) {
    const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

    useEffect(() => {
        const target = elementRef?.current ?? window;

        const handleMove = (e: MouseEvent) => {
            if (elementRef?.current) {
                const rect = elementRef.current.getBoundingClientRect();
                setPosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
            } else {
                setPosition({ x: e.clientX, y: e.clientY });
            }
        };

        target.addEventListener("mousemove", handleMove as EventListener);
        return () => target.removeEventListener("mousemove", handleMove as EventListener);
    }, [elementRef]);

    return position;
}
