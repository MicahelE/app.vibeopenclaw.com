import { cn } from './cn';

type Tone = 'cyan' | 'gray' | 'coral' | 'amber' | 'green';

const TONES: Record<Tone, string> = {
  cyan: 'bg-[rgba(0,229,204,0.15)] text-[#00e5cc]',
  gray: 'bg-[rgba(136,146,176,0.15)] text-[#8892b0]',
  coral: 'bg-[rgba(255,77,77,0.15)] text-[#ff4d4d]',
  amber: 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b]',
  green: 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]',
};

export function Badge({ tone = 'gray', className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', TONES[tone], className)}>
      {children}
    </span>
  );
}

// Agent lifecycle status → tone. Centralizes the map duplicated across
// dashboard/page, agents/[id], and agents/new.
const STATUS_TONE: Record<string, Tone> = {
  RUNNING: 'cyan',
  CREATING: 'amber',
  STOPPED: 'gray',
  ERROR: 'coral',
  DELETED: 'gray',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = STATUS_TONE[status?.toUpperCase()] ?? 'gray';
  return (
    <Badge tone={tone} className={className}>
      {status?.toUpperCase() === 'CREATING' && <Spinner />}
      {status}
    </Badge>
  );
}

// Tiny inline pulse dot for the CREATING state (no import cycle with Spinner.tsx).
function Spinner() {
  return <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />;
}
