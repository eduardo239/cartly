import { Link, Outlet, useLocation, useMatch, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/store-context';
import BagDrawer from './BagDrawer';
import BottomNav from './BottomNav';
import Footer from './Footer';
import Header from './Header';
import SearchField from './SearchField';

function HeaderSearch() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onChange = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set('q', value);
    else next.delete('q');
    const search = next.toString();
    navigate({ pathname: pathname === '/buscar' ? '/buscar' : '/', search: search ? `?${search}` : '' }, { replace: true });
  };

  return <SearchField value={params.get('q') ?? ''} onChange={onChange} className="max-w-[760px]" />;
}

function Breadcrumbs({ productId }: { productId: string }) {
  const { getProduct } = useStore();
  const product = getProduct(productId);
  if (!product) return null;
  return (
    <nav aria-label="Trilha" className="flex items-center gap-2 text-sm">
      <Link to="/" className="text-accent underline underline-offset-2">
        Início
      </Link>
      <span className="text-ink-soft">/</span>
      <Link to={`/?c=${encodeURIComponent(product.category)}`} className="text-accent underline underline-offset-2">
        {product.category}
      </Link>
      <span className="text-ink-soft">/</span>
      <span className="truncate text-ink-soft">{product.name}</span>
    </nav>
  );
}

/** Estrutura da loja: cabeçalho, rodapé, sacola e navegação inferior (mobile). */
export default function Layout() {
  const product = useMatch('/produto/:id');
  const isProduct = product !== null;

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        className={isProduct ? 'hidden md:block' : ''}
        center={isProduct ? <Breadcrumbs productId={product.params.id ?? ''} /> : <HeaderSearch />}
      />
      <main className="flex-1 pb-28 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      {!isProduct && <BottomNav />}
      <BagDrawer />
    </div>
  );
}
