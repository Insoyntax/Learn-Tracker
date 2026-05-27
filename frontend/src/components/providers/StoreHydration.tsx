"use client";

import { useEffect, useRef } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useSession } from "next-auth/react";

export function StoreHydration() {
    const hasHydrated = useRef(false);
    const fetchInitialData = useDashboardStore((state) => state.fetchInitialData);
    const { status } = useSession();

    useEffect(() => {
        // Only fetch initial data once the user is definitively authenticated via Auth.js
        if (!hasHydrated.current && status === "authenticated") {
            hasHydrated.current = true;
            fetchInitialData();
        }
    }, [fetchInitialData, status]);

    return null; // This component handles logic only, no UI
}
