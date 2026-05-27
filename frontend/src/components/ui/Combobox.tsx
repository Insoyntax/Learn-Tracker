"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Search, Plus } from "lucide-react";

export interface Option {
    value: string;
    label: string;
}

export interface ComboboxProps {
    label: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    creatable?: boolean;
    placeholder?: string;
    icon?: React.ReactNode;
}

export const Combobox = ({ label, value, options, onChange, creatable = false, placeholder, icon }: ComboboxProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter options
    const filtered = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find(o => o.value === value)?.label || value;

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
        setSearch("");
    };

    return (
        <div className="space-y-1.5 relative" ref={containerRef}>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-slate-900 border ${isOpen ? 'border-indigo-500/50' : 'border-slate-700'} rounded-xl px-4 py-2.5 text-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors max-w-full overflow-hidden`}
            >
                <div className="flex items-center gap-2 truncate">
                    {icon && <span className="text-slate-500">{icon}</span>}
                    <span className={value ? "text-slate-100" : "text-slate-500"}>
                        {selectedLabel || placeholder || "Select..."}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[100] overflow-hidden"
                    >
                        {/* Search Input */}
                        <div className="p-2 border-b border-slate-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                                <input
                                    type="text"
                                    autoFocus
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={creatable ? "Search or create..." : "Search..."}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-600"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && creatable && search.trim()) {
                                            handleSelect(search.trim());
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Options List */}
                        <div className="max-h-48 overflow-y-auto p-1 custom-scrollbar">
                            {filtered.length === 0 && !creatable && (
                                <p className="px-3 py-4 text-center text-xs text-slate-500">No options found</p>
                            )}

                            {filtered.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-sm transition-colors ${value === opt.value
                                            ? "bg-indigo-500/20 text-indigo-400"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    <span className="truncate">{opt.label}</span>
                                    {value === opt.value && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                                </button>
                            ))}

                            {/* Create Option */}
                            {creatable && search.trim() && !filtered.some(o => o.label.toLowerCase() === search.toLowerCase()) && (
                                <button
                                    onClick={() => handleSelect(search.trim())}
                                    className="w-full text-left px-3 py-2 rounded-lg text-indigo-400 hover:bg-indigo-500/10 flex items-center gap-2 text-sm transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Create "{search}"</span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
