"use client";

import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupApi } from "../../../lib/AuthApi";
import { registerSchema } from "../../utils/validationSchema";

function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const disabledButton =
    !form.name.trim() || !form.email.trim() || !form.password.trim();

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    const validation = registerSchema.safeParse(form);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);
      await signupApi(form.name, form.email, form.password);
      router.push("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-secondary via-canavas to-primary">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl shadow-xl border border-black/5 p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-secondary flex items-center justify-center gap-2">
              <User size={26} />
              Create Account
            </h1>
            <p className="text-sm text-black/60 mt-1">
              Sign up to access the library
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSignup}>
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-black/70">Name</label>
              <div className="relative mt-2">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-black/10 bg-white px-10 py-3 text-sm outline-none
                             focus:border-primary focus:ring-4 focus:ring-primary/10"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-black/70">Email</label>
              <div className="relative mt-2">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-black/10 bg-white px-10 py-3 text-sm outline-none
                             focus:border-primary focus:ring-4 focus:ring-primary/10"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
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
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading || disabledButton}
              className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-secondary cursor-pointer
                         shadow-md shadow-black/10 transition
                         hover:brightness-95 active:scale-[0.99]
                         disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="h-4 w-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? "Registering..." : "Sign Up"}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-black/60 mt-2">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-accent hover:underline"
              >
                Login
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

export default SignupPage;
