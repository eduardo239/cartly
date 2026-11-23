import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/store-context';
import { COLORS } from '../data/products';
import { formatPrice } from '../lib/format';
import CardPlate from './CardPlate';
import { BagIcon, CheckIcon, CloseIcon, TrashIcon } from './icons';
import QtyStepper from './QtyStepper';

export default function BagDrawer() {
  const { getProduct, lines, subtotal, count, setQty, remove, checkout, lastOrder, bagOpen, closeBag } = useStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!bagOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBag();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [bagOpen, closeBag]);

  return (
    <div className={`fixed inset-0 z-50 ${bagOpen ? '' : 'pointer-events-none'}`} aria-hidden={!bagOpen} inert={!bagOpen}>
      <div
        onClick={closeBag}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${bagOpen ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Sacola"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-canvas shadow-2xl transition-transform duration-300 ease-out ${
          bagOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 pb-3 pt-5">
          <h2 className="text-2xl font-bold">Sua sacola</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeBag}
            aria-label="Fechar sacola"
            className="grid size-10 place-items-center rounded-full border border-line bg-white hover:border-ink"
          >
            <CloseIcon width={18} height={18} />
          </button>
        </div>

        {lastOrder ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-lime">
              <CheckIcon width={28} height={28} />
            </span>
            <h3 className="text-2xl font-bold">Pedido #{lastOrder.id} confirmado!</h3>
            <p className="text-sm text-ink-soft">
              Isto é uma demonstração: nenhum pagamento foi processado. Acompanhe seus pedidos no perfil.
            </p>
            <Link
              to="/perfil"
              onClick={closeBag}
              className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent"
            >
              Ver meus pedidos
            </Link>
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <BagIcon width={36} height={36} className="text-ink-soft" />
            <p className="font-display text-xl font-semibold">Sua sacola está vazia</p>
            <p className="text-sm text-ink-soft">Escolha uma carta para começar a sua mão.</p>
            <Link
              to="/"
              onClick={closeBag}
              className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent"
            >
              Ver as cartas
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-5 pb-4">
              {lines.map((line) => {
                const product = getProduct(line.productId);
                if (!product) return null;
                return (
                  <li key={line.key} className="flex gap-3 rounded-2xl bg-white p-3">
                    <Link to={`/produto/${product.id}`} onClick={closeBag} className="w-16 shrink-0" aria-label={product.name}>
                      <CardPlate
                        surface={product.surface}
                        color={COLORS[line.color].hex}
                        shape={product.shape}
                        variant="thumb"
                        ratio={0.8}
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-display font-semibold">{product.name}</p>
                          <p className="text-xs text-ink-soft">
                            {COLORS[line.color].name}
                            {line.size ? ` · ${line.size}` : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(line.key)}
                          aria-label={`Remover ${product.name}`}
                          className="grid size-8 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-canvas hover:text-ink"
                        >
                          <TrashIcon width={16} height={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <QtyStepper size="sm" value={line.qty} onChange={(q) => setQty(line.key, q)} />
                        <span className="text-sm font-semibold">{formatPrice(product.price * line.qty)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="space-y-3 border-t border-line bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-soft">
                  Subtotal · {count} {count === 1 ? 'item' : 'itens'}
                </span>
                <span className="font-display text-2xl font-bold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-ink-soft">
                {formatPrice(subtotal * 0.95, true)} no Pix · ou 10× de {formatPrice(subtotal / 10, true)} sem juros
              </p>
              <button
                type="button"
                onClick={checkout}
                className="h-12 w-full rounded-full bg-accent text-sm font-semibold text-white transition hover:bg-accent-ink"
              >
                Finalizar compra
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
