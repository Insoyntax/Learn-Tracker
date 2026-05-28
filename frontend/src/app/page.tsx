import Link from "next/link";
import { ArrowRight, BookOpen, Layers, ShieldCheck } from "lucide-react";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-[#121212] text-zinc-100 flex flex-col items-center justify-center overflow-hidden relative">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
            
            <nav className="absolute top-0 w-full px-8 py-6 flex items-center justify-between z-10 border-b border-white/5 bg-[#121212]/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-xl">
                        S
                    </div>
                    <span className="font-semibold tracking-tight text-lg">Sinau.id</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
                        Log in
                    </Link>
                    <Link href="/signup" className="text-sm font-medium px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-colors">
                        Sign up
                    </Link>
                </div>
            </nav>

            <section className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-medium tracking-wide text-zinc-300">The next-gen learning environment</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                    Master any skill with <br />
                    <span className="shimmer-text">professional structure.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Sinau.id merges professional LMS architecture with subtle gamification to keep you focused, organized, and consistently leveling up.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                    <Link href="/signup" className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-zinc-100 text-zinc-950 font-semibold text-base hover:bg-zinc-200 transition-all shadow-lg shadow-zinc-100/10">
                        Get Started Free
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="#features" className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 font-semibold text-base hover:bg-white/10 transition-colors text-zinc-300">
                        Explore Features
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="w-full max-w-5xl mx-auto px-6 py-24 border-t border-white/5 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-2xl bg-[#1C1C1E] border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-6">
                        <Layers className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Professional LMS</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        Structure your learning with a proper weekly schedule, Kanban homework boards, and detailed roadmaps.
                    </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#1C1C1E] border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-rose-400/10 flex items-center justify-center mb-6">
                        <ShieldCheck className="w-6 h-6 text-rose-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Gamified Progression</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        Earn XP, build streaks, and level up your virtual familiar as you complete real-world study sessions.
                    </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#1C1C1E] border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center mb-6">
                        <BookOpen className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Skill Tracking</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        Monitor your focus time, track subject mastery through detailed analytics, and visualize your progress daily.
                    </p>
                </div>
            </section>
        </main>
    );
}
