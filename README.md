# Carlty

Front-end de e-commerce em que **cada produto é uma carta**. Construído com React, TypeScript e Tailwind CSS, com visual de baralho: cartas coloridas com cantos numerados, uma forma geométrica por produto e layout em mosaico.

> **Status:** só front-end. Produtos, pedidos e perfil vêm de dados mockados em [src/data](src/data), sem back-end. As edições feitas no admin são guardadas no `localStorage` do navegador (chave `carlty:catalog:v1`); a sacola, favoritos, pedidos e avaliações vivem só em memória.

## Telas

- **Loja** (`/`): hero, filtro por categoria, busca e mosaico de cartas com animação de entrada.
- **Produto** (`/produto/:id`): galeria de 4 vistas, cor, tamanho, quantidade, preço com desconto/parcelas/Pix, especificações e "Combina com sua mão". No mobile, a compra fica numa barra fixa com o total.
- **Favoritos** (`/favoritos`): cartas marcadas com o coração.
- **Perfil** (`/perfil`): cartão do cliente, pedidos em andamento (com rastreio e detalhes), favoritos, histórico filtrável com "Comprar de novo", endereços, pagamentos e configurações.
- **Admin** (`/admin`): painel de produtos. Lista com busca e filtros (categoria, publicados, ocultos, esgotados, estoque baixo), criar, editar, duplicar, excluir, ocultar/publicar e restaurar o catálogo inicial. O formulário valida os campos e tem pré-visualização ao vivo da carta (fundo, forma, cores, tamanhos, preço, estoque e sugestões). Acesso pelo perfil; o controle é só um mock (`user.admin`), sem autenticação real.
- **Sacola**: painel lateral com quantidades, subtotal e finalização simulada (nenhum pagamento é processado).

Responsivo: no mobile entram a navegação inferior (Cartas, Buscar, Favoritos, Perfil), a busca no corpo da página e os botões flutuantes na página do produto.

## Stack

| Área | Tecnologia |
| --- | --- |
| UI | React 19 |
| Linguagem | TypeScript |
| Build | Vite |
| Estilos | Tailwind CSS 4 (tokens em [src/styles/index.css](src/styles/index.css)) |
| Rotas | React Router 7 |
| Fontes | Space Grotesk e Inter (Google Fonts) |

## Primeiros passos

```bash
pnpm install   # ou npm install
pnpm dev       # servidor de desenvolvimento
pnpm build     # checagem de tipos + bundle de produção
pnpm preview   # pré-visualizar o build
```

> `pnpm lint` depende do `typescript-eslint`, que ainda não suporta o TypeScript 7 usado no projeto.

## Estrutura

```
src/
├── components/   # CardPlate (a carta), ProductCard, Header, BagDrawer, BottomNav...
│   └── profile/  # blocos da página de perfil
├── context/      # estado global: sacola e favoritos
├── data/         # tipos e dados mockados (produtos, pedidos, usuário)
├── lib/          # formatação de preços e helpers de pedidos
├── pages/        # uma página por rota
├── styles/       # Tailwind e tokens de design
├── App.tsx       # rotas
└── main.tsx      # ponto de entrada
```

Para criar um produto, adicione um item em [src/data/products.ts](src/data/products.ts): a superfície (cor da carta), a forma e as cores disponíveis definem como ele aparece.
