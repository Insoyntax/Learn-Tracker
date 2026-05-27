"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { PenTool, Sparkles, Save, Check, FileText, Trash2 } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import toast from "react-hot-toast";

export const QuickNoteWidget = ({ className }: { className?: string }) => {
    const { content, savedNotes, isSaved } = useDashboardStore((s) => s.quickNotes);
    const setNoteContent = useDashboardStore((s) => s.setNoteContent);
    const saveNote = useDashboardStore((s) => s.saveNote);

    const handleSave = () => {
        if (!content.trim()) return;
        saveNote();
        toast("📝 Note saved!", {
            duration: 2000,
            style: {
                background: "#1e1e2e",
                color: "#fff",
                border: "1px solid rgba(16, 185, 129, 0.3)",
            },
            icon: "✅",
        });
    };

    return (
        <GlassCard className={`p-6 flex flex-col h-full ${className}`}>
            {/* Eyebrow */}
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">✍️ Quick Jots</p>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/10">
                        <PenTool className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-white tracking-tight">📝 Quick Notes</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-[10px] flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/10">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Assist</span>
                    </button>
                    <AnimatePresence mode="wait">
                        {isSaved ? (
                            <motion.div
                                key="saved"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/10"
                            >
                                <Check className="w-3 h-3" />
                                <span>Saved!</span>
                            </motion.div>
                        ) : (
                            content.trim() && (
                                <motion.button
                                    key="save"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={handleSave}
                                    className="flex items-center gap-1 text-[10px] text-white bg-indigo-500 hover:bg-indigo-400 px-2.5 py-1 rounded-full transition-colors"
                                >
                                    <Save className="w-3 h-3" />
                                    <span>Save</span>
                                </motion.button>
                            )
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Main content area — textarea and saved notes side by side */}
            <div className="flex gap-4 flex-1 min-h-0">
                {/* Textarea */}
                <div className="relative flex-1 group">
                    <textarea
                        value={content}
                        onChange={(e) => setNoteContent(e.target.value)}
                        className="w-full h-full min-h-[80px] bg-transparent text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none resize-none leading-relaxed font-mono"
                        placeholder="# jot down ideas..."
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-xl border border-white/5 group-focus-within:border-indigo-500/30 transition-colors" />
                </div>

                {/* Saved notes list */}
                {savedNotes.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-48 flex flex-col border-l border-white/5 pl-4"
                    >
                        <div className="flex items-center gap-1.5 mb-2">
                            <FileText className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                Saved ({savedNotes.length})
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                            {savedNotes.map((note, idx) => (
                                <motion.div
                                    key={`${idx}-${note.slice(0, 10)}`}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group/note p-2 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors"
                                >
                                    <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2 font-mono">
                                        {note}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-3 flex justify-between items-center">
                <span className="text-[10px] text-gray-600 font-mono">markdown supported</span>
                <motion.span
                    key={content.length}
                    initial={{ color: "#6366f1" }}
                    animate={{ color: "#525252" }}
                    transition={{ duration: 0.3 }}
                    className="text-[10px] font-mono tabular-nums"
                >
                    {content.length} chars
                </motion.span>
            </div>
        </GlassCard>
    );
};
