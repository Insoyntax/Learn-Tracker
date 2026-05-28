"use client";

import { useState } from "react";

import { MatteCard } from "@/components/ui/MatteCard";
import { Map, Plus, Trash2, Star, Check, Filter } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { RoadmapBuilderModal } from "@/components/roadmaps/RoadmapBuilderModal";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function RoadmapsPage() {
    const roadmaps = useDashboardStore((s) => s.roadmaps);
    const categories = useDashboardStore((s) => s.categories);
    const activeRoadmapId = useDashboardStore((s) => s.activeRoadmapId);
    const setActiveRoadmap = useDashboardStore((s) => s.setActiveRoadmap);
    const deleteRoadmap = useDashboardStore((s) => s.deleteRoadmap);

    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredRoadmaps = selectedCategory === "All"
        ? roadmaps
        : roadmaps.filter(r => r.category === selectedCategory);

    const handleSetActive = (id: number) => {
        setActiveRoadmap(id);
        toast.success("Active roadmap updated!", {
            style: {
                background: "#1e1e2e",
                color: "#fff",
                border: "1px solid rgba(99, 102, 241, 0.3)",
            },
            icon: "⭐",
        });
    };

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this roadmap?")) {
            deleteRoadmap(id);
            toast("Roadmap deleted", { icon: "🗑️" });
        }
    };

    return (
        <>
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
                        Roadmaps
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Plan and track your learning journeys.
                    </p>
                </div>
                <button
                    onClick={() => setIsBuilderOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Roadmap</span>
                </button>
            </header>

            {/* Category Filter */}
            {roadmaps.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
                    <Filter className="w-4 h-4 text-gray-500 shrink-0" />
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${selectedCategory === "All"
                            ? "bg-white text-black border-white"
                            : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"
                            }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${selectedCategory === cat
                                ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                                : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Content Area */}
            {roadmaps.length === 0 ? (
                // Global Empty State
                <MatteCard className="p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/5"
                    >
                        <Map className="w-10 h-10 text-blue-400" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-white mb-2">No roadmaps yet</h2>
                    <p className="text-gray-500 text-sm max-w-md leading-relaxed mb-8">
                        Create your first learning roadmap to start tracking your progress. Define steps, set milestones, and level up.
                    </p>
                    <button
                        onClick={() => setIsBuilderOpen(true)}
                        className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 text-gray-300 transition-colors text-sm"
                    >
                        Create your first roadmap
                    </button>
                </MatteCard>
            ) : filteredRoadmaps.length === 0 ? (
                // Filter Empty State
                <MatteCard className="p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <p className="text-gray-500">No roadmaps found in <span className="text-white font-medium">"{selectedCategory}"</span>.</p>
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className="mt-4 text-indigo-400 text-sm hover:underline"
                    >
                        Clear filter
                    </button>
                </MatteCard>
            ) : (
                // Grid Layout
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredRoadmaps.map((roadmap) => (
                            <motion.div
                                key={roadmap.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MatteCard className="p-6 h-full flex flex-col group relative">
                                    {/* Active Badge */}
                                    {activeRoadmapId === roadmap.id && (
                                        <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/10 text-yellow-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400" />
                                            Active
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4 mt-2">
                                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/10">
                                            <Map className="w-6 h-6 text-blue-400" />
                                        </div>
                                        {activeRoadmapId !== roadmap.id && (
                                            <button
                                                onClick={(e) => handleDelete(roadmap.id, e)}
                                                className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Title & Category */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{roadmap.title}</h3>
                                        <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/5 uppercase tracking-wide">
                                            {roadmap.category}
                                        </span>
                                    </div>

                                    {/* Progress */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                                            <span>Progress</span>
                                            <span className="tabular-nums">{roadmap.progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                                initial={false}
                                                animate={{ width: `${roadmap.progress}%` }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {roadmap.steps.filter(s => s.isCompleted).length} / {roadmap.steps.length} steps completed
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-auto pt-4 border-t border-white/5">
                                        {activeRoadmapId === roadmap.id ? (
                                            <button disabled className="w-full py-2 rounded-lg bg-green-500/10 border border-green-500/10 text-green-400 text-xs font-medium flex items-center justify-center gap-2 cursor-default">
                                                <Check className="w-3 h-3" />
                                                Currently Active
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleSetActive(roadmap.id)}
                                                className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-300 text-xs font-medium transition-all flex items-center justify-center gap-2 group/btn"
                                            >
                                                <Star className="w-3 h-3 text-gray-500 group-hover/btn:text-yellow-400 transition-colors" />
                                                Set as Active
                                            </button>
                                        )}
                                    </div>
                                </MatteCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <AnimatePresence>
                {isBuilderOpen && (
                    <RoadmapBuilderModal onClose={() => setIsBuilderOpen(false)} />
                )}
            </AnimatePresence>
        </>
    );
}
