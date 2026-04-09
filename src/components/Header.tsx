"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-[10px] border-b border-black/[0.08] transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between py-[14px]">

        <Logo size="large" priority clickable />

        <nav
          className={`items-center gap-[22px] ${
            open
              ? "flex flex-col absolute top-full left-0 right-0 z-40 bg-white border-b border-black/[0.08] px-6 py-4"
              : "hidden md:flex"
          }`}
          aria-label="Primary"
        >
          {[
            { href: "/#collections", label: "Collections" },
            { href: "/services",     label: "Services" },
            { href: "/#story",       label: "Our Story" },
            { href: "/#lookbook",    label: "Lookbook" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="text-[var(--text)] font-medium px-[10px] py-2 rounded-[10px] hover:bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-colors duration-150">
              {label}
            </Link>
          ))}

          <Link href="/#contact" onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center px-5 py-2 rounded-[18px] border border-[var(--brand)] text-[var(--brand)] font-medium text-sm hover:bg-[var(--brand)] hover:text-[#111] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200">
            Book a Fitting
          </Link>

          <Link href="/order" onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center px-5 py-2 rounded-[18px] bg-[var(--brand)] text-[#111] font-medium text-sm hover:bg-[var(--brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200">
            Place an Order
          </Link>
        </nav>

        <button
          className="md:hidden bg-transparent border-none text-[var(--text)] text-2xl cursor-pointer p-2 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:rounded"
          aria-label={open ? "Close Menu" : "Open Menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>

      </div>
    </header>
  );
}
