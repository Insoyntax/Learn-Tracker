"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MatteCard } from "@/components/ui/MatteCard";
import { ArrowRight, Lock, User, Mail, Calendar, Briefcase, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            username: formData.get("username"),
            birthdate: formData.get("birthdate"),
            role: formData.get("role"),
            password: formData.get("password"),
        };

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await res.json();
            if (res.ok) {
                toast.success(json.message || "Account created successfully.");
                router.push("/login");
            } else {
                toast.error(json.message || "Failed to create account.");
            }
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

            <Link href="/" className="flex items-center gap-2 mb-8 z-10 group">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                    S
                </div>
                <span className="font-semibold tracking-tight text-lg text-zinc-100">Sinau.id</span>
            </Link>

            <MatteCard className="w-full max-w-md p-8 z-10">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Create your account</h1>
                    <p className="text-sm text-zinc-400 mt-2">Start your structured learning journey today.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Username</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                name="username"
                                type="text"
                                required
                                className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                placeholder="johndoe"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Birthdate</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    name="birthdate"
                                    type="date"
                                    className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Role</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <select
                                    name="role"
                                    required
                                    className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-8 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none"
                                >
                                    <option value="">Select Role...</option>
                                    <option value="School/University">School/University</option>
                                    <option value="Career Switcher">Career Switcher</option>
                                    <option value="Lifelong Learner">Lifelong Learner</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-100 text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Up"}
                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-zinc-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                            Log in here
                        </Link>
                    </p>
                </div>
            </MatteCard>
        </main>
    );
}
