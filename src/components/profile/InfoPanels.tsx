import { useState, type ReactNode } from 'react';
import { ADDRESSES, PAYMENTS, SETTINGS } from '../../data/user';

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold md:text-[22px]">{title}</h2>
      {children}
    </section>
  );
}

function Tag() {
  return <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-bold">Principal</span>;
}

export function AddressesPanel() {
  return (
    <Panel title="Endereços">
      <ul className="grid gap-4 md:grid-cols-2">
        {ADDRESSES.map((a) => (
          <li key={a.label} className="rounded-3xl bg-white p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">{a.label}</h3>
              {a.main && <Tag />}
            </div>
            {a.lines.map((l) => (
              <p key={l} className="text-sm text-ink-soft">
                {l}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function PaymentsPanel() {
  return (
    <Panel title="Pagamentos">
      <ul className="grid gap-4 md:grid-cols-2">
        {PAYMENTS.map((p) => (
          <li key={p.label} className="rounded-3xl bg-white p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">{p.label}</h3>
              {p.main && <Tag />}
            </div>
            <p className="text-sm text-ink-soft">{p.detail}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function SettingsPanel() {
  const [values, setValues] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SETTINGS.map((s) => [s.id, s.on])),
  );

  return (
    <Panel title="Configurações">
      <ul className="divide-y divide-line overflow-hidden rounded-3xl bg-white">
        {SETTINGS.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-medium">{s.label}</p>
              <p className="text-sm text-ink-soft">{s.hint}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={values[s.id]}
              aria-label={s.label}
              onClick={() => setValues((v) => ({ ...v, [s.id]: !v[s.id] }))}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${values[s.id] ? 'bg-accent' : 'bg-line'}`}
            >
              <span
                className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${
                  values[s.id] ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
