"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo" aria-label="Vickie's Atelier Home">
          <Image
            src="/images/logo/va-logo.png"
            alt="Vickie's Atelier"
            width={120}
            height={48}
            priority
            style={{ objectFit: "contain" }}
          />
        </Link>

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

        <button
          className="nav-toggle"
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
