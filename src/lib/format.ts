/** "R$ 489", "R$ 1.290" ou, com `cents`, "R$ 48,90". */
export function formatPrice(value: number, cents = false): string {
  const showCents = cents || !Number.isInteger(value);
  const text = value.toLocaleString('pt-BR', {
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  });
  return `R$ ${text}`;
}

/** Remove acentos e caixa para comparar textos na busca. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/** "Tênis Volt" -> "tenis-volt" */
export function slugify(text: string): string {
  return normalize(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function pad(n: number): string {
  return String(n).padStart(2, '0');
}
