"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Archive, Plus, Trash2, Code, FileText, Link as LinkIcon, Copy, Check } from "lucide-react";
import { useDashboardStore, InventoryItem } from "@/store/useDashboardStore";
import { MatteCard } from "@/components/ui/MatteCard";
import { AddInventoryModal } from "./AddInventoryModal";
import toast from "react-hot-toast";

export default function InventoryPage() {
    const inventoryItems = useDashboardStore((s) => s.inventoryItems);
    const deleteInventoryItem = useDashboardStore((s) => s.deleteInventoryItem);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = async (id: string, content: string) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
            toast.success("Copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy");
        }
    };

    const getIcon = (type: InventoryItem['type']) => {
        switch (type) {
            case 'code': return <Code className="w-5 h-5 text-indigo-400" />;
            case 'text': return <FileText className="w-5 h-5 text-blue-400" />;
            case 'link': return <LinkIcon className="w-5 h-5 text-emerald-400" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
                        <Archive className="w-8 h-8 text-indigo-500" />
                        The Vault
                    </h1>
                    <p className="text-gray-400 text-sm">Your personal inventory of code snippets, text assets, and links.</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-105"
                >
                    <Plus className="w-4 h-4" />
                    Add Item
                </button>
            </header>

            {inventoryItems.length === 0 ? (
                <MatteCard className="p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/5"
                    >
                        <Archive className="w-10 h-10 text-indigo-400" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-white mb-2">Your Vault is empty</h2>
                    <p className="text-gray-500 text-sm max-w-md leading-relaxed mb-8">
                        Store reusable code snippets, important links, and text notes here. They'll be instantly accessible from your dashboard.
                    </p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 text-gray-300 transition-colors text-sm"
                    >
                        Store your first asset
                    </button>
                </MatteCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {inventoryItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MatteCard className="h-[350px] flex flex-col group relative overflow-hidden flex-1 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-indigo-500/30 transition-all">

                                    {/* Header */}
                                    <div className="p-5 border-b border-white/5 bg-black/20">
                                        <div className="flex justify-between items-start gap-4 mb-3">
                                            <div className="flex items-start gap-3 overflow-hidden">
                                                <div className="p-2 rounded-lg bg-white/5 shrink-0 mt-0.5">
                                                    {getIcon(item.type)}
                                                </div>
                                                <h3 className="font-bold text-lg text-white line-clamp-2 leading-tight" title={item.title}>
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteInventoryItem(item.id); }}
                                                className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-medium tracking-wide">
                                            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 truncate max-w-[150px] uppercase">
                                                {item.categoryId}
                                            </span>
                                            <span className="text-gray-500">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 p-5 overflow-hidden">
                                        {item.type === 'code' ? (
                                            <div className="h-full relative group/code bg-[#0d1117] rounded-xl border border-white/5 shadow-inner overflow-hidden">
                                                <pre className="h-full w-full overflow-auto p-4 text-xs font-mono text-gray-300 custom-scrollbar">
                                                    <code>{item.content}</code>
                                                </pre>
                                            </div>
                                        ) : item.type === 'link' ? (
                                            <div className="h-full flex items-center justify-center">
                                                <a
                                                    href={item.content.startsWith('http') ? item.content : `https://${item.content}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full text-center text-emerald-400 hover:text-emerald-300 hover:underline px-4 p-4 bg-emerald-500/10 rounded-xl"
                                                >
                                                    <span className="line-clamp-2 break-all">{item.content}</span>
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="h-full overflow-auto custom-scrollbar p-2">
                                                <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                                    {item.content}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Bar */}
                                    <div className="p-5 border-t border-white/5 bg-black/10">
                                        <button
                                            onClick={() => handleCopy(item.id, item.content)}
                                            className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${copiedId === item.id
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5 hover:border-white/10 group-hover:bg-indigo-500/10 group-hover:text-indigo-300 group-hover:border-indigo-500/20'
                                                }`}
                                        >
                                            {copiedId === item.id ? (
                                                <>
                                                    <Check className="w-4 h-4" /> Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" /> Copy to Clipboard
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </MatteCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <AnimatePresence>
                {isAddModalOpen && <AddInventoryModal onClose={() => setIsAddModalOpen(false)} />}
            </AnimatePresence>
        </div>
    );
}
