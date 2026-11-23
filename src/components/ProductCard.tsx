import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../data/products';
import type { Product } from '../data/types';
import { formatPrice } from '../lib/format';
import CardPlate from './CardPlate';

interface ProductCardProps {
  product: Product;
  /** Índice usado no atraso da animação de entrada. */
  index?: number;
  /** Nome e preço empilhados (usado em faixas compactas). */
  stacked?: boolean;
}

export default function ProductCard({ product, index = 0, stacked = false }: ProductCardProps) {
  return (
    <Link
      to={`/produto/${product.id}`}
      className="deal group block rounded-[20px] transition duration-200 ease-out hover:-translate-y-1 hover:rotate-[-0.6deg] hover:shadow-[0_14px_30px_-14px_rgba(17,17,19,0.35)]"
      style={{ '--i': index } as CSSProperties}
      aria-label={`${product.name}, ${formatPrice(product.price)}`}
    >
      <CardPlate
        surface={product.surface}
        color={COLORS[product.color].hex}
        shape={product.shape}
        number={product.number}
        ratio={product.frameRatio}
        footer={
          <div
            className={`px-2 pb-1 pt-3 text-sm ${
              stacked ? '' : 'flex flex-col gap-0.5 md:flex-row md:items-baseline md:justify-between md:gap-2'
            }`}
          >
            <span className="block font-display font-semibold">{product.name}</span>
            <span className="block opacity-80">{formatPrice(product.price)}</span>
          </div>
        }
      />
    </Link>
  );
}
