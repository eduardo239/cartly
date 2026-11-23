import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto grid w-full max-w-[1280px] place-items-center gap-4 px-4 py-24 text-center">
      <p className="font-display text-7xl font-bold text-accent">404</p>
      <h1 className="text-3xl font-bold">Essa carta não está no baralho.</h1>
      <p className="text-ink-soft">O endereço pode ter mudado ou o produto não existe mais.</p>
      <Link to="/" className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent">
        Voltar à loja
      </Link>
    </div>
  );
}
