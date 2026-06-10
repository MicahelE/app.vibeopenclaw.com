'use client';

import { forwardRef, useId, useState } from 'react';
import { cn } from './cn';

const INPUT_BASE =
  'w-full bg-[#0a0f1a] border rounded-xl px-3 py-2.5 text-sm text-[#f0f4ff] placeholder-[#5a6480] ' +
  'transition-all focus:outline-none focus:border-[#ff4d4d] focus:shadow-[0_0_0_3px_rgba(255,77,77,0.15)] ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

function borderFor(error?: string) {
  return error ? 'border-[rgba(255,77,77,0.6)]' : 'border-[rgba(136,146,176,0.25)]';
}

type FieldShellProps = {
  id: string;
  label?: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
};

/** Label + control + hint/error, wired with htmlFor/id + aria-describedby. */
function FieldShell({ id, label, hint, error, children }: FieldShellProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-[#8892b0]">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-[#ff4d4d]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-[#5a6480]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type BaseFieldProps = { label?: string; hint?: React.ReactNode; error?: string; id?: string };

export const Input = forwardRef<HTMLInputElement, BaseFieldProps & React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ label, hint, error, id, className, ...rest }, ref) {
    const autoId = useId();
    const fieldId = id || autoId;
    return (
      <FieldShell id={fieldId} label={label} hint={hint} error={error}>
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className={cn(INPUT_BASE, borderFor(error), className)}
          {...rest}
        />
      </FieldShell>
    );
  }
);

/** Password input with a built-in, keyboard-reachable show/hide toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, BaseFieldProps & React.InputHTMLAttributes<HTMLInputElement>>(
  function PasswordInput({ label, hint, error, id, className, ...rest }, ref) {
    const autoId = useId();
    const fieldId = id || autoId;
    const [show, setShow] = useState(false);
    return (
      <FieldShell id={fieldId} label={label} hint={hint} error={error}>
        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            type={show ? 'text' : 'password'}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
            className={cn(INPUT_BASE, borderFor(error), 'pr-11', className)}
            {...rest}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide' : 'Show'}
            aria-pressed={show}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-[#5a6480] hover:text-[#8892b0] focus-visible:outline-none focus-visible:text-[#00e5cc]"
          >
            {show ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </FieldShell>
    );
  }
);

export const Select = forwardRef<
  HTMLSelectElement,
  BaseFieldProps & React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ label, hint, error, id, className, children, ...rest }, ref) {
  const autoId = useId();
  const fieldId = id || autoId;
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error}>
      <select
        ref={ref}
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        className={cn(INPUT_BASE, borderFor(error), className)}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
});

function Eye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}
