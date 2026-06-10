// Tiny classname joiner — no external dep. Filters falsy values and joins.
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

// Shared font stacks (mirrors the --font-* tokens in globals.css).
export const FONT_DISPLAY = '"Clash Display", system-ui, sans-serif';
export const FONT_SANS = '"Satoshi", system-ui, sans-serif';
