"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save, AlertCircle, Calendar, Clock, FileText } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { Combobox } from "@/components/ui/Combobox";
import toast from "react-hot-toast";

interface ManualLogModalProps {
    onClose: () => void;
}

export const ManualLogModal = ({ onClose }: ManualLogModalProps) => {
    const addStudyLog = useDashboardStore((s) => s.addStudyLog);
    const categories = useDashboardStore((s) => s.categories);

    // Form State
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [duration, setDuration] = useState("30");
    const [category, setCategory] = useState(""); // Clean default
    const [notes, setNotes] = useState("");

    const [error, setError] = useState("");

    const handleSave = () => {
        if (!date) { setError("Date is required"); return; }
        if (!duration || Number(duration) <= 0) { setError("Valid duration is required"); return; }
        if (!category) { setError("Category is required"); return; }

        addStudyLog({
            date: new Date(date).toISOString(),
            durationMinutes: Number(duration),
            category,
            notes,
            type: 'manual'
        });

        toast.success("Study session logged!", {
            style: { background: "#1e1e2e", color: "#fff" },
            icon: "📝"
        });
        onClose();
    };

    const categoryOptions = categories.map(c => ({ value: c, label: c }));

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
                        <h2 className="text-xl font-bold text-white">Log Study Session</h2>
                        <p className="text-sm text-slate-400">Track your offline learning.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Date Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500/50 transition-colors calendar-picker-indicator:invert"
                                />
                            </div>
                        </div>

                        {/* Duration Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Duration (min)</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    min="1"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category Dropdown */}
                    <Combobox
                        label="Category"
                        value={category}
                        options={categoryOptions}
                        onChange={setCategory}
                        creatable
                        placeholder="Search or type to create..."
                    />

                    {/* Notes Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Session Reflection / Notes</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="What did you learn today?"
                                rows={3}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
                            />
                        </div>
                    </div>

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
                        Save Session
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
