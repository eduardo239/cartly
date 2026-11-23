import type { ComponentType, SVGProps } from 'react';
import { NavLink } from 'react-router-dom';
import { CardsIcon, HeartIcon, SearchIcon, UserIcon } from './icons';

const ITEMS: { to: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { to: '/', label: 'Cartas', Icon: CardsIcon },
  { to: '/buscar', label: 'Buscar', Icon: SearchIcon },
  { to: '/favoritos', label: 'Favoritos', Icon: HeartIcon },
  { to: '/perfil', label: 'Perfil', Icon: UserIcon },
];

/** Navegação inferior, só no mobile. */
export default function BottomNav() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4 px-2 py-2">
        {ITEMS.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink to={to} end className="group flex flex-col items-center gap-1 py-1 text-xs text-ink-soft">
              {({ isActive }) => (
                <>
                  <span
                    className={`grid h-8 w-14 place-items-center rounded-full transition-colors ${
                      isActive ? 'bg-lime text-ink' : 'group-hover:bg-canvas'
                    }`}
                  >
                    <Icon width={22} height={22} />
                  </span>
                  <span className={isActive ? 'font-semibold text-ink' : ''}>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
