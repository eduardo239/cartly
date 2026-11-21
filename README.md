# Cartly

Front-end de e-commerce construído com React, TypeScript e Tailwind CSS. O Cartly cobre a jornada de compra: catálogo com filtros, página de produto, carrinho, checkout, confirmação de pagamento e histórico de pedidos.

> **Status:** em desenvolvimento. Os produtos e pedidos vêm de dados mockados em [src/utils/db.ts](src/utils/db.ts), ainda sem back-end. O progresso por funcionalidade está em [PRJ.md](PRJ.md).

## Funcionalidades

- **Autenticação:** telas de cadastro e login, com botões de login social.
- **Catálogo:** listagem de produtos com filtros (categoria, preço, marca) e ordenação (preço, popularidade, avaliação).
- **Detalhes do produto:** galeria de imagens, descrição, características, especificações, cores, preço e disponibilidade.
- **Carrinho:** alteração de quantidade e resumo do pedido.
- **Checkout:** dados de entrega e cobrança, revisão e confirmação do pedido.
- **Pedidos:** detalhes após a compra e listagem de pedidos anteriores.

Itens como busca, wishlist, logout, pagamento real e painel admin ainda estão no backlog.

## Stack

| Área | Tecnologia |
| --- | --- |
| UI | React 19 |
| Linguagem | TypeScript |
| Build | Vite |
| Estilos | Tailwind CSS 4 |
| Rotas | React Router 7 |
| Qualidade | ESLint + typescript-eslint |

## Primeiros passos

Pré-requisito: Node.js e um gerenciador de pacotes (o projeto tem lockfiles de `pnpm` e `npm`).

```bash
# instalar dependências
pnpm install

# servidor de desenvolvimento
pnpm dev

# build de produção (checagem de tipos + bundle)
pnpm build

# pré-visualizar o build
pnpm preview

# lint
pnpm lint
```

Com `npm`, use `npm install` e `npm run <script>`.

## Rotas

| Rota | Página |
| --- | --- |
| `/` | Loja ([ShopPage](src/pages/ShopPage.tsx)) |
| `/products` | Produtos ([ProductPage](src/pages/ProductPage.tsx)) |
| `/register` | Cadastro |
| `/login` | Login |
| `/cart` | Carrinho |
| `/checkout` | Checkout |
| `/payment-success` | Confirmação de pagamento |
| `/orders` | Pedidos |

## Estrutura do projeto

```
src/
├── components/   # componentes reutilizáveis (cards, formulários, resumo do pedido, checkout)
├── pages/        # uma página por rota
├── types/        # tipos TypeScript (produto, carrinho, pedido, pagamento, envio)
├── utils/        # dados mockados, opções e utilitários de imagem
├── styles/       # tema e CSS global
├── App.tsx       # definição das rotas
└── main.tsx      # ponto de entrada
```

## Roadmap

O backlog completo está em [PRJ.md](PRJ.md). Os próximos passos principais:

- Busca e paginação do catálogo
- Wishlist e persistência do carrinho
- Integração com gateway de pagamento
- Back-end, autenticação real e painel administrativo
- Testes automatizados e pipeline de CI/CD
