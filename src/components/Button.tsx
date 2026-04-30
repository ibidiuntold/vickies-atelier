'use client';

import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  /** Renders as a Next.js Link when provided */
  href?: string;
}

// When href is provided, omit button-specific props and merge anchor props
type ButtonAsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof BaseProps>;

type ButtonAsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

// ─── Style maps ───────────────────────────────────────────────────────────────

const variantStyles: Record<Variant, string> = {
  primary: [
    'text-[#111] font-semibold',
    'bg-gradient-to-br from-[var(--brand)] to-[var(--brand-2)]',
    'border border-transparent',
    'shadow-[0_8px_24px_rgba(199,161,122,0.2)]',
    'hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(199,161,122,0.3)] hover:bg-[var(--brand)]',
    'active:translate-y-0 active:scale-[0.98]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  ].join(' '),

  secondary: [
    'text-[var(--brand)] font-semibold',
    'bg-[var(--brand-subtle)]',
    'border border-[var(--brand)]',
    'hover:bg-[var(--brand)] hover:text-[#111] hover:-translate-y-0.5',
    'active:translate-y-0 active:scale-[0.98]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  ].join(' '),

  ghost: [
    'text-[var(--text)] font-medium',
    'bg-transparent',
    'border border-[var(--border)]',
    'hover:border-[var(--brand)] hover:text-[var(--brand)] hover:bg-[var(--brand-subtle)]',
    'active:scale-[0.98]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  ].join(' '),
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-full min-h-[36px]',
  md: 'px-6 py-3 text-[15px] rounded-full min-h-[44px]',
  lg: 'px-8 py-4 text-base rounded-full min-h-[52px]',
};

const spinnerSizeStyles: Record<Size, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ size }: { size: Size }) {
  return (
    <svg
      className={`animate-spin shrink-0 ${spinnerSizeStyles[size]}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    href,
    children,
    className = '',
    ...rest
  } = props;

  const baseStyles = [
    'inline-flex items-center justify-center gap-2',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-1 focus:ring-offset-[var(--bg)]',
    'select-none',
    variantStyles[variant],
    sizeStyles[size],
    isLoading ? 'cursor-wait' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {isLoading && <Spinner size={size} />}
      <span className={isLoading ? 'opacity-70' : ''}>{children}</span>
    </>
  );

  // Render as Next.js Link when href is provided
  if (href) {
    return (
      <Link
        href={href}
        className={baseStyles}
        aria-disabled={isLoading}
        {...(rest as Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'className'>)}
      >
        {content}
      </Link>
    );
  }

  // Render as native button
  return (
    <button
      type="button"
      className={baseStyles}
      disabled={isLoading || (rest as ComponentPropsWithoutRef<'button'>).disabled}
      aria-busy={isLoading}
      {...(rest as ComponentPropsWithoutRef<'button'>)}
    >
      {content}
    </button>
  );
}
