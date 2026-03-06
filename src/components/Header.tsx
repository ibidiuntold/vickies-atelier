"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import Logo from "./Logo";
import { useTheme } from "@/hooks/useTheme";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo 
          theme={resolvedTheme}
          size="large"
          priority
          clickable
        />

        <nav className={`nav${open ? " open" : ""}`} aria-label="Primary">
          <Link href="/#collections" onClick={() => setOpen(false)}>
            Collections
          </Link>
          <Link href="/services" onClick={() => setOpen(false)}>
            Services
          </Link>
          <Link href="/#story" onClick={() => setOpen(false)}>
            Our Story
          </Link>
          <Link href="/#lookbook" onClick={() => setOpen(false)}>
            Lookbook
          </Link>
          <Link
            href="/#contact"
            className="btn btn--outline"
            onClick={() => setOpen(false)}
          >
            Book a Fitting
          </Link>
          <Link
            href="/order"
            className="btn"
            onClick={() => setOpen(false)}
          >
            Place an Order
          </Link>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <button
            className="nav-toggle"
            aria-label={open ? "Close Menu" : "Open Menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
