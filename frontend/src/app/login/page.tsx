"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MatteCard } from "@/components/ui/MatteCard";
import { ArrowRight, Lock, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        if (!username || !password) {
            toast.error("Username and password are required.");
            setIsLoading(false);
            return;
        }

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Invalid username or password.");
            } else {
                toast.success("Welcome back!");
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            toast.error("Network error occurred.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

            <Link href="/" className="flex items-center gap-2 mb-8 z-10 group">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                    S
                </div>
                <span className="font-semibold tracking-tight text-lg text-zinc-100">Sinau.id</span>
            </Link>

            <MatteCard className="w-full max-w-sm p-8 z-10">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Welcome back</h1>
                    <p className="text-sm text-zinc-400 mt-2">Log in to your dashboard.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
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
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log In"}
                        {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-zinc-400">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </MatteCard>
        </main>
    );
}
