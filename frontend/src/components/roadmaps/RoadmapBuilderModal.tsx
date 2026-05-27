"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Save, AlertCircle, Sparkles } from "lucide-react";
import { useDashboardStore, Step } from "@/store/useDashboardStore";
import { Combobox } from "@/components/ui/Combobox";
import toast from "react-hot-toast";

interface RoadmapBuilderModalProps {
    onClose: () => void;
}

export const RoadmapBuilderModal = ({ onClose }: RoadmapBuilderModalProps) => {
    const createRoadmap = useDashboardStore((s) => s.createRoadmap);
    const existingCategories = useDashboardStore((s) => s.categories);

    // Form State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(""); // Start empty

    // Steps State
    const [steps, setSteps] = useState<Omit<Step, "id" | "isCompleted">[]>([
        { title: "" },
        { title: "" },
        { title: "" },
    ]);
    const [error, setError] = useState("");

    // Prepare options for Combobox
    const categoryOptions = existingCategories.map(c => ({ label: c, value: c }));

    const handleAddStep = () => {
        setSteps([...steps, { title: "" }]);
    };

    const handleRemoveStep = (index: number) => {
        const newSteps = [...steps];
        newSteps.splice(index, 1);
        setSteps(newSteps);
    };

    const handleStepChange = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index].title = value;
        setSteps(newSteps);
    };

    const handleSave = () => {
        // Validation
        if (!title.trim()) {
            setError("Please enter a roadmap title");
            return;
        }
        if (!category.trim()) {
            setError("Please select or create a category");
            return;
        }

        const validSteps = steps.filter(s => s.title.trim() !== "");
        if (validSteps.length === 0) {
            setError("Please add at least one step");
            return;
        }

        // Create Roadmap
        const newSteps: Step[] = validSteps.map((s, idx) => ({
            id: idx + 1,
            title: s.title,
            isCompleted: false,
        }));

        createRoadmap({
            title,
            category: category.trim(),
            steps: newSteps,
        });

        toast.success("Roadmap created successfully!");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-over Panel */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative z-10 w-full max-w-md h-full bg-[#0f1117] border-l border-white/10 shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            New Roadmap <Sparkles className="w-4 h-4 text-indigo-400" />
                        </h2>
                        <p className="text-sm text-gray-400">Design your learning path</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Roadmap Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setError("");
                            }}
                            placeholder="e.g., Mastering React"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                    </div>

                    {/* Dynamic Category Input via Combobox */}
                    <Combobox
                        label="Category"
                        value={category}
                        options={categoryOptions}
                        onChange={setCategory}
                        creatable
                        placeholder="Search or type to create..."
                    />

                    {/* Steps Builder */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-300">Steps</label>
                            <span className="text-xs text-gray-500">{steps.length} steps</span>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence initial={false}>
                                {steps.map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono text-gray-500 shrink-0">
                                            {idx + 1}
                                        </div>
                                        <input
                                            type="text"
                                            value={step.title}
                                            onChange={(e) => handleStepChange(idx, e.target.value)}
                                            placeholder={`Step ${idx + 1}`}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                        />
                                        <button
                                            onClick={() => handleRemoveStep(idx)}
                                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            disabled={steps.length <= 1}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={handleAddStep}
                            className="w-full py-2 flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Add Step
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/10"
                        >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </motion.div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-[#0f1117]/80 backdrop-blur-xl">
                    <button
                        onClick={handleSave}
                        className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        Create Roadmap
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
