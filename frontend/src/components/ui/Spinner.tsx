import { cn } from './cn';

const SIZES = { sm: 'w-3 h-3 border-2', md: 'w-5 h-5 border-2', lg: 'w-8 h-8 border-2' };

/** Single spinner used app-wide. `tone="coral"` for page-level, `"current"` to inherit text color (e.g. inside a filled button). */
export function Spinner({
  size = 'md',
  tone = 'coral',
  className,
}: {
  size?: keyof typeof SIZES;
  tone?: 'coral' | 'current';
  className?: string;
}) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full animate-spin border-t-transparent',
        SIZES[size],
        tone === 'coral' ? 'border-[#ff4d4d]' : 'border-current',
        className
      )}
    />
  );
}
