import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/store-context';
import { getProduct } from '../data/products';
import type { Product } from '../data/types';

export default function FavoritesPage() {
  const { favorites } = useStore();
  const items = favorites.map(getProduct).filter((p): p is Product => Boolean(p));

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 md:px-10">
      <h1 className="pb-6 pt-2 text-[44px] font-bold leading-none tracking-[-0.03em] md:pb-8 md:pt-8 md:text-[clamp(48px,7vw,80px)]">
        Sua mão
        <br />
        favorita.
      </h1>
      {items.length === 0 ? (
        <div className="grid place-items-center gap-3 rounded-3xl bg-white px-6 py-20 text-center">
          <p className="font-display text-2xl font-semibold">Nenhuma carta guardada ainda.</p>
          <p className="text-sm text-ink-soft">Toque no coração de um produto para guardá-lo aqui.</p>
          <Link to="/" className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent">
            Explorar cartas
          </Link>
        </div>
      ) : (
        <ul className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
          {items.map((product, i) => (
            <li key={product.id} className="mb-3 break-inside-avoid md:mb-4">
              <ProductCard product={product} index={i} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
