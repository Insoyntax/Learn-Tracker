"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen, User, Lock, Calendar, School, Award, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [school, setSchool] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Username dan password wajib diisi!");
      return;
    }

    setLoading(true);
    const loadToast = toast.loading("Memverifikasi kredensial...");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      toast.dismiss(loadToast);

      if (result?.error) {
        toast.error("Username atau password salah!");
      } else {
        toast.success("Selamat datang kembali!");
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      toast.dismiss(loadToast);
      toast.error("Terjadi kesalahan jaringan!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !password || !school || !birthdate) {
      toast.error("Semua formulir wajib diisi!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal harus 6 karakter!");
      return;
    }

    setLoading(true);
    const loadToast = toast.loading("Mendaftarkan akun baru...");

    try {
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          birthdate,
          school,
          username,
          password,
        }),
      });

      const data = await res.json();
      toast.dismiss(loadToast);

      if (!res.ok) {
        toast.error(data.message || "Registrasi gagal!");
      } else {
        toast.success("Pendaftaran sukses! Silakan login.");
        // Otomatis login setelah pendaftaran sukses
        const loginResult = await signIn("credentials", {
          username,
          password,
          redirect: false,
        });

        if (!loginResult?.error) {
          router.push("/");
          router.refresh();
        } else {
          // Jika auto-login gagal, alihkan ke form login
          setIsSignUp(false);
        }
      }
    } catch (err) {
      toast.dismiss(loadToast);
      toast.error("Gagal terhubung ke server!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0a0a14] relative overflow-hidden font-sans">
      
      {/* Background Neon Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 h-[30rem] w-[30rem] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-[30rem] w-[30rem] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none animate-pulse" />

      {/* Main Container */}
      <div className="w-full max-w-lg space-y-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10 backdrop-blur-xl relative shadow-2xl transition-all duration-500 hover:border-white/20">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-40 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

        {/* Logo / Header */}
        <div className="relative z-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/20 mb-5 relative group">
            <BookOpen className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-purple-400 animate-bounce" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
            Learn Tracker
          </h1>
          <p className="mt-2 text-sm text-gray-400 max-w-sm mx-auto">
            {isSignUp 
              ? "Daftarkan akunmu dan ubah proses belajar mandiri menjadi sebuah game RPG yang adiktif!"
              : "Masuk untuk melanjutkan petualangan belajarmu dan raih XP harianmu!"}
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="relative z-10 space-y-5">
          
          {isSignUp && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300 tracking-wider uppercase">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: John Doe"
                    className="block w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Birthdate & School Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Birthdate */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300 tracking-wider uppercase">Tanggal Lahir</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <input
                      type="date"
                      required
                      value={birthdate}
                      onChange={(e) => setBirthdate(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* School */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300 tracking-wider uppercase">Sekolah / Instansi</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                      <School className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="Nama Sekolah Anda"
                      className="block w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
                    />
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 tracking-wider uppercase">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="block w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-300 tracking-wider uppercase">Password</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="block w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none border border-white/10 cursor-pointer text-sm"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : isSignUp ? (
              <>
                <Award className="h-4 w-4" />
                Mulai Petualangan Belajar
              </>
            ) : (
              <>
                Masuk ke Dashboard
              </>
            )}
          </button>

          {/* Toggle Login/Sign Up Mode */}
          <div className="pt-2 text-center text-sm text-gray-400">
            {isSignUp ? (
              <span>
                Sudah memiliki akun?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  Login di sini
                </button>
              </span>
            ) : (
              <span>
                Belum terdaftar?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  Buat akun baru gratis
                </button>
              </span>
            )}
          </div>

        </form>

        {/* Decorative RPG Footer Quote */}
        <div className="relative z-10 text-center border-t border-white/5 pt-5">
          <p className="text-[11px] text-gray-500 tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            Level Up Your Mind, One Day At A Time
            <Sparkles className="h-3 w-3 text-purple-400" />
          </p>
        </div>

      </div>
    </div>
  );
}
