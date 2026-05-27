"use client";

import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { useDashboardStore } from "@/store/useDashboardStore";

export default function Home() {
  const streak = useDashboardStore((s) => s.userStats.streak);
  const level = useDashboardStore((s) => s.userStats.level);

  return (
    <>
      <header className="mb-10 flex justify-between items-end border-b-2 border-white/20 pb-6">
        <div>
          <h1 className="text-4xl font-Outfit font-bold text-white tracking-tighter uppercase">
            Command Center
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-Inter font-bold">
            Welcome back, Operator. You're on a <span className="text-accent bg-accent/10 px-1 py-0.5 border border-accent">{streak}-day streak</span> at <span className="text-primary bg-primary/10 px-1 py-0.5 border border-primary">Level {level}</span>.
          </p>
        </div>
      </header>

      <DashboardGrid />
    </>
  );
}
