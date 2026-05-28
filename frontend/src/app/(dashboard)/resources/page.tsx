"use client";

import { useState } from "react";

import { MatteCard } from "@/components/ui/MatteCard";
import {
    BookOpen, Plus, Trash2, CheckCircle2, Circle,
    Filter, ExternalLink, Video, FileText, Github, Link as LinkIcon
} from "lucide-react";
import { useDashboardStore, Resource, ResourceType } from "@/store/useDashboardStore";
import { AddResourceModal } from "@/components/resources/AddResourceModal";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

type FilterStatus = "All" | "To Read" | "Read";

export default function ResourcesPage() {
    const resources = useDashboardStore((s) => s.resources);
    const categories = useDashboardStore((s) => s.categories);
    const roadmaps = useDashboardStore((s) => s.roadmaps);
    const deleteResource = useDashboardStore((s) => s.deleteResource);
    const toggleResourceConsumed = useDashboardStore((s) => s.toggleResourceConsumed);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
    const [categoryFilter, setCategoryFilter] = useState("All");

    // Filter Logic
    const filteredResources = resources.filter(r => {
        const matchesCategory = categoryFilter === "All" || r.category === categoryFilter;
        const matchesStatus = statusFilter === "All"
            || (statusFilter === "To Read" && !r.isConsumed)
            || (statusFilter === "Read" && r.isConsumed);
        return matchesCategory && matchesStatus;
    });

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Delete this resource?")) {
            deleteResource(id);
            toast("Resource deleted", { icon: "🗑️" });
        }
    };

    const handleToggle = (r: Resource) => {
        toggleResourceConsumed(r.id);
        if (!r.isConsumed) {
            toast.success(`+15 XP: Consumed ${r.type}!`, {
                icon: "🎓",
                style: { background: "#1e1e2e", color: "#fff" }
            });
        }
    };

    const getTypeIcon = (t: ResourceType) => {
        switch (t) {
            case "Video": return <Video className="w-4 h-4 text-red-400" />;
            case "Repo": return <Github className="w-4 h-4 text-white" />;
            case "Documentation": return <BookOpen className="w-4 h-4 text-orange-400" />;
            default: return <FileText className="w-4 h-4 text-blue-400" />;
        }
    };

    const getRoadmapName = (id?: number) => {
        if (!id) return null;
        return roadmaps.find(r => r.id === id)?.title;
    };

    return (
        <>
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
                        Resource Hub
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Curate and track your learning materials.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Resource</span>
                </button>
            </header>

            {/* Filters */}
            <div className="flex flex-col gap-4 mb-6">
                {/* Status Tabs */}
                <div className="flex p-1 bg-white/5 rounded-xl w-fit">
                    {(["All", "To Read", "Read"] as FilterStatus[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === status
                                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Category Tags */}
                {resources.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <Filter className="w-4 h-4 text-gray-500 shrink-0" />
                        <button
                            onClick={() => setCategoryFilter("All")}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${categoryFilter === "All"
                                ? "bg-white text-black border-white"
                                : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"
                                }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${categoryFilter === cat
                                    ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                                    : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            {resources.length === 0 ? (
                // Global Empty State
                <MatteCard className="p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/5"
                    >
                        <BookOpen className="w-10 h-10 text-indigo-400" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-white mb-2">Build your library</h2>
                    <p className="text-gray-500 text-sm max-w-md leading-relaxed mb-8">
                        Save articles, videos, and documentation. Mark them as done to earn XP and track your knowledge growth.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 text-gray-300 transition-colors text-sm"
                    >
                        Add your first resource
                    </button>
                </MatteCard>
            ) : filteredResources.length === 0 ? (
                // Filter Empty State
                <MatteCard className="p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <p className="text-gray-500">No resources matches your filters.</p>
                    <button
                        onClick={() => {
                            setStatusFilter("All");
                            setCategoryFilter("All");
                        }}
                        className="mt-4 text-indigo-400 text-sm hover:underline"
                    >
                        Clear filters
                    </button>
                </MatteCard>
            ) : (
                // Grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredResources.map((r) => (
                            <motion.div
                                key={r.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MatteCard className={`p-4 h-full flex flex-col relative group transition-colors ${r.isConsumed ? "opacity-60 hover:opacity-100" : ""}`}>

                                    {/* Top Row: Icon & Delete */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                                {getTypeIcon(r.type)}
                                            </div>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-white/5 px-2 py-1 rounded">
                                                {r.category}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(r.id, e)}
                                            className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Title */}
                                    <div className="flex-1 mb-4">
                                        <a
                                            href={r.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm font-medium text-white hover:text-indigo-400 transition-colors line-clamp-2 flex gap-1 items-start"
                                        >
                                            {r.title}
                                            <ExternalLink className="w-3 h-3 shrink-0 opacity-50 relative top-0.5" />
                                        </a>
                                        {r.roadmapId && getRoadmapName(r.roadmapId) && (
                                            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-indigo-400/80">
                                                <LinkIcon className="w-3 h-3" />
                                                <span className="truncate max-w-[150px]">
                                                    {getRoadmapName(r.roadmapId)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                        <button
                                            onClick={() => handleToggle(r)}
                                            className={`flex items-center gap-2 text-xs font-medium transition-colors ${r.isConsumed ? "text-green-400" : "text-gray-400 hover:text-white"
                                                }`}
                                        >
                                            {r.isConsumed ? (
                                                <CheckCircle2 className="w-4 h-4 fill-green-500/10" />
                                            ) : (
                                                <Circle className="w-4 h-4" />
                                            )}
                                            {r.isConsumed ? "Completed" : "Mark as Done"}
                                        </button>
                                    </div>
                                </MatteCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <AddResourceModal onClose={() => setIsModalOpen(false)} />
                )}
            </AnimatePresence>
        </>
    );
}
