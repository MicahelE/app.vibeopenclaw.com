import Link from 'next/link';
import { PLANS } from '@/content/pricing';
import type { Faq } from './schema';

const HEAD = '"Clash Display", system-ui, sans-serif';

/** Inject one or more JSON-LD blocks (pass pre-stringified via jsonLd()). */
export function JsonLd({ data }: { data: string }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data }} />;
}

export function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl md:text-3xl font-bold mb-5 mt-12" style={{ fontFamily: HEAD }}>
      {children}
    </h2>
  );
}

export function Hero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
}) {
  return (
    <header className="mb-10">
      {eyebrow && (
        <span className="inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-[rgba(0,229,204,0.15)] text-[#00e5cc] border border-[rgba(0,229,204,0.2)] mb-4">
          {eyebrow}
        </span>
      )}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: HEAD }}>
        {title}
      </h1>
      <p className="text-lg text-[#8892b0] leading-relaxed">{subtitle}</p>
    </header>
  );
}

/** Horizontal stat strip — use ONLY real, verifiable numbers. */
export function StatBar({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] p-4 text-center">
          <div className="text-2xl font-bold text-[#f0f4ff]" style={{ fontFamily: HEAD }}>{s.value}</div>
          <div className="text-[11px] text-[#5a6480] mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function FeatureGrid({ features }: { features: { title: string; body: string }[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 my-6">
      {features.map((f) => (
        <div key={f.title} className="rounded-2xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] p-5">
          <h3 className="font-semibold text-[#f0f4ff] mb-1.5" style={{ fontFamily: HEAD }}>{f.title}</h3>
          <p className="text-sm text-[#8892b0] leading-relaxed">{f.body}</p>
        </div>
      ))}
    </div>
  );
}

/** Generic comparison table. First column is the row label; `cols` are the headers. */
export function ComparisonTable({
  cols,
  rows,
  highlightCol = 0,
}: {
  cols: string[];
  rows: (string | boolean)[][];
  /** Index into `cols` (0-based, excluding the label col) to highlight as "us". */
  highlightCol?: number;
}) {
  const cell = (v: string | boolean) =>
    typeof v === 'boolean' ? (
      <span className={v ? 'text-[#00e5cc]' : 'text-[#5a6480]'}>{v ? '✓' : '—'}</span>
    ) : (
      <span className="text-[#c8d0e0]">{v}</span>
    );
  return (
    <div className="overflow-x-auto rounded-2xl border border-[rgba(136,146,176,0.15)] my-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[rgba(10,15,26,0.6)]">
            <th className="text-left p-4 font-semibold text-[#8892b0]" />
            {cols.map((c, i) => (
              <th
                key={c}
                className={`text-left p-4 font-semibold ${i === highlightCol ? 'text-[#ff4d4d]' : 'text-[#f0f4ff]'}`}
                style={{ fontFamily: HEAD }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className={ri % 2 ? 'bg-[rgba(10,15,26,0.3)]' : ''}>
              <td className="p-4 font-medium text-[#f0f4ff] align-top">{r[0] as string}</td>
              {r.slice(1).map((v, ci) => (
                <td key={ci} className={`p-4 align-top ${ci === highlightCol ? 'bg-[rgba(255,77,77,0.04)]' : ''}`}>
                  {cell(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FaqAccordion({ faqs, id = 'faq' }: { faqs: Faq[]; id?: string }) {
  return (
    <section aria-labelledby={id} className="my-8">
      <H2 id={id}>Frequently asked questions</H2>
      <div className="space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] p-5 open:border-[rgba(136,146,176,0.3)]"
          >
            <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
              <span className="font-semibold text-[#f0f4ff]" style={{ fontFamily: HEAD }}>{f.q}</span>
              <span className="text-[#8892b0] text-xl leading-none mt-0.5 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-[#c8d0e0] text-sm leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Two-card pricing block driven by content/pricing.ts. */
export function PricingCards() {
  const order = [PLANS.pro, PLANS.premium];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto my-8">
      {order.map((p, i) => (
        <div key={p.id} className="relative rounded-2xl border border-[rgba(136,146,176,0.15)] bg-[rgba(10,15,26,0.4)] p-8 transition-all hover:-translate-y-1 hover:border-[rgba(255,77,77,0.3)]">
          {i === 1 && (
            <div className="absolute top-0 right-0 bg-[#ff4d4d] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Popular</div>
          )}
          <h3 className="text-lg font-semibold text-[#f0f4ff] mb-2" style={{ fontFamily: HEAD }}>{p.name}</h3>
          <div className="flex items-baseline gap-1.5 mb-6">
            <span className="text-4xl font-bold text-[#f0f4ff]">${p.monthly}</span>
            <span className="text-[#5a6480]">/month</span>
          </div>
          <ul className="space-y-3 mb-8">
            {p.features.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-[#8892b0]">
                <svg className="w-5 h-5 text-[#00e5cc] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/"
            className="block w-full text-center py-3 rounded-xl text-white font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{ fontFamily: HEAD, background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)' }}
          >
            Get started
          </Link>
        </div>
      ))}
    </div>
  );
}

export function Cta({ title, body }: { title: string; body: string }) {
  return (
    <section className="my-12">
      <div
        className="text-center py-10 px-8 rounded-2xl border border-[rgba(136,146,176,0.15)]"
        style={{ background: 'linear-gradient(135deg, rgba(255,77,77,0.05) 0%, rgba(10,15,26,0.8) 50%, rgba(0,229,204,0.03) 100%)' }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: HEAD }}>{title}</h2>
        <p className="text-[#8892b0] mb-6 max-w-md mx-auto">{body}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-semibold transition-all hover:-translate-y-0.5" style={{ fontFamily: HEAD, background: 'linear-gradient(135deg, #ff4d4d 0%, #991b1b 100%)' }}>
            Get started
          </Link>
          <Link href="/#pricing" className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-[#f0f4ff] font-semibold border border-[rgba(136,146,176,0.25)] hover:border-[rgba(136,146,176,0.5)] transition-colors" style={{ fontFamily: HEAD }}>
            See pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Inline prose helpers so page bodies stay readable. */
export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[#c8d0e0] leading-relaxed my-4">{children}</p>;
}

export function Sources({ items }: { items: { label: string; url: string }[] }) {
  return (
    <section className="my-10">
      <H2 id="sources">Sources</H2>
      <ul className="list-disc pl-6 space-y-2 text-sm text-[#8892b0]">
        {items.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#00e5cc] hover:underline">{s.label}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
