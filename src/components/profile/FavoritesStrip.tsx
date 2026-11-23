import { useStore } from '../../context/store-context';
import { getProduct } from '../../data/products';
import type { Product } from '../../data/types';
import ProductCard from '../ProductCard';

export default function FavoritesStrip({ onSeeAll }: { onSeeAll?: () => void }) {
  const { favorites } = useStore();
  const items = favorites.map(getProduct).filter((p): p is Product => Boolean(p));
  const shown = onSeeAll ? items.slice(0, 5) : items;

  return (
    <section aria-labelledby="fav-title">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 id="fav-title" className="text-2xl font-semibold md:text-[22px]">
          Favoritos
        </h2>
        {onSeeAll && (
          <button type="button" onClick={onSeeAll} className="text-sm text-accent underline underline-offset-2">
            Ver todos
          </button>
        )}
      </div>
      {shown.length === 0 ? (
        <p className="rounded-3xl bg-white p-8 text-center text-sm text-ink-soft">Você ainda não favoritou nenhuma carta.</p>
      ) : onSeeAll ? (
        <ul className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
          {shown.map((p, i) => (
            <li key={p.id} className="w-[44%] shrink-0 sm:w-[30%] md:w-auto">
              <ProductCard product={p} index={i} stacked />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
          {shown.map((p, i) => (
            <li key={p.id}>
              <ProductCard product={p} index={i} stacked />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
