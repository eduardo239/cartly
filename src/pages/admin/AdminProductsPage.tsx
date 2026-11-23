import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { SelectInput } from '../../components/admin/fields';
import CardPlate from '../../components/CardPlate';
import { CloseIcon, PlusIcon, SearchIcon } from '../../components/icons';
import { useStore } from '../../context/store-context';
import { CATEGORIES, COLORS, discountOf } from '../../data/products';
import type { Product } from '../../data/types';
import { formatPrice, normalize, pad } from '../../lib/format';

const LOW_STOCK = 5;
const STATUS_FILTERS = ['Todos', 'Publicados', 'Ocultos', 'Esgotados', 'Estoque baixo'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const STATUS_MATCH: Record<StatusFilter, (p: Product) => boolean> = {
  Todos: () => true,
  Publicados: (p) => p.published,
  Ocultos: (p) => !p.published,
  Esgotados: (p) => p.stock <= 0,
  'Estoque baixo': (p) => p.stock > 0 && p.stock <= LOW_STOCK,
};

function Thumb({ product }: { product: Product }) {
  return (
    <div className="w-12 shrink-0">
      <CardPlate surface={product.surface} color={COLORS[product.color].hex} shape={product.shape} variant="thumb" ratio={0.8} />
    </div>
  );
}

function StockLabel({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="font-semibold text-peach-ink">Esgotado</span>;
  return <span className={stock <= LOW_STOCK ? 'font-semibold text-peach-ink' : ''}>{stock} un.</span>;
}

function PriceLabel({ product }: { product: Product }) {
  const discount = discountOf(product);
  return (
    <span className="whitespace-nowrap">
      <span className="font-semibold">{formatPrice(product.price)}</span>
      {product.oldPrice && (
        <span className="ml-2 text-xs text-ink-soft">
          <s>{formatPrice(product.oldPrice)}</s> −{discount}%
        </span>
      )}
    </span>
  );
}

function PublishSwitch({ product, onToggle }: { product: Product; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={product.published}
      aria-label={`${product.published ? 'Ocultar' : 'Publicar'} ${product.name}`}
      onClick={onToggle}
      className="group inline-flex items-center gap-2 text-xs font-medium"
    >
      <span className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${product.published ? 'bg-accent' : 'bg-line'}`}>
        <span
          className={`absolute top-1 size-4 rounded-full bg-white shadow transition-all ${product.published ? 'left-5' : 'left-1'}`}
        />
      </span>
      <span className={product.published ? '' : 'text-ink-soft'}>{product.published ? 'Publicado' : 'Oculto'}</span>
    </button>
  );
}

export default function AdminProductsPage() {
  const { products, saveProduct, deleteProduct, duplicateProduct, resetCatalog } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');
  const [status, setStatus] = useState<StatusFilter>('Todos');
  const [flash, setFlash] = useState<string | null>(() => (location.state as { flash?: string } | null)?.flash ?? null);
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const sorted = useMemo(() => [...products].sort((a, b) => a.number - b.number), [products]);

  const rows = useMemo(() => {
    const term = normalize(query);
    return sorted.filter(
      (p) =>
        (category === 'Todas' || p.category === category) &&
        STATUS_MATCH[status](p) &&
        (!term || normalize(`${p.name} ${p.id} ${p.category} ${pad(p.number)}`).includes(term)),
    );
  }, [sorted, query, category, status]);

  const stats = [
    { label: 'Produtos', value: products.length },
    { label: 'Publicados', value: products.filter((p) => p.published).length },
    { label: 'Estoque baixo / esgotado', value: products.filter((p) => p.stock <= LOW_STOCK).length },
    { label: 'Em promoção', value: products.filter((p) => p.oldPrice).length },
  ];

  const duplicate = (p: Product) => {
    const id = duplicateProduct(p.id);
    if (id) navigate(`/admin/produtos/${id}`, { state: { flash: 'Cópia criada como oculta. Ajuste os dados e publique.' } });
  };

  const toggle = (p: Product) => {
    saveProduct({ ...p, published: !p.published });
    setFlash(`"${p.name}" agora está ${p.published ? 'oculto' : 'publicado'}.`);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteProduct(toDelete.id);
    setFlash(`"${toDelete.name}" foi excluído.`);
    setToDelete(null);
  };

  const linkBtn = 'rounded-full px-3 py-1.5 text-sm font-medium transition hover:bg-canvas';

  const actions = (p: Product) => (
    <div className="flex items-center gap-1">
      <Link to={`/admin/produtos/${p.id}`} className={`${linkBtn} text-accent`}>
        Editar
      </Link>
      <button type="button" onClick={() => duplicate(p)} className={linkBtn}>
        Duplicar
      </button>
      <button type="button" onClick={() => setToDelete(p)} className={`${linkBtn} text-red-600 hover:bg-red-50`}>
        Excluir
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[36px] font-bold leading-none tracking-[-0.03em] md:text-5xl">Produtos</h1>
          <p className="mt-2 text-sm text-ink-soft">Adicione, edite, oculte ou remova cartas da loja. As mudanças ficam salvas neste navegador.</p>
        </div>
        <Link
          to="/admin/produtos/novo"
          className="flex h-11 items-center gap-2 rounded-full bg-accent pl-4 pr-5 text-sm font-semibold text-white transition hover:bg-accent-ink"
        >
          <PlusIcon width={18} height={18} />
          Novo produto
        </Link>
      </div>

      {flash && (
        <div role="status" className="flex items-center justify-between gap-3 rounded-2xl bg-mint px-4 py-3 text-sm text-mint-ink">
          <span>{flash}</span>
          <button type="button" onClick={() => setFlash(null)} aria-label="Fechar aviso" className="grid size-7 place-items-center rounded-full hover:bg-white/60">
            <CloseIcon width={14} height={14} />
          </button>
        </div>
      )}

      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-4">
            <dd className="font-display text-3xl font-bold leading-none">{s.value}</dd>
            <dt className="mt-2 text-xs text-ink-soft">{s.label}</dt>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-3 md:flex-row">
        <label className="flex h-11 items-center md:flex-1 gap-3 rounded-full border border-line bg-white px-4 text-ink-soft focus-within:border-accent">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, categoria ou nº da carta"
            aria-label="Buscar produtos"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft [&::-webkit-search-cancel-button]:hidden"
          />
        </label>
        <SelectInput aria-label="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} className="md:w-48">
          <option>Todas</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </SelectInput>
        <SelectInput aria-label="Situação" value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} className="md:w-48">
          {STATUS_FILTERS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </SelectInput>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-3xl bg-white p-10 text-center text-sm text-ink-soft" role="status">
          {products.length === 0 ? 'O catálogo está vazio. Crie o primeiro produto ou restaure o catálogo inicial.' : 'Nenhum produto com esses filtros.'}
        </p>
      ) : (
        <>
          {/* Tabela (md+) */}
          <div className="hidden overflow-x-auto rounded-3xl bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-ink-soft">
                  {['Produto', 'Categoria', 'Preço', 'Estoque', 'Situação'].map((h) => (
                    <th key={h} scope="col" className="px-5 pb-3 pt-5 font-medium">
                      {h}
                    </th>
                  ))}
                  <th scope="col" className="sr-only">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="border-t border-line">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Thumb product={p} />
                        <div className="min-w-0">
                          <Link to={`/admin/produtos/${p.id}`} className="font-display font-semibold hover:text-accent">
                            {p.name}
                          </Link>
                          <p className="text-xs text-ink-soft">Carta nº {pad(p.number)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{p.category}</td>
                    <td className="px-5 py-3">
                      <PriceLabel product={p} />
                    </td>
                    <td className="px-5 py-3">
                      <StockLabel stock={p.stock} />
                    </td>
                    <td className="px-5 py-3">
                      <PublishSwitch product={p} onToggle={() => toggle(p)} />
                    </td>
                    <td className="px-3 py-3">{actions(p)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cartões (mobile) */}
          <ul className="space-y-3 md:hidden">
            {rows.map((p) => (
              <li key={p.id} className="rounded-2xl bg-white p-4">
                <div className="flex items-center gap-3">
                  <Thumb product={p} />
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold">{p.name}</p>
                    <p className="text-xs text-ink-soft">
                      Carta nº {pad(p.number)} · {p.category}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <PriceLabel product={p} />
                  <StockLabel stock={p.stock} />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
                  <PublishSwitch product={p} onToggle={() => toggle(p)} />
                  {actions(p)}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="pt-2 text-right">
        <button type="button" onClick={() => setConfirmReset(true)} className="text-sm text-ink-soft underline underline-offset-2 hover:text-ink">
          Restaurar catálogo inicial
        </button>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Excluir produto?"
        confirmLabel="Excluir"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      >
        <strong className="text-ink">{toDelete?.name}</strong> será removido da loja, da sacola, dos favoritos e das avaliações. Pedidos antigos continuam no
        histórico. Esta ação não pode ser desfeita.
      </ConfirmDialog>

      <ConfirmDialog
        open={confirmReset}
        title="Restaurar catálogo inicial?"
        confirmLabel="Restaurar"
        danger
        onConfirm={() => {
          resetCatalog();
          setConfirmReset(false);
          setFlash('Catálogo inicial restaurado.');
        }}
        onCancel={() => setConfirmReset(false)}
      >
        Todas as alterações feitas no painel serão descartadas e o catálogo volta aos 12 produtos originais.
      </ConfirmDialog>
    </div>
  );
}
