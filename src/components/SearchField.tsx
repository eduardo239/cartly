import { SearchIcon } from './icons';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  className?: string;
}

export default function SearchField({ value, onChange, autoFocus, className = '' }: SearchFieldProps) {
  return (
    <label
      className={`flex h-12 items-center gap-3 rounded-full border border-line bg-white px-4 text-ink-soft focus-within:border-accent focus-within:text-ink md:h-11 ${className}`}
    >
      <SearchIcon />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Buscar no baralho..."
        aria-label="Buscar produtos"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-soft md:text-sm [&::-webkit-search-cancel-button]:hidden"
      />
    </label>
  );
}
