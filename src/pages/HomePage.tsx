import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchField from '../components/SearchField';
import { CATEGORIES, PRODUCTS } from '../data/products';
import type { Category } from '../data/types';
import { normalize } from '../lib/format';

const TABS: ('Todos' | Category)[] = ['Todos', ...CATEGORIES];

export default function HomePage({ focusSearch = false }: { focusSearch?: boolean }) {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const cParam = params.get('c');
  const category = TABS.find((t) => t === cParam) ?? 'Todos';

  const update = (key: 'q' | 'c', value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'Todos') next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const term = normalize(q);
    return PRODUCTS.filter(
      (p) =>
        (category === 'Todos' || p.category === category) &&
        (!term || normalize(`${p.name} ${p.category}`).includes(term)),
    );
  }, [q, category]);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 md:px-10">
      <section className="flex flex-col justify-between gap-6 pb-6 pt-2 md:flex-row md:items-end md:pb-8 md:pt-8">
        <h1 className="text-[44px] font-bold leading-[0.98] tracking-[-0.03em] md:text-[clamp(56px,8vw,92px)]">
          Cada produto,
          <br />
          uma carta.
        </h1>
        <p className="hidden max-w-[250px] pb-3 text-sm text-ink-soft md:block">
          Escolha sua mão. Toque em uma carta para ver detalhes, fotos e valores.
        </p>
        <SearchField value={q} onChange={(v) => update('q', v)} autoFocus={focusSearch} className="md:hidden" />
      </section>

      <div className="mb-6 flex items-center gap-3 md:mb-8">
        <div className="no-scrollbar -mx-4 flex flex-1 gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist" aria-label="Categorias">
          {TABS.map((tab) => {
            const active = tab === category;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => update('c', tab)}
                className={`h-11 shrink-0 rounded-full border px-5 text-[15px] font-medium transition md:h-10 md:text-sm ${
                  active ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-ink'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <span className="hidden shrink-0 text-xs text-ink-soft md:block" aria-live="polite">
          {results.length} {results.length === 1 ? 'carta' : 'cartas'}
        </span>
      </div>

      {results.length === 0 ? (
        <div className="grid place-items-center gap-3 rounded-3xl bg-white px-6 py-20 text-center">
          <p className="font-display text-2xl font-semibold">Nenhuma carta por aqui.</p>
          <p className="text-sm text-ink-soft">Tente outro termo ou volte para todas as categorias.</p>
          <button
            type="button"
            onClick={() => setParams({}, { replace: true })}
            className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <ul className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
          {results.map((product, i) => (
            <li key={product.id} className="mb-3 break-inside-avoid md:mb-4">
              <ProductCard product={product} index={i} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
