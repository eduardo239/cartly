import { MinusIcon, PlusIcon } from './icons';

interface QtyStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'md' | 'sm';
}

export default function QtyStepper({ value, onChange, min = 1, max = 99, size = 'md' }: QtyStepperProps) {
  const dims = size === 'md' ? 'h-12 px-1.5' : 'h-9 px-1';
  const btn = size === 'md' ? 'size-9' : 'size-7';
  return (
    <div className={`inline-flex items-center rounded-full border border-line bg-white ${dims}`} role="group" aria-label="Quantidade">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Diminuir quantidade"
        className={`grid ${btn} place-items-center rounded-full transition hover:bg-canvas disabled:opacity-35`}
      >
        <MinusIcon width={14} height={14} />
      </button>
      <span className="min-w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
        className={`grid ${btn} place-items-center rounded-full transition hover:bg-canvas disabled:opacity-35`}
      >
        <PlusIcon width={14} height={14} />
      </button>
    </div>
  );
}
