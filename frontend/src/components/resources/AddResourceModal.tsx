"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save, AlertCircle, Link as LinkIcon } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Combobox } from "@/components/ui/Combobox";
import toast from "react-hot-toast";

interface AddResourceModalProps {
    onClose: () => void;
}

export const AddResourceModal = ({ onClose }: AddResourceModalProps) => {
    const addResource = useDashboardStore((s) => s.addResource);
    const categories = useDashboardStore((s) => s.categories);
    const resourceTypes = useDashboardStore((s) => s.resourceTypes);
    const roadmaps = useDashboardStore((s) => s.roadmaps);

    // Form State
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [type, setType] = useState<string>("Article"); // Keep default type as it's a fixed list usually, or make empty? user said purge categories. Types are different. I'll keep Article.
    const [category, setCategory] = useState(""); // Default empty
    const [roadmapId, setRoadmapId] = useState<string>("");

    const [error, setError] = useState("");

    const handleSave = () => {
        if (!title.trim()) { setError("Title is required"); return; }
        if (!url.trim()) { setError("URL is required"); return; }
        if (!category.trim()) { setError("Category is required"); return; }

        addResource({
            title,
            url,
            type,
            category,
            roadmapId: (roadmapId && roadmapId !== "none") ? Number(roadmapId) : undefined,
        });

        toast.success("Resource saved!", {
            style: { background: "#1e1e2e", color: "#fff" },
            icon: "📚"
        });
        onClose();
    };

    // Prepare Options
    const categoryOptions = categories.map(c => ({ value: c, label: c }));
    const typeOptions = resourceTypes.map(t => ({ value: t, label: t }));
    const roadmapOptions = [
        { value: "none", label: "None" },
        ...roadmaps.map(r => ({ value: r.id.toString(), label: r.title }))
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative z-10 w-full max-w-lg bg-[#0f1117] border border-slate-800 rounded-2xl shadow-2xl overflow-visible"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-white">Add Resource</h2>
                        <p className="text-sm text-slate-400">Save it now, master it later.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* URL Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">URL</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://..."
                                autoFocus
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Title Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Advanced React Patterns"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Type Custom Dropdown */}
                        <Combobox
                            label="Type"
                            value={type}
                            options={typeOptions}
                            onChange={setType}
                            creatable
                            placeholder="Select Type"
                        />

                        {/* Roadmap Custom Dropdown */}
                        <Combobox
                            label="Link to Roadmap"
                            value={roadmapId}
                            options={roadmapOptions}
                            onChange={setRoadmapId}
                            placeholder="Select Roadmap"
                        />
                    </div>

                    {/* Category Custom Dropdown */}
                    <Combobox
                        label="Category"
                        value={category}
                        options={categoryOptions}
                        onChange={setCategory}
                        creatable
                        placeholder="Search or type to create..."
                    />

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/10"
                        >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </motion.div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                    <button
                        onClick={handleSave}
                        className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        Add Resource
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
