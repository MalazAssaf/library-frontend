"use client";

import { useState } from "react";
import { User, Lock, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginApi } from "@/lib/AuthApi";
import { saveToken } from "@/lib/Token";

function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const disabledButton = !email.trim() || !password.trim();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const data = await loginApi({ email, password });
      saveToken(data.token);
      router.push("/");
    } catch (err) {
      setTimeout(() => {
        setError(err.message || "Login failed");
      }, 2000);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-secondary via-canavas to-primary">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl shadow-xl border border-black/5 p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-secondary flex items-center justify-center gap-2">
              <BookOpen size={26} />
              Library Management
            </h1>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <div>
              <label className="text-sm font-medium text-black/70">Email</label>
              <div className="relative mt-2">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-black/10 bg-white px-10 py-3 text-sm outline-none
                             focus:border-primary focus:ring-4 focus:ring-primary/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-black/70">
                Password
              </label>
              <div className="relative mt-2">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-black/10 bg-white px-10 py-3 text-sm outline-none
                             focus:border-primary focus:ring-4 focus:ring-primary/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || disabledButton}
              className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-secondary cursor-pointer
                        shadow-md shadow-black/10 transition
                        hover:brightness-95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="h-4 w-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></span>
              )}

              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-black/60 mt-2">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-accent hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-black/40 mt-4">
          © {new Date().getFullYear()} Library Management System
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
