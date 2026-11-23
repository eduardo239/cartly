import { useEffect, useRef, type ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  /** Destaca o botão de confirmação em vermelho (ações destrutivas). */
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmação modal usando o `<dialog>` nativo (foco preso e Esc de graça). */
export default function ConfirmDialog({ open, title, children, confirmLabel, danger, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => e.target === ref.current && onCancel()}
      aria-labelledby="confirm-title"
      className="m-auto w-[min(92vw,420px)] rounded-3xl bg-white p-6 text-ink shadow-2xl backdrop:bg-ink/40"
    >
      <h2 id="confirm-title" className="text-xl font-bold">
        {title}
      </h2>
      <div className="mt-2 text-sm text-ink-soft">{children}</div>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="h-11 rounded-full border border-line px-5 text-sm font-medium hover:border-ink">
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`h-11 rounded-full px-5 text-sm font-semibold text-white ${
            danger ? 'bg-red-600 hover:bg-red-700' : 'bg-accent hover:bg-accent-ink'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
