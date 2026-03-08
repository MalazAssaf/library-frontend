"use client";
import { LogOut, BookOpen, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <header className="sticky bg-surface border-b border-black/15 shadow-sm">
      <div
        className="mx-auto max-w-6xl px-4 py-4 
      grid place-items-center gap-3
      sm:flex sm:items-center sm:justify-between"
      >
        {/* LOGO */}
        <Link href={"/"}>
          <div className="flex items-center gap-2 text-secondary font-bold text-lg">
            <BookOpen size={32} />
            Library Management
          </div>
        </Link>

        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-4 py-2 hover:text-primary cursor-pointer"
          >
            <User />
            {/* Malaz */}
          </button>

          {open && (
            <div
              className="absolute top-8 sm:top-full left-1/2 -translate-x-1/2 mt-2 w-30
             bg-white rounded-xl p-2"
            >
              <button
                onClick={logout}
                className="flex items-center justify-center gap-2 w-full cursor-pointer 
                 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition"
                style={{ backgroundColor: "var(--color-error)" }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
