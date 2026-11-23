import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/store-context';
import { BagIcon, HeartIcon, UserIcon } from './icons';
import Logo from './Logo';

const ROUND_BTN =
  'relative grid size-10 place-items-center rounded-full border border-line bg-white transition hover:border-ink';

interface HeaderProps {
  /** Conteúdo central (busca ou trilha de navegação), visível a partir de `md`. */
  center?: ReactNode;
  className?: string;
}

export default function Header({ center, className = '' }: HeaderProps) {
  const { count, openBag, favorites } = useStore();

  return (
    <header className={`sticky top-0 z-30 bg-canvas/90 backdrop-blur ${className}`}>
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center gap-4 px-4 md:px-10">
        <Logo />
        <div className="hidden min-w-0 flex-1 md:block">{center}</div>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link to="/favoritos" className={`${ROUND_BTN} hidden md:grid`} aria-label={`Favoritos (${favorites.length})`}>
            <HeartIcon width={18} height={18} />
          </Link>
          <button type="button" onClick={openBag} className={ROUND_BTN} aria-label={`Sacola (${count} itens)`}>
            <BagIcon width={18} height={18} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-lime px-1 text-[11px] font-bold leading-5 text-ink">
                {count}
              </span>
            )}
          </button>
          <Link
            to="/perfil"
            className="hidden size-10 place-items-center rounded-full bg-ink text-white transition hover:bg-accent md:grid"
            aria-label="Meu perfil"
          >
            <UserIcon width={18} height={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
