export default function Footer() {
  return (
    <footer className="mx-auto mt-16 hidden w-full max-w-[1280px] px-10 pb-10 md:block">
      <div className="flex items-center justify-between border-t border-line pt-6 text-xs">
        <span>Carlty © 2026</span>
        <nav aria-label="Rodapé" className="flex gap-5">
          {['Ajuda', 'Trocas e devoluções', 'Privacidade'].map((label) => (
            <a key={label} href="#" onClick={(e) => e.preventDefault()} className="text-accent underline underline-offset-2">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
