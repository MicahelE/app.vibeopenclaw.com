import { cn, FONT_DISPLAY } from './cn';
import { ButtonLink } from './Button';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('glass-card rounded-2xl border border-[rgba(136,146,176,0.15)] p-5', className)}>{children}</div>;
}

/** Consistent empty state with optional CTA. */
export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  body?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="text-center py-12 glass-card rounded-2xl border border-[rgba(136,146,176,0.15)] px-6">
      {icon && <div className="mx-auto mb-3 text-[#5a6480]">{icon}</div>}
      <p className="text-[#f0f4ff] font-semibold mb-1" style={{ fontFamily: FONT_DISPLAY }}>
        {title}
      </p>
      {body && <p className="text-[#8892b0] text-sm mb-5 max-w-sm mx-auto">{body}</p>}
      {action && (
        <ButtonLink href={action.href} size="md">
          {action.label}
        </ButtonLink>
      )}
    </div>
  );
}
