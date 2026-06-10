import { forwardRef } from 'react';
import Link from 'next/link';
import { cn, FONT_DISPLAY } from './cn';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  // The coral gradient previously copy-pasted across dashboard/page, agents/new, billing.
  primary:
    'bg-gradient-to-r from-[#ff4d4d] to-[#991b1b] text-white hover:shadow-[0_4px_20px_rgba(255,77,77,0.35)] hover:-translate-y-0.5',
  secondary:
    'bg-[rgba(255,255,255,0.05)] text-[#f0f4ff] border border-[rgba(136,146,176,0.25)] hover:bg-[rgba(255,255,255,0.1)]',
  ghost: 'bg-transparent text-[#8892b0] hover:text-[#f0f4ff] hover:bg-[rgba(255,255,255,0.05)]',
  danger:
    'bg-[rgba(255,77,77,0.12)] text-[#ff4d4d] border border-[rgba(255,77,77,0.3)] hover:bg-[rgba(255,77,77,0.2)]',
};

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4d4d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050810] ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Anchor/link button — pass `href`. Renders next/link (internal) styled as a button. */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<React.ComponentProps<typeof Link>, 'href' | 'className'>) {
  return (
    <Link
      href={href}
      style={{ fontFamily: FONT_DISPLAY }}
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** Standard button. `loading` shows a spinner and disables the button. */
export const Button = forwardRef<
  HTMLButtonElement,
  CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function Button(
  { variant = 'primary', size = 'md', loading = false, fullWidth, className, children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      style={{ fontFamily: FONT_DISPLAY }}
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {loading && <Spinner size="sm" tone={variant === 'primary' ? 'current' : 'coral'} />}
      {children}
    </button>
  );
});
