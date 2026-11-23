import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/store-context';
import { CATEGORIES, COLORS, SHAPE_PRESETS, SURFACES } from '../../data/products';
import type { Category, ColorKey, Product, SurfaceKey } from '../../data/types';
import { formatPrice, normalize, pad, slugify } from '../../lib/format';
import CardPlate from '../CardPlate';
import ConfirmDialog from './ConfirmDialog';
import { Field, Section, SelectInput, TextArea, TextInput } from './fields';

interface Draft {
  name: string;
  category: Category;
  number: string;
  price: string;
  oldPrice: string;
  stock: string;
  published: boolean;
  description: string;
  material: string;
  weight: string;
  delivery: string;
  returns: string;
  surface: SurfaceKey;
  color: ColorKey;
  colors: ColorKey[];
  shapeWidth: number;
  shapeRatio: number;
  shapeRadius: string;
  frameRatio: number;
  sizeLabel: string;
  sizes: string;
  defaultSize: string;
  related: string[];
}

type Errors = Partial<Record<string, string>>;

const SURFACE_LABELS: Record<SurfaceKey, string> = {
  violet: 'Violeta',
  night: 'Noite',
  peach: 'Pêssego',
  mint: 'Menta',
  mist: 'Névoa',
  lime: 'Lima',
  cloud: 'Nuvem',
};

const COLOR_KEYS = Object.keys(COLORS) as ColorKey[];
const MAX_RELATED = 4;
const circle = SHAPE_PRESETS[0].shape;

const toDecimal = (text: string) => Number(text.trim().replace(/\./g, '').replace(',', '.'));
const parseSizes = (text: string) => Array.from(new Set(text.split(',').map((s) => s.trim()).filter(Boolean)));

function toDraft(p: Product | undefined, nextNumber: number): Draft {
  if (!p) {
    return {
      name: '',
      category: 'Casa',
      number: String(nextNumber),
      price: '',
      oldPrice: '',
      stock: '10',
      published: true,
      description: '',
      material: '',
      weight: '',
      delivery: '2 a 5 dias úteis',
      returns: 'Grátis em 30 dias',
      surface: 'violet',
      color: 'violet',
      colors: ['violet', 'ink', 'coral', 'green'],
      shapeWidth: circle.width,
      shapeRatio: circle.ratio,
      shapeRadius: circle.radius,
      frameRatio: 1.08,
      sizeLabel: 'TAMANHO',
      sizes: '',
      defaultSize: '',
      related: [],
    };
  }
  return {
    name: p.name,
    category: p.category,
    number: String(p.number),
    price: String(p.price).replace('.', ','),
    oldPrice: p.oldPrice ? String(p.oldPrice).replace('.', ',') : '',
    stock: String(p.stock),
    published: p.published,
    description: p.description,
    material: p.material,
    weight: p.weight,
    delivery: p.delivery,
    returns: p.returns,
    surface: p.surface,
    color: p.color,
    colors: p.colors,
    shapeWidth: p.shape.width,
    shapeRatio: p.shape.ratio,
    shapeRadius: p.shape.radius,
    frameRatio: p.frameRatio,
    sizeLabel: p.sizeLabel ?? 'TAMANHO',
    sizes: (p.sizes ?? []).join(', '),
    defaultSize: p.defaultSize ?? '',
    related: p.related,
  };
}

function validate(d: Draft, others: Product[]): Errors {
  const e: Errors = {};
  const name = d.name.trim();
  if (name.length < 2) e['f-name'] = 'Informe o nome do produto.';
  else if (others.some((o) => normalize(o.name) === normalize(name))) e['f-name'] = 'Já existe um produto com esse nome.';

  const number = Number(d.number);
  if (!Number.isInteger(number) || number < 1) e['f-number'] = 'Use um número inteiro maior que zero.';
  else if (others.some((o) => o.number === number)) e['f-number'] = 'Esse número de carta já está em uso.';

  const price = toDecimal(d.price);
  if (!d.price.trim() || !Number.isFinite(price) || price <= 0) e['f-price'] = 'Informe um preço maior que zero.';
  if (d.oldPrice.trim()) {
    const old = toDecimal(d.oldPrice);
    if (!Number.isFinite(old) || old <= price) e['f-oldPrice'] = 'O preço anterior deve ser maior que o preço atual.';
  }

  const stock = Number(d.stock);
  if (d.stock.trim() === '' || !Number.isInteger(stock) || stock < 0) e['f-stock'] = 'Use um número inteiro, zero ou mais.';

  if (d.description.trim().length < 20) e['f-description'] = 'Descreva o produto em pelo menos 20 caracteres.';
  if (!d.material.trim()) e['f-material'] = 'Informe o material.';
  if (!d.weight.trim()) e['f-weight'] = 'Informe o peso.';
  if (!d.delivery.trim()) e['f-delivery'] = 'Informe o prazo de entrega.';
  if (!d.returns.trim()) e['f-returns'] = 'Informe a política de troca.';
  return e;
}

/** Converte o rascunho do formulário em um produto pronto para salvar. */
function toProduct(d: Draft, id: string): Product {
  const sizes = parseSizes(d.sizes);
  const colors = COLOR_KEYS.filter((k) => k === d.color || d.colors.includes(k));
  return {
    id,
    number: Number(d.number),
    name: d.name.trim(),
    category: d.category,
    price: toDecimal(d.price),
    oldPrice: d.oldPrice.trim() ? toDecimal(d.oldPrice) : undefined,
    description: d.description.trim(),
    material: d.material.trim(),
    weight: d.weight.trim(),
    delivery: d.delivery.trim(),
    returns: d.returns.trim(),
    surface: d.surface,
    color: d.color,
    colors,
    shape: { width: d.shapeWidth, ratio: d.shapeRatio, radius: d.shapeRadius },
    frameRatio: d.frameRatio,
    sizeLabel: sizes.length ? d.sizeLabel : undefined,
    sizes: sizes.length ? sizes : undefined,
    defaultSize: sizes.length ? (sizes.includes(d.defaultSize) ? d.defaultSize : sizes[0]) : undefined,
    related: d.related.slice(0, MAX_RELATED),
    stock: Number(d.stock),
    published: d.published,
  };
}

export default function ProductForm({ initial }: { initial?: Product }) {
  const { products, saveProduct, deleteProduct } = useStore();
  const navigate = useNavigate();
  const isEdit = Boolean(initial);
  const others = products.filter((p) => p.id !== initial?.id);

  const [draft, setDraft] = useState<Draft>(() => toDraft(initial, Math.max(0, ...products.map((p) => p.number)) + 1));
  // Depois da primeira tentativa de salvar, os erros acompanham as edições.
  const [submitted, setSubmitted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const errors: Errors = submitted ? validate(draft, others) : {};
  const err = (id: string) => errors[id];

  const toggleColor = (key: ColorKey) => {
    setDraft((d) => {
      if (key === d.color) return d; // a cor padrão sempre fica disponível
      return { ...d, colors: d.colors.includes(key) ? d.colors.filter((c) => c !== key) : [...d.colors, key] };
    });
  };

  const toggleRelated = (id: string) => {
    setDraft((d) => {
      if (d.related.includes(id)) return { ...d, related: d.related.filter((r) => r !== id) };
      return d.related.length >= MAX_RELATED ? d : { ...d, related: [...d.related, id] };
    });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const first = Object.keys(validate(draft, others))[0];
    if (first) {
      requestAnimationFrame(() => document.getElementById(first)?.focus());
      return;
    }
    let id = initial?.id;
    if (!id) {
      const base = slugify(draft.name) || 'produto';
      id = base;
      // "novo" é reservado: /admin/produtos/novo é a tela de criação.
      for (let n = 2; id === 'novo' || products.some((p) => p.id === id); n++) id = `${base}-${n}`;
    }
    saveProduct(toProduct(draft, id));
    navigate('/admin', { state: { flash: `"${draft.name.trim()}" ${isEdit ? 'atualizado' : 'criado'} com sucesso.` } });
  };

  const sizes = parseSizes(draft.sizes);
  const previewPrice = toDecimal(draft.price);
  const previewOld = toDecimal(draft.oldPrice);
  const stock = Number(draft.stock);
  const surface = SURFACES[draft.surface];

  const chip = (active: boolean) =>
    `h-9 rounded-full border px-4 text-sm font-medium transition ${active ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-ink'}`;

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link to="/admin" className="text-sm text-accent underline underline-offset-2">
            ← Produtos
          </Link>
          <h1 className="mt-2 text-[36px] font-bold leading-none tracking-[-0.03em] md:text-5xl">
            {isEdit ? 'Editar produto' : 'Novo produto'}
          </h1>
        </div>
        {initial && (
          <Link to={`/produto/${initial.id}`} className="text-sm font-medium underline underline-offset-2">
            Ver na loja
          </Link>
        )}
      </div>

      {Object.keys(errors).length > 0 && (
        <p role="alert" className="rounded-2xl bg-peach px-4 py-3 text-sm text-peach-ink">
          Corrija os campos destacados para salvar.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <Section title="Informações básicas">
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="f-name" label="Nome" error={err('f-name')} className="md:col-span-2">
                <TextInput id="f-name" value={draft.name} onChange={(e) => set('name', e.target.value)} error={err('f-name')} maxLength={40} placeholder="Ex.: Lâmpada Pico" />
              </Field>
              <Field id="f-category" label="Categoria">
                <SelectInput id="f-category" value={draft.category} onChange={(e) => set('category', e.target.value as Category)}>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field id="f-number" label="Nº da carta" error={err('f-number')} hint="Aparece nos cantos da carta.">
                <TextInput id="f-number" inputMode="numeric" value={draft.number} onChange={(e) => set('number', e.target.value)} error={err('f-number')} />
              </Field>
              <Field id="f-description" label="Descrição" error={err('f-description')} className="md:col-span-2">
                <TextArea id="f-description" rows={4} value={draft.description} onChange={(e) => set('description', e.target.value)} error={err('f-description')} maxLength={600} />
              </Field>
            </div>
          </Section>

          <Section title="Preço e estoque">
            <div className="grid gap-4 md:grid-cols-3">
              <Field id="f-price" label="Preço (R$)" error={err('f-price')}>
                <TextInput id="f-price" inputMode="decimal" value={draft.price} onChange={(e) => set('price', e.target.value)} error={err('f-price')} placeholder="489" />
              </Field>
              <Field id="f-oldPrice" label="Preço anterior (R$)" error={err('f-oldPrice')} hint="Opcional. Gera o selo de desconto.">
                <TextInput id="f-oldPrice" inputMode="decimal" value={draft.oldPrice} onChange={(e) => set('oldPrice', e.target.value)} error={err('f-oldPrice')} placeholder="569" />
              </Field>
              <Field id="f-stock" label="Estoque" error={err('f-stock')} hint="Com 0, aparece como esgotado.">
                <TextInput id="f-stock" inputMode="numeric" value={draft.stock} onChange={(e) => set('stock', e.target.value)} error={err('f-stock')} />
              </Field>
            </div>
            <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" checked={draft.published} onChange={(e) => set('published', e.target.checked)} className="size-5 accent-accent" />
              <span>
                <span className="font-semibold">Publicado na loja</span>
                <span className="block text-xs text-ink-soft">Desmarque para manter como rascunho, visível só aqui no painel.</span>
              </span>
            </label>
          </Section>

          <Section title="Aparência da carta" description="Cor de fundo e a forma geométrica que representa o produto.">
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide">Fundo</p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Fundo da carta">
                  {(Object.keys(SURFACES) as SurfaceKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={draft.surface === key}
                      aria-label={SURFACE_LABELS[key]}
                      title={SURFACE_LABELS[key]}
                      onClick={() => set('surface', key)}
                      className={`size-10 rounded-xl border-2 transition ${draft.surface === key ? 'border-accent' : 'border-line'}`}
                      style={{ background: SURFACES[key].bg }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide">Forma</p>
                <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Forma">
                  {SHAPE_PRESETS.map((preset) => {
                    const active = draft.shapeRadius === preset.shape.radius;
                    return (
                      <button
                        key={preset.key}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setDraft((d) => ({ ...d, shapeWidth: preset.shape.width, shapeRatio: preset.shape.ratio, shapeRadius: preset.shape.radius }))}
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-2 text-xs transition ${active ? 'border-accent bg-accent-soft' : 'border-line bg-canvas hover:border-ink'}`}
                      >
                        <span className="grid h-12 w-full place-items-center">
                          <span
                            style={{
                              height: preset.shape.ratio > 1 ? undefined : 36,
                              width: preset.shape.ratio > 1 ? 40 : undefined,
                              aspectRatio: preset.shape.ratio,
                              borderRadius: preset.shape.radius,
                              background: '#5b4bff',
                              maxHeight: 40,
                              maxWidth: 44,
                            }}
                          />
                        </span>
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field id="f-shapeWidth" label={`Tamanho da forma · ${draft.shapeWidth}%`}>
                  <input id="f-shapeWidth" type="range" min={15} max={80} step={1} value={draft.shapeWidth} onChange={(e) => set('shapeWidth', Number(e.target.value))} className="w-full accent-accent" />
                </Field>
                <Field id="f-shapeRatio" label={`Proporção · ${draft.shapeRatio.toFixed(2)}`} hint="Largura ÷ altura da forma.">
                  <input id="f-shapeRatio" type="range" min={0.4} max={3} step={0.05} value={draft.shapeRatio} onChange={(e) => set('shapeRatio', Number(e.target.value))} className="w-full accent-accent" />
                </Field>
                <Field id="f-frameRatio" label={`Altura da carta · ${draft.frameRatio.toFixed(2)}`} hint="Menor = carta mais alta.">
                  <input id="f-frameRatio" type="range" min={0.7} max={1.5} step={0.01} value={draft.frameRatio} onChange={(e) => set('frameRatio', Number(e.target.value))} className="w-full accent-accent" />
                </Field>
              </div>
            </div>
          </Section>

          <Section title="Variações" description="Cores e tamanhos que o cliente pode escolher.">
            <div className="space-y-5">
              <div id="f-colors" tabIndex={-1}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide">Cores disponíveis</p>
                <div className="flex flex-wrap gap-3">
                  {COLOR_KEYS.map((key) => {
                    const on = draft.colors.includes(key) || key === draft.color;
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={on}
                        aria-label={`${COLORS[key].name}${on ? ' (disponível)' : ''}`}
                        title={COLORS[key].name}
                        onClick={() => toggleColor(key)}
                        className={`grid size-11 place-items-center rounded-full border-2 transition ${on ? 'border-ink' : 'border-transparent opacity-40 hover:opacity-80'}`}
                      >
                        <span className="size-7 rounded-full border border-black/10" style={{ background: COLORS[key].hex }} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide">Cor padrão</p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Cor padrão">
                  {COLOR_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={draft.color === key}
                      onClick={() => setDraft((d) => ({ ...d, color: key, colors: d.colors.includes(key) ? d.colors : [...d.colors, key] }))}
                      className={chip(draft.color === key)}
                    >
                      {COLORS[key].name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field id="f-sizes" label="Tamanhos" hint="Separe por vírgula. Deixe vazio se não houver." className="md:col-span-2">
                  <TextInput id="f-sizes" value={draft.sizes} onChange={(e) => set('sizes', e.target.value)} placeholder="P, M, G" />
                </Field>
                {sizes.length > 0 && (
                  <>
                    <Field id="f-sizeLabel" label="Rótulo">
                      <SelectInput id="f-sizeLabel" value={draft.sizeLabel} onChange={(e) => set('sizeLabel', e.target.value)}>
                        <option>TAMANHO</option>
                        <option>CAPACIDADE</option>
                      </SelectInput>
                    </Field>
                    <Field id="f-defaultSize" label="Tamanho padrão">
                      <SelectInput id="f-defaultSize" value={sizes.includes(draft.defaultSize) ? draft.defaultSize : sizes[0]} onChange={(e) => set('defaultSize', e.target.value)}>
                        {sizes.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </SelectInput>
                    </Field>
                  </>
                )}
              </div>
            </div>
          </Section>

          <Section title="Detalhes">
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="f-material" label="Material" error={err('f-material')}>
                <TextInput id="f-material" value={draft.material} onChange={(e) => set('material', e.target.value)} error={err('f-material')} />
              </Field>
              <Field id="f-weight" label="Peso" error={err('f-weight')}>
                <TextInput id="f-weight" value={draft.weight} onChange={(e) => set('weight', e.target.value)} error={err('f-weight')} placeholder="280 g" />
              </Field>
              <Field id="f-delivery" label="Entrega" error={err('f-delivery')}>
                <TextInput id="f-delivery" value={draft.delivery} onChange={(e) => set('delivery', e.target.value)} error={err('f-delivery')} />
              </Field>
              <Field id="f-returns" label="Troca" error={err('f-returns')}>
                <TextInput id="f-returns" value={draft.returns} onChange={(e) => set('returns', e.target.value)} error={err('f-returns')} />
              </Field>
            </div>
          </Section>

          <Section title="Combina com sua mão" description={`Até ${MAX_RELATED} produtos sugeridos na página deste item.`}>
            {others.length === 0 ? (
              <p className="text-sm text-ink-soft">Não há outros produtos para sugerir.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {others.map((o) => {
                  const on = draft.related.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={on}
                      disabled={!on && draft.related.length >= MAX_RELATED}
                      onClick={() => toggleRelated(o.id)}
                      className={`${chip(on)} disabled:opacity-40`}
                    >
                      {o.name}
                    </button>
                  );
                })}
              </div>
            )}
          </Section>
        </div>

        {/* Pré-visualização */}
        <aside className="lg:sticky lg:top-6 lg:self-start" aria-label="Pré-visualização">
          <div className="rounded-3xl bg-white p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide">Pré-visualização</p>
            <CardPlate
              surface={draft.surface}
              color={COLORS[draft.color].hex}
              shape={{ width: draft.shapeWidth, ratio: draft.shapeRatio, radius: draft.shapeRadius }}
              number={Number(draft.number) || undefined}
              ratio={draft.frameRatio}
              footer={
                <div className="flex items-baseline justify-between gap-2 px-2 pb-1 pt-3 text-sm" style={{ color: surface.ink }}>
                  <span className="font-display font-semibold">{draft.name.trim() || 'Nome do produto'}</span>
                  <span className="opacity-80">{previewPrice > 0 ? formatPrice(previewPrice) : 'R$ —'}</span>
                </div>
              }
            />
            <ul className="mt-4 space-y-1.5 text-xs text-ink-soft">
              <li>
                Carta nº {Number(draft.number) > 0 ? pad(Number(draft.number)) : '—'} · {draft.category}
              </li>
              {previewOld > previewPrice && previewPrice > 0 && (
                <li>
                  Desconto de {Math.round((1 - previewPrice / previewOld) * 100)}% sobre {formatPrice(previewOld)}
                </li>
              )}
              <li>{Number.isInteger(stock) && stock <= 0 ? 'Esgotado' : `${Number.isFinite(stock) ? stock : 0} em estoque`}</li>
              <li>{draft.published ? 'Visível na loja' : 'Rascunho: oculto na loja'}</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-line bg-canvas/90 px-4 py-4 backdrop-blur md:-mx-10 md:px-10">
        <button type="submit" className="h-12 rounded-full bg-accent px-8 text-sm font-semibold text-white transition hover:bg-accent-ink">
          {isEdit ? 'Salvar alterações' : 'Criar produto'}
        </button>
        <Link to="/admin" className="flex h-12 items-center rounded-full border border-line bg-white px-6 text-sm font-medium hover:border-ink">
          Cancelar
        </Link>
        {isEdit && (
          <button type="button" onClick={() => setConfirmDelete(true)} className="ml-auto h-12 rounded-full px-5 text-sm font-medium text-red-600 hover:bg-red-50">
            Excluir produto
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Excluir produto?"
        confirmLabel="Excluir"
        danger
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          if (!initial) return;
          deleteProduct(initial.id);
          navigate('/admin', { state: { flash: `"${initial.name}" foi excluído.` } });
        }}
      >
        <strong className="text-ink">{initial?.name}</strong> será removido da loja, da sacola, dos favoritos e das avaliações. Esta ação não pode ser desfeita.
      </ConfirmDialog>
    </form>
  );
}
