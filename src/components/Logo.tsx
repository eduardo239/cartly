import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-lg" aria-label="Carlty — início">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="6" y="5" width="19" height="23" rx="5" fill="#d5ff3a" transform="rotate(8 15 16)" />
        <rect x="5" y="3" width="19" height="23" rx="5" fill="#5b4bff" transform="rotate(-8 15 15)" />
      </svg>
      <span className="font-display text-[22px] font-bold uppercase tracking-tight">Carlty</span>
    </Link>
  );
}
