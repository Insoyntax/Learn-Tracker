"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/useDashboardStore";
import { VirtualFamiliarOrb } from "@/components/dashboard/widgets/VirtualFamiliarOrb";
import { Sparkles, Code2, PenTool, Languages, BookOpen } from "lucide-react";

const FOCUS_OPTIONS = [
    { id: "Software Engineering", icon: Code2, label: "Software Engineering", color: "text-cyan-400" },
    { id: "Design", icon: PenTool, label: "Design", color: "text-rose-400" },
    { id: "Language", icon: Languages, label: "Language", color: "text-emerald-400" },
    { id: "General Studies", icon: BookOpen, label: "General Studies", color: "text-amber-400" }
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [focus, setFocus] = useState<string | null>(null);

    const handleFocusSelect = (id: string) => {
        setFocus(id);
        setTimeout(() => setStep(2), 500);
    };

    const handleAwaken = () => {
        setStep(3);
    };

    useEffect(() => {
        if (step === 3 && focus) {
            const seedData = async () => {
                try {
                    const res = await fetch('/api/onboarding/seed', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ focus })
                    });
                    const result = await res.json();
                    
                    if (result.success) {
                        const { roadmap, studioTasks, scheduleBlock } = result.data;
                        
                        // Inject into store directly
                        useDashboardStore.setState((state) => ({
                            roadmaps: [roadmap],
                            studioTasks: studioTasks,
                            plannedSessions: [scheduleBlock],
                            settings: { ...state.settings, hasCompletedOnboarding: true }
                        }));

                        // Small delay for the animation
                        setTimeout(() => {
                            router.push('/dashboard');
                        }, 2000);
                    }
                } catch (error) {
                    console.error("Failed to seed", error);
                    // Force through anyway
                    useDashboardStore.setState((state) => ({
                        settings: { ...state.settings, hasCompletedOnboarding: true }
                    }));
                    router.push('/dashboard');
                }
            };
            seedData();
        }
    }, [step, focus, router]);

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-2xl w-full relative z-10"
                    >
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-zinc-100 mb-4 tracking-tight">What is your main focus?</h1>
                            <p className="text-lg text-zinc-400">Choose a path to receive your personalized starter kit.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {FOCUS_OPTIONS.map((opt) => {
                                const Icon = opt.icon;
                                const isSelected = focus === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleFocusSelect(opt.id)}
                                        className={`group relative p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden
                                            ${isSelected 
                                                ? 'bg-white/10 border-cyan-500/50 scale-[1.02]' 
                                                : 'bg-[#1C1C1E] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl bg-white/5 ${opt.color}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-lg font-medium text-zinc-200 group-hover:text-white transition-colors">{opt.label}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step-2"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="flex flex-col items-center relative z-10 text-center max-w-md w-full"
                    >
                        <h2 className="text-3xl font-bold text-zinc-100 mb-2">Awaken your Familiar</h2>
                        <p className="text-zinc-400 mb-12">Your AI companion will guide you through your journey.</p>
                        
                        <div className="relative mb-12">
                            {/* Inactive state of orb */}
                            <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-zinc-700 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center animate-pulse">
                                <Sparkles className="w-8 h-8 text-zinc-600" />
                            </div>
                        </div>

                        <button 
                            onClick={handleAwaken}
                            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transform hover:-translate-y-1"
                        >
                            Ignite Core
                        </button>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center relative z-10 text-center"
                    >
                        <div className="scale-150 mb-12 relative">
                            <VirtualFamiliarOrb className="w-32 h-32" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-zinc-100 mb-2">Preparing your workspace...</h2>
                        <p className="text-zinc-400 animate-pulse">Generating tailored roadmaps and missions</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
