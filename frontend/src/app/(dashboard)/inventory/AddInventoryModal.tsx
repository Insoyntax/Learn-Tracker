import { useState } from "react";
import { X, Archive, FileText, Code, Link as LinkIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useDashboardStore } from "@/store/useDashboardStore";
import CreatableSelect from 'react-select/creatable';
import { StylesConfig, SingleValue } from 'react-select';

interface OptionType {
    value: string;
    label: string;
}

interface AddInventoryModalProps {
    onClose: () => void;
}

export const AddInventoryModal = ({ onClose }: AddInventoryModalProps) => {
    const addInventoryItem = useDashboardStore((s) => s.addInventoryItem);
    const existingCategories = useDashboardStore((s) => s.categories);

    const [title, setTitle] = useState("");
    const [type, setType] = useState<'code' | 'text' | 'link'>('code');
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");

    const categoryOptions = existingCategories.map(cat => ({ value: cat, label: cat }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !category) return;

        addInventoryItem({
            title,
            type,
            content,
            categoryId: category
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <GlassCard className="w-full max-w-2xl p-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Archive className="w-5 h-5 text-indigo-400" />
                        Add to Inventory
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Item Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="e.g., Python Setup Script"
                        />
                    </div>

                    {/* Type & Category Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Asset Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setType('code')}
                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${type === 'code'
                                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Code className="w-4 h-4" /> Code
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('text')}
                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${type === 'text'
                                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <FileText className="w-4 h-4" /> Text
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('link')}
                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${type === 'link'
                                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <LinkIcon className="w-4 h-4" /> Link
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Category Tag</label>
                            <CreatableSelect<OptionType>
                                options={categoryOptions}
                                onChange={(newValue: SingleValue<OptionType>) => setCategory(newValue?.value || '')}
                                placeholder="Select or type..."
                                className="react-select-container shadow-xl"
                                classNamePrefix="react-select"
                                styles={{
                                    control: (base: any, state: any) => ({
                                        ...base,
                                        background: 'rgba(0,0,0,0.5)',
                                        borderColor: state.isFocused ? '#6366f1' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '0.75rem',
                                        padding: '4px',
                                        boxShadow: state.isFocused ? '0 0 0 1px #6366f1' : 'none',
                                        '&:hover': {
                                            borderColor: state.isFocused ? '#6366f1' : 'rgba(255,255,255,0.2)'
                                        }
                                    }),
                                    menu: (base: any) => ({
                                        ...base,
                                        background: '#18181b', // zinc-900
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '0.75rem',
                                        overflow: 'hidden',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                                    }),
                                    option: (base: any, state: any) => ({
                                        ...base,
                                        backgroundColor: state.isFocused ? 'rgba(99,102,241,0.2)' : 'transparent',
                                        color: state.isFocused ? '#fff' : '#d1d5db',
                                        cursor: 'pointer',
                                        '&:active': {
                                            backgroundColor: 'rgba(99,102,241,0.4)'
                                        }
                                    }),
                                    singleValue: (base: any) => ({
                                        ...base,
                                        color: '#fff'
                                    }),
                                    input: (base: any) => ({
                                        ...base,
                                        color: '#fff'
                                    })
                                } as StylesConfig<OptionType>}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5 flex justify-between">
                            <span>{type === 'link' ? 'URL' : 'Content'}</span>
                            <span className="text-xs text-gray-500 font-normal">
                                {type === 'code' ? 'Markdown syntax not required' : ''}
                            </span>
                        </label>
                        <textarea
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={type === 'link' ? 1 : 8}
                            className={`w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${type === 'code' ? 'font-mono text-sm' : ''
                                }`}
                            placeholder={
                                type === 'code' ? "Paste your code snippet here..." :
                                    type === 'link' ? "https://..." :
                                        "Type your text asset here..."
                            }
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!title || !content || !category}
                            className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                        >
                            Save Item
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};
