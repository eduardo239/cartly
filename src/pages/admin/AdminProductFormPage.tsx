import { Link, useLocation, useParams } from 'react-router-dom';
import ProductForm from '../../components/admin/ProductForm';
import { useStore } from '../../context/store-context';

/** Rotas: /admin/produtos/novo (sem `id`) e /admin/produtos/:id. */
export default function AdminProductFormPage() {
  const { id } = useParams();
  const { getProduct } = useStore();
  const location = useLocation();
  const flash = (location.state as { flash?: string } | null)?.flash;
  const product = id ? getProduct(id) : undefined;

  if (id && !product) {
    return (
      <div className="grid place-items-center gap-3 rounded-3xl bg-white px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Produto não encontrado</h1>
        <p className="text-sm text-ink-soft">Ele pode ter sido excluído.</p>
        <Link to="/admin" className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent">
          Voltar aos produtos
        </Link>
      </div>
    );
  }

  return (
    <>
      {flash && (
        <p role="status" className="mb-4 rounded-2xl bg-mint px-4 py-3 text-sm text-mint-ink">
          {flash}
        </p>
      )}
      {/* `key` recarrega o rascunho ao trocar de produto. */}
      <ProductForm key={product?.id ?? 'novo'} initial={product} />
    </>
  );
}
