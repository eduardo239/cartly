import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

const BASE =
  'w-full rounded-xl border bg-white px-3 text-sm outline-none transition placeholder:text-ink-soft focus:border-accent';
const border = (error?: string) => (error ? 'border-peach-ink' : 'border-line');

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

/** Rótulo + controle + dica/erro, ligados por `id`. */
export function Field({ id, label, hint, error, className = '', children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-peach-ink">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>
      )}
    </div>
  );
}

type WithError<T> = T & { error?: string };

export function TextInput({ error, className = '', ...props }: WithError<InputHTMLAttributes<HTMLInputElement>>) {
  return (
    <input
      {...props}
      aria-invalid={error ? true : undefined}
      aria-describedby={error && props.id ? `${props.id}-error` : undefined}
      className={`h-11 ${BASE} ${border(error)} ${className}`}
    />
  );
}

export function TextArea({ error, className = '', ...props }: WithError<TextareaHTMLAttributes<HTMLTextAreaElement>>) {
  return (
    <textarea
      {...props}
      aria-invalid={error ? true : undefined}
      aria-describedby={error && props.id ? `${props.id}-error` : undefined}
      className={`py-2.5 ${BASE} ${border(error)} ${className}`}
    />
  );
}

export function SelectInput({ error, className = '', ...props }: WithError<SelectHTMLAttributes<HTMLSelectElement>>) {
  return <select {...props} className={`h-11 ${BASE} ${border(error)} ${className}`} />;
}

export function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-5 md:p-6">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-ink-soft">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
