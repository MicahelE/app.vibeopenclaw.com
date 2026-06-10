'use client';

import { useEffect } from 'react';
import { Button } from './Button';
import { FONT_DISPLAY } from './cn';

/** Controlled confirm modal — replaces window.confirm() for destructive actions. */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={() => !loading && onCancel()}
    >
      <div
        className="glass-card rounded-2xl border border-[rgba(136,146,176,0.2)] p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[#f0f4ff] font-semibold text-lg mb-2" style={{ fontFamily: FONT_DISPLAY }}>
          {title}
        </h3>
        {body && <div className="text-[#8892b0] text-sm mb-5">{body}</div>}
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="md" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant="danger" size="md" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
