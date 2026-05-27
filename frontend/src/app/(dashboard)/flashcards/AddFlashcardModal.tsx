"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Tag } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";

export const AddFlashcardModal = ({ onClose }: { onClose: () => void }) => {
    const addFlashcard = useDashboardStore((s) => s.addFlashcard);
    const categories = useDashboardStore((s) => s.categories);

    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    // Category selection state
    const [category, setCategory] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const categoryRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCategories = categories.filter((c) =>
        c.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const handleSave = () => {
        if (!front.trim() || !back.trim() || !category.trim()) return;

        addFlashcard({
            front: front.trim(),
            back: back.trim(),
            categoryId: category.trim(),
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
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
                className="relative w-full max-w-lg bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            ✨ New Flashcard
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-5">
                        {/* Front Content */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                                Front (Question)
                            </label>
                            <textarea
                                value={front}
                                onChange={(e) => setFront(e.target.value)}
                                placeholder="What is the concept?"
                                className="w-full bg-[#161821] border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none h-24"
                            />
                        </div>

                        {/* Back Content */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                                Back (Answer)
                            </label>
                            <textarea
                                value={back}
                                onChange={(e) => setBack(e.target.value)}
                                placeholder="Explain the concept clearly..."
                                className="w-full bg-[#161821] border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none h-32"
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="relative" ref={categoryRef}>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                                Category
                            </label>
                            <div
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                className="w-full bg-[#161821] border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-100 cursor-pointer flex items-center justify-between hover:border-slate-600 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-slate-400" />
                                    <span className={category ? "text-slate-100" : "text-slate-500"}>
                                        {category || "Select or create category..."}
                                    </span>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isCategoryOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute z-10 w-full mt-2 bg-[#161821] border border-slate-700 rounded-xl shadow-xl overflow-hidden"
                                    >
                                        <div className="p-2 border-b border-slate-700/50">
                                            <input
                                                type="text"
                                                value={categorySearch}
                                                onChange={(e) => setCategorySearch(e.target.value)}
                                                placeholder="Search or type new category..."
                                                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 px-2 py-1 focus:outline-none"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                                            {filteredCategories.map((c) => (
                                                <button
                                                    key={c}
                                                    onClick={() => {
                                                        setCategory(c);
                                                        setIsCategoryOpen(false);
                                                        setCategorySearch("");
                                                    }}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === c
                                                            ? "bg-primary/20 text-primary"
                                                            : "text-slate-300 hover:bg-white/5"
                                                        }`}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                            {categorySearch && !categories.includes(categorySearch) && (
                                                <button
                                                    onClick={() => {
                                                        setCategory(categorySearch);
                                                        setIsCategoryOpen(false);
                                                        setCategorySearch("");
                                                    }}
                                                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-primary hover:bg-primary/10 transition-colors"
                                                >
                                                    Create "{categorySearch}"
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors hover:bg-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!front.trim() || !back.trim() || !category.trim()}
                            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-[0_0_15px_var(--primary-glow)] hover:shadow-[0_0_25px_var(--primary-glow)]"
                        >
                            <Save className="w-4 h-4" />
                            Save Flashcard
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
