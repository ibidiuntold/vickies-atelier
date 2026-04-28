"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";
import { MenuIcon, CloseIcon } from "./Icons";

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

          <Button variant="secondary" size="sm" href="/#contact" onClick={() => setOpen(false)}>
            Book a Fitting
          </Button>

          <Button variant="primary" className="hover:bg-[var(--brand)]" size="sm" href="/order" onClick={() => setOpen(false)}>
            Place an Order
          </Button>
        </nav>

        {/* Mobile toggle — kept as native button since it's an icon-only control */}
        <button
          className="md:hidden bg-transparent border-none text-[var(--text)] text-2xl cursor-pointer p-2 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded"
          aria-label={open ? "Close Menu" : "Open Menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <CloseIcon size={20} /> : <MenuIcon size={22} />}
        </button>

      </div>
    </header>
  );
}
