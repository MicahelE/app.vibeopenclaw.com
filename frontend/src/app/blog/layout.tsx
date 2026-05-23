import Link from "next/link";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050810] text-[#f0f4ff]">
      <main className="relative z-10 max-w-[800px] mx-auto px-6 pt-10 pb-10">
        <nav aria-label="Top" className="mb-8 flex items-center justify-between text-xs text-[#5a6480]">
          <Link href="/" className="hover:text-[#f0f4ff] transition-colors flex items-center gap-2">
            <span>←</span>
            <span style={{ fontFamily: '"Clash Display", system-ui, sans-serif' }} className="font-semibold text-[#f0f4ff]">VibeOpenClaw</span>
            <span className="text-[#5a6480]">blog</span>
          </Link>
          <Link href="/#pricing" className="hover:text-[#f0f4ff] transition-colors">Pricing</Link>
        </nav>
        {children}
        <footer className="mt-16 text-center py-8 border-t border-[rgba(136,146,176,0.15)] text-xs text-[#5a6480]">
          <Link href="/" className="hover:text-[#f0f4ff] transition-colors">← Back to VibeOpenClaw</Link>
        </footer>
      </main>
    </div>
  );
}
