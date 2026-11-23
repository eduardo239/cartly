import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useStore } from '../../context/store-context';
import { ChevronLeftIcon } from '../icons';
import Logo from '../Logo';

/** Cabeçalho e proteção de acesso das telas de /admin. */
export default function AdminShell() {
  const { user } = useStore();

  useEffect(() => {
    document.title = 'Admin · Carlty';
    return () => {
      document.title = 'Carlty';
    };
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center gap-3 px-4 md:px-10">
          <Logo />
          <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-lime">Admin</span>
          <nav aria-label="Admin" className="ml-4 hidden gap-1 text-sm md:flex">
            <Link to="/admin" className="rounded-full bg-canvas px-4 py-2 font-semibold">
              Produtos
            </Link>
          </nav>
          <Link
            to="/"
            className="ml-auto flex h-10 items-center gap-1.5 rounded-full border border-line bg-white pl-3 pr-4 text-sm font-medium transition hover:border-ink"
          >
            <ChevronLeftIcon width={16} height={16} />
            Voltar à loja
          </Link>
        </div>
      </header>

      {user.admin ? (
        <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 md:px-10 md:py-8">
          <Outlet />
        </main>
      ) : (
        <main className="grid flex-1 place-items-center px-4 py-24 text-center">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">Acesso restrito</h1>
            <p className="text-ink-soft">Esta área é só para quem administra a loja.</p>
            <Link to="/" className="inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent">
              Voltar à loja
            </Link>
          </div>
        </main>
      )}
    </div>
  );
}
