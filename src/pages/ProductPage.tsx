import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardPlate from '../components/CardPlate';
import { ChevronLeftIcon, HeartIcon } from '../components/icons';
import ProductCard from '../components/ProductCard';
import QtyStepper from '../components/QtyStepper';
import { useStore } from '../context/store-context';
import { COLORS, discountOf, getProduct, VIEW_LABELS, VIEW_SHAPES } from '../data/products';
import type { ColorKey, Product } from '../data/types';
import { formatPrice, pad } from '../lib/format';
import NotFoundPage from './NotFoundPage';

export default function ProductPage() {
  const { id } = useParams();
  const product = getProduct(id);
  if (!product) return <NotFoundPage />;
  // `key` reinicia cor, tamanho e quantidade ao navegar entre produtos.
  return <ProductDetail key={product.id} product={product} />;
}

function ProductDetail({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { add, openBag, isFavorite, toggleFavorite } = useStore();
  const [color, setColor] = useState<ColorKey>(product.color);
  const [size, setSize] = useState(product.defaultSize);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);

  useEffect(() => {
    document.title = `${product.name} · Carlty`;
    return () => {
      document.title = 'Carlty';
    };
  }, [product.name]);

  const hex = COLORS[color].hex;
  const discount = discountOf(product);
  const favorite = isFavorite(product.id);
  const shapeFor = (i: number) => (i === 0 ? product.shape : VIEW_SHAPES[i]);

  const addToBag = () => {
    add(product.id, { color, size, qty });
    openBag();
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 pb-10 pt-4 md:px-10 md:pt-6">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,400px)] md:gap-10 lg:gap-14">
        {/* Galeria */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-4">
          <ul className="order-2 flex justify-center gap-3 md:order-1 md:flex-col md:justify-start" aria-label="Vistas do produto">
            {VIEW_LABELS.map((label, i) => (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => setView(i)}
                  aria-label={`${label} (${i + 1} de 4)`}
                  aria-pressed={view === i}
                  className={`block w-[58px] rounded-xl border-2 transition md:w-[54px] ${
                    view === i ? 'border-ink' : 'border-transparent hover:border-line'
                  }`}
                >
                  <CardPlate surface={product.surface} color={hex} shape={{ ...shapeFor(i), width: shapeFor(i).width * 0.9 }} variant="thumb" ratio={0.75} />
                </button>
              </li>
            ))}
          </ul>

          <div className="order-1 min-w-0 flex-1 md:order-2">
            <CardPlate
              variant="hero"
              surface={product.surface}
              color={hex}
              shape={shapeFor(view)}
              number={product.number}
              shapeKey={`${view}-${color}`}
              frameClassName="aspect-[3/4] md:aspect-[0.84]"
              frameChildren={
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink md:bottom-5 md:left-5">
                  {VIEW_LABELS[view]} · {view + 1}/4
                </span>
              }
              overlay={
                <div className="md:hidden">
                  <button
                    type="button"
                    onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
                    aria-label="Voltar"
                    className="absolute left-5 top-5 grid size-11 place-items-center rounded-full bg-white text-ink shadow-sm"
                  >
                    <ChevronLeftIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(product.id)}
                    aria-pressed={favorite}
                    aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white text-ink shadow-sm"
                  >
                    <HeartIcon fill={favorite ? 'currentColor' : 'none'} />
                  </button>
                </div>
              }
            />
          </div>
        </div>

        {/* Informações */}
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-ink">
            {product.category} · Carta nº {pad(product.number)}
          </span>
          <h1 className="mt-3 text-[40px] font-bold leading-none tracking-[-0.03em] md:text-[44px]">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-display text-[28px] font-bold leading-none">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="text-sm text-ink-soft line-through">{formatPrice(product.oldPrice)}</span>}
            {discount && <span className="rounded-full bg-lime px-2 py-0.5 text-xs font-bold">−{discount}%</span>}
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            ou 10× de {formatPrice(product.price / 10, true)} sem juros · {formatPrice(product.price * 0.95, true)} no Pix
          </p>

          <fieldset className="mt-6">
            <legend className="text-xs font-semibold uppercase tracking-wide">Cor — {COLORS[color].name}</legend>
            <div className="mt-3 flex gap-3">
              {product.colors.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setColor(key)}
                  aria-label={COLORS[key].name}
                  aria-pressed={color === key}
                  className={`grid size-9 place-items-center rounded-full border-2 transition ${
                    color === key ? 'border-ink' : 'border-transparent'
                  }`}
                >
                  <span className="size-6 rounded-full border border-black/10" style={{ background: COLORS[key].hex }} />
                </button>
              ))}
            </div>
          </fieldset>

          {product.sizes && (
            <fieldset className="mt-6">
              <legend className="text-xs font-semibold uppercase tracking-wide">{product.sizeLabel ?? 'TAMANHO'}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={`h-10 min-w-11 rounded-xl border px-3 text-sm font-medium transition ${
                      size === s ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-ink'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-6 flex items-center gap-3">
            <QtyStepper value={qty} onChange={setQty} />
            <button
              type="button"
              onClick={addToBag}
              className="hidden h-12 flex-1 rounded-full bg-accent text-sm font-semibold text-white transition hover:bg-accent-ink md:block"
            >
              Adicionar à sacola
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              aria-pressed={favorite}
              aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              className="hidden size-12 place-items-center rounded-full border border-line bg-white transition hover:border-ink md:grid"
            >
              <HeartIcon fill={favorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          <section className="mt-7">
            <h2 className="text-xs font-semibold uppercase tracking-wide font-sans">Descrição</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{product.description}</p>
          </section>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            {[
              ['Material', product.material],
              ['Peso', product.weight],
              ['Entrega', product.delivery],
              ['Troca', product.returns],
            ].map(([term, detail]) => (
              <div key={term} className="rounded-2xl bg-white px-4 py-3">
                <dt className="text-[11px] text-ink-soft">{term}</dt>
                <dd className="mt-0.5 text-sm font-semibold">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Relacionados */}
      <section className="mt-14 md:mt-16" aria-labelledby="related">
        <h2 id="related" className="mb-5 text-[28px] font-semibold">
          Combina com sua mão
        </h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {product.related.map((rid, i) => {
            const related = getProduct(rid);
            return related ? (
              <li key={rid}>
                <ProductCard product={related} index={i} />
              </li>
            ) : null;
          })}
        </ul>
      </section>

      {/* Barra fixa de compra (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-line bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="shrink-0">
          <p className="text-xs text-ink-soft">Total</p>
          <p className="font-display text-2xl font-bold leading-none">{formatPrice(product.price * qty)}</p>
        </div>
        <button
          type="button"
          onClick={addToBag}
          className="h-14 flex-1 rounded-full bg-accent text-base font-semibold text-white active:bg-accent-ink"
        >
          Adicionar à sacola
        </button>
      </div>
    </div>
  );
}
