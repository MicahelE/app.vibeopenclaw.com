import Link from 'next/link';

/** Dark-theme marketing page wrapper with top nav + footer (mirrors blog/layout.tsx). */
export function MarketingShell({
  children,
  width = 860,
}: {
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050810] text-[#f0f4ff]">
      <main className="relative z-10 mx-auto px-6 pt-10 pb-10" style={{ maxWidth: width }}>
        <nav aria-label="Top" className="mb-8 flex items-center justify-between text-xs text-[#5a6480]">
          <Link href="/" className="hover:text-[#f0f4ff] transition-colors flex items-center gap-2">
            <span>←</span>
            <span style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }} className="font-semibold text-[#f0f4ff]">VibeOpenClaw</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/openclaw-hosting" className="hover:text-[#f0f4ff] transition-colors">OpenClaw Hosting</Link>
            <Link href="/hermes-agent-hosting" className="hover:text-[#f0f4ff] transition-colors">Hermes Hosting</Link>
            <Link href="/blog" className="hover:text-[#f0f4ff] transition-colors">Blog</Link>
            <Link href="/docs" className="hover:text-[#f0f4ff] transition-colors">Docs</Link>
            <Link href="/#pricing" className="hover:text-[#f0f4ff] transition-colors">Pricing</Link>
          </div>
        </nav>
        {children}
        <footer className="mt-16 text-center py-8 border-t border-[rgba(136,146,176,0.15)] text-xs text-[#5a6480]">
          <div className="flex items-center justify-center gap-5 mb-4">
            <Link href="/compare" className="hover:text-[#f0f4ff] transition-colors">Compare</Link>
            <Link href="/glossary" className="hover:text-[#f0f4ff] transition-colors">Glossary</Link>
          </div>
          <Link href="/" className="hover:text-[#f0f4ff] transition-colors">← Back to VibeOpenClaw</Link>
        </footer>
      </main>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; path?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-[#5a6480] mb-6">
      {items.map((it, i) => (
        <span key={it.name}>
          {i > 0 && <span className="mx-2">/</span>}
          {it.path ? (
            <Link href={it.path} className="hover:text-[#f0f4ff] transition-colors">{it.name}</Link>
          ) : (
            <span className="text-[#f0f4ff]">{it.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
