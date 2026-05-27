"use client";


import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { useDashboardStore } from "@/store/useDashboardStore";

export default function Home() {
  const streak = useDashboardStore((s) => s.userStats.streak);
  const level = useDashboardStore((s) => s.userStats.level);

  return (
    <>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Welcome back, Student. You&apos;re on a <span className="text-orange-400 font-medium">{streak}-day streak</span> at <span className="text-indigo-400 font-medium">Level {level}</span>.
          </p>
        </div>
      </header>

      <DashboardGrid />
    </>
  );
}
