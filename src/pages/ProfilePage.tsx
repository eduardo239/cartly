import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BagDrawer from '../components/BagDrawer';
import BottomNav from '../components/BottomNav';
import { useStore } from '../context/store-context';
import { ChevronLeftIcon } from '../components/icons';
import Logo from '../components/Logo';
import ActiveOrders from '../components/profile/ActiveOrders';
import FavoritesStrip from '../components/profile/FavoritesStrip';
import { AddressesPanel, PaymentsPanel, SettingsPanel } from '../components/profile/InfoPanels';
import ProfileCard from '../components/profile/ProfileCard';
import PurchaseHistory from '../components/profile/PurchaseHistory';

type Tab = 'overview' | 'orders' | 'favorites' | 'addresses' | 'payments' | 'settings';

const NAV: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Visão geral' },
  { id: 'orders', label: 'Pedidos' },
  { id: 'favorites', label: 'Favoritos' },
  { id: 'addresses', label: 'Endereços' },
  { id: 'payments', label: 'Pagamentos' },
  { id: 'settings', label: 'Configurações' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const { user, activeOrders } = useStore();
  const active = activeOrders.length;

  useEffect(() => {
    document.title = 'Meu perfil · Carlty';
    return () => {
      document.title = 'Carlty';
    };
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto hidden h-[72px] w-full max-w-[1280px] items-center justify-between px-10 md:flex">
        <Logo />
        <Link
          to="/"
          className="flex h-10 items-center gap-2 rounded-full border border-line bg-white pl-3 pr-5 text-sm font-medium transition hover:border-ink"
        >
          <ChevronLeftIcon width={16} height={16} />
          Voltar à loja
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-28 pt-4 md:px-10 md:pb-16 md:pt-4">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[236px_minmax(0,1fr)] md:items-start md:gap-8">
          <aside className="space-y-4 md:sticky md:top-4">
            <ProfileCard />
            <nav aria-label="Seções do perfil">
              <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:block md:space-y-1 md:rounded-3xl md:bg-white md:p-2 md:px-2">
                {NAV.map((item) => (
                  <li key={item.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setTab(item.id)}
                      aria-current={tab === item.id ? 'page' : undefined}
                      className={`h-10 w-full rounded-full border px-4 text-sm transition md:rounded-2xl md:border-0 md:py-0 md:text-left md:text-sm ${
                        tab === item.id
                          ? 'border-ink bg-ink font-semibold text-white md:bg-canvas md:text-ink'
                          : 'border-line bg-white md:bg-transparent md:hover:bg-canvas'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
                {user.admin && (
                  <li>
                    <Link
                      to="/admin"
                      className="flex h-10 w-full items-center rounded-full border border-line bg-white px-4 text-sm transition hover:border-ink md:rounded-2xl md:border-0 md:bg-transparent md:hover:bg-canvas"
                    >
                      Administração
                    </Link>
                  </li>
                )}
                <li className="hidden md:block">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="h-10 w-full rounded-2xl px-4 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >
                    Sair
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          <div className="min-w-0 space-y-10">
            {(tab === 'overview' || tab === 'orders') && (
              <>
                {tab === 'overview' && (
                  <div className="hidden md:block">
                    <h1 className="text-[44px] font-bold leading-none tracking-[-0.03em]">Olá, {user.firstName}.</h1>
                    <p className="mt-2 text-ink-soft">
                      Você tem {active} {active === 1 ? 'pedido' : 'pedidos'} a caminho.
                    </p>
                  </div>
                )}
                {tab === 'orders' && <h1 className="text-[44px] font-bold leading-none tracking-[-0.03em]">Pedidos</h1>}
                <ActiveOrders />
              </>
            )}
            {tab === 'overview' && <FavoritesStrip onSeeAll={() => setTab('favorites')} />}
            {(tab === 'overview' || tab === 'orders') && <PurchaseHistory />}
            {tab === 'favorites' && (
              <>
                <h1 className="text-[44px] font-bold leading-none tracking-[-0.03em]">Favoritos</h1>
                <FavoritesStrip />
              </>
            )}
            {tab === 'addresses' && <AddressesPanel />}
            {tab === 'payments' && <PaymentsPanel />}
            {tab === 'settings' && <SettingsPanel />}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-red-600 underline underline-offset-2 md:hidden"
            >
              Sair
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
      <BagDrawer />
    </div>
  );
}
