"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";

interface AddStudioTaskModalProps {
    onClose: () => void;
}

export const AddStudioTaskModal = ({ onClose }: AddStudioTaskModalProps) => {
    const categories = useDashboardStore((s) => s.categories);
    const addStudioTask = useDashboardStore((s) => s.addStudioTask);
    const accentColor = useDashboardStore((s) => s.settings.accentColor);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Custom Creatable Category logic
    const [category, setCategory] = useState(categories[0] || "General");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !category.trim()) return;

        addStudioTask({
            title: title.trim(),
            description: description.trim(),
            categoryId: category.trim(),
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-100">Add Task</h2>
                        <p className="text-sm text-slate-400">Add to your Creator Pipeline</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5 shrink-0">
                            Task Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Write Next.js Tutorial"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            autoFocus
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5 shrink-0">
                            Description <span className="text-slate-500 text-xs font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add brief details or links..."
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none h-24"
                        />
                    </div>

                    {/* Custom Category Dropdown */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-slate-300 mb-1.5 shrink-0">
                            Category
                        </label>
                        <div
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 cursor-pointer flex justify-between items-center hover:bg-slate-800 transition-colors"
                        >
                            <span>{category}</span>
                            <span className="text-slate-500 text-xs">▼</span>
                        </div>

                        {/* Dropdown Menu */}
                        {isCategoryOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden"
                            >
                                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                    {categories.map((cat) => (
                                        <div
                                            key={cat}
                                            onClick={() => {
                                                setCategory(cat);
                                                setIsCategoryOpen(false);
                                            }}
                                            className="px-4 py-2 hover:bg-white/5 cursor-pointer text-slate-300 hover:text-white transition-colors"
                                        >
                                            {cat}
                                        </div>
                                    ))}
                                    {categories.length === 0 && (
                                        <div className="px-4 py-3 text-slate-500 text-sm text-center italic">
                                            No categories yet
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border-t border-slate-700 bg-slate-800/80">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            placeholder="New Category..."
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
                                            onClick={(e) => e.stopPropagation()}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (newCategory.trim()) {
                                                        setCategory(newCategory.trim());
                                                        setNewCategory("");
                                                        setIsCategoryOpen(false);
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (newCategory.trim()) {
                                                    setCategory(newCategory.trim());
                                                    setNewCategory("");
                                                    setIsCategoryOpen(false);
                                                }
                                            }}
                                            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-semibold text-slate-300 hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-primary hover:opacity-90 text-white rounded-xl font-semibold shadow-lg transition-all active:scale-95"
                        >
                            Add Task
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
