'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { cn } from './cn';

type ToastKind = 'success' | 'error' | 'info';
type Toast = { id: number; kind: ToastKind; message: string };

type ToastApi = {
  toast: (message: string, kind?: ToastKind) => void;
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

/** Wrap the app (or dashboard) once; call useToast() anywhere below it. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const remove = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(
    (message: string, kind: ToastKind = 'info') => {
      const id = nextId.current++;
      setToasts((t) => [...t, { id, kind, message }]);
      setTimeout(() => remove(id), 4500);
    },
    [remove]
  );

  const api: ToastApi = {
    toast,
    success: useCallback((m: string) => toast(m, 'success'), [toast]),
    error: useCallback((m: string) => toast(m, 'error'), [toast]),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const KIND_STYLES: Record<ToastKind, string> = {
  success: 'border-[rgba(0,229,204,0.4)] text-[#00e5cc]',
  error: 'border-[rgba(255,77,77,0.4)] text-[#ff4d4d]',
  info: 'border-[rgba(136,146,176,0.3)] text-[#c8d0e0]',
};

function ToastCard({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div
      role={toast.kind === 'error' ? 'alert' : 'status'}
      className={cn(
        'glass-card rounded-xl border px-4 py-3 text-sm shadow-lg flex items-start gap-3 animate-fade-in-up',
        KIND_STYLES[toast.kind]
      )}
    >
      <span className="mt-0.5 shrink-0">{toast.kind === 'success' ? '✓' : toast.kind === 'error' ? '!' : 'i'}</span>
      <span className="flex-1 text-[#f0f4ff]">{toast.message}</span>
      <button onClick={onClose} aria-label="Dismiss" className="text-[#5a6480] hover:text-[#f0f4ff] focus-visible:outline-none">
        ✕
      </button>
    </div>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
