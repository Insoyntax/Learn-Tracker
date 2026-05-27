import { signIn } from "@/auth";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md overflow-hidden relative">
                
                {/* Visual Glass Effect Gradients */}
                <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />

                <div className="relative z-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 mb-4">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Learn Tracker</h1>
                    <p className="mt-2 text-sm text-gray-400">
                        Turn self-learning into a game you want to keep playing.
                    </p>
                </div>
                
                <form
                    className="relative z-10"
                    action={async () => {
                        "use server"
                        // Trigger Auth.js GitHub provider, redirect to dashboard upon success
                        await signIn("github", { redirectTo: "/" })
                    }}
                >
                    <button
                        type="submit"
                        className="group flex w-full items-center justify-center gap-3 rounded-xl bg-white/10 px-4 py-3 font-semibold text-white transition-all hover:bg-white hover:text-black border border-white/10"
                    >
                        <svg className="h-5 w-5 fill-current text-white group-hover:text-black transition-colors" viewBox="0 0 24 24">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                        Sign in with GitHub
                    </button>
                    
                    <p className="mt-6 text-center text-xs text-gray-500">
                        Demo Mode: Any GitHub account can be used to log in. <br />
                        Your stats will be tied to your GitHub ID.
                    </p>
                </form>
            </div>
        </div>
    );
}
