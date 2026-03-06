"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

function NavItem({ href, children }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`px-4 py-3 text-sm font-semibold transition
        ${active ? "border-b-2 border-primary text-secondary" : "text-black/70 hover:text-black"}`}
    >
      {children}
    </Link>
  );
}

function Dropdown({ label, items = [] }) {
  const pathname = usePathname();
  const active = items.some((i) => pathname.startsWith(i.href));

  return (
    <div className="relative group">
      <button
        type="button"
        className={`px-4 py-3 text-sm font-semibold flex items-center gap-1 transition
        ${active ? "border-b-2 border-primary text-secondary" : "text-black/70 hover:text-black"}`}
      >
        {label} <ChevronDown size={16} className="opacity-70" />
      </button>

      <div
        className="absolute left-0 top-full w-52 rounded-xl border
        border-black/10 bg-white shadow-lg overflow-hidden
        opacity-0 invisible translate-y-1
        group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
        transition-all duration-150 z-99999"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 text-sm text-black/80 hover:bg-black/5"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:gap-x-4 sm:gap-y-2 py-1 mt-5">
          <NavItem href="/">DASHBOARD</NavItem>
          <Dropdown
            label="CATEGORIES"
            items={[
              { label: "All Categories", href: "/categories" },
              { label: "Add Category", href: "/categories/new" },
            ]}
          />
          <Dropdown
            label="AUTHORS"
            items={[
              { label: "All Authors", href: "/authors" },
              { label: "Add Author", href: "/authors/new" },
            ]}
          />
          <Dropdown
            label="BOOKS"
            items={[
              { label: "All Books", href: "/books" },
              { label: "Add Book", href: "/books/new" },
            ]}
          />
        </nav>
      </div>
    </header>
  );
}
