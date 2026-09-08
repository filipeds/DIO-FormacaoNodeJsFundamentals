# Carrinho de Compras Shopee (Node.js) — Design

## Contexto

Desafio de projeto da trilha "Formação Node.js Fundamentals" da DIO:
desenvolver um sistema de carrinho de compras inspirado na Shopee, executado
no terminal. O usuário interage com um menu para adicionar, remover e alterar
produtos no carrinho, com cálculo automático de totais e quantidades. Toda a
lógica de gerenciamento do carrinho fica no backend (Node.js), sem interface
gráfica — apenas terminal.

## Objetivo

Entregar, no repositório `filipeds/DIO-FormacaoNodeJsFundamentals`, um
projeto Node.js funcional na pasta `carrinho-compras-shopee-nodejs/`, na
branch `feat/carrinho-compras-shopee-nodejs`, com PR aberto para `main`.

## Catálogo de produtos

Catálogo fixo, definido em código, com preço e estoque inicial:

| Produto | Preço (R$) | Estoque |
|---|---|---|
| Fone de Ouvido Bluetooth | 79.90 | 15 |
| Capinha de Celular | 19.90 | 30 |
| Carregador Turbo | 34.90 | 20 |
| Mouse sem Fio | 49.90 | 12 |
| Power Bank 10000mAh | 89.90 | 10 |
| Suporte para Celular | 24.90 | 25 |

Cada produto tem `id`, `name`, `price`, `stock`.

## Regras do carrinho

- Estoque é **reservado** ao adicionar um item ao carrinho (o `stock`
  disponível no catálogo diminui) e **devolvido** ao remover o item ou
  reduzir sua quantidade — o sistema nunca deixa reservar mais do que o
  estoque disponível.
- Quantidade de um item no carrinho é sempre um inteiro maior que 0; reduzir
  a quantidade a 0 remove o item do carrinho.
- O total do carrinho é a soma de `preço × quantidade` de cada item —
  sem cupons, descontos ou taxas.
- Toda ação inválida (produto inexistente, quantidade não numérica ou ≤ 0,
  estoque insuficiente, item ausente do carrinho) retorna um erro descritivo
  e não altera o estado do carrinho nem derruba o processo.
- O carrinho existe apenas em memória durante a execução do programa; não há
  persistência entre execuções.

## Arquitetura

```
carrinho-compras-shopee-nodejs/
├── package.json
├── README.md
├── src/
│   ├── catalog.js   // lista de produtos + findProductById()
│   ├── cart.js       // classe Cart (lógica pura de gerenciamento)
│   ├── cli.js         // menu readline: I/O de terminal, chama Cart
│   └── index.js       // ponto de entrada: instancia Cart, inicia cli.js
└── test/
    ├── catalog.test.js
    └── cart.test.js
```

- **`catalog.js`**: exporta `PRODUCTS` (array fixo, ver tabela acima) e
  `findProductById(products, id)`.
- **`cart.js`**: exporta a classe `Cart`. Construtor recebe o catálogo por
  injeção (`new Cart(products = PRODUCTS)`), para ser testável com um
  catálogo de teste isolado, sem side effects entre testes. Métodos:
  - `addItem(productId, quantity)` — soma `quantity` ao item (cria se não
    existir), reserva estoque; lança erro se produto não existir, quantidade
    não for inteiro > 0, ou estoque insuficiente.
  - `removeItem(productId)` — remove o item do carrinho e devolve o estoque
    reservado; lança erro se o item não estiver no carrinho.
  - `updateQuantity(productId, quantity)` — ajusta a quantidade do item para
    o valor absoluto informado, validando a diferença contra o estoque
    disponível; `quantity` 0 remove o item (equivalente a `removeItem`).
    Lança erro se o item não estiver no carrinho ou se `quantity` for
    negativo/não numérico.
  - `getItems()` — retorna a lista de itens do carrinho (produto, quantidade,
    subtotal).
  - `getTotal()` — soma de `preço × quantidade` de todos os itens.
  - `getItemCount()` — soma das quantidades de todos os itens.
- **`cli.js`**: loop de menu com o módulo `readline` nativo. Exibe as opções,
  lê a entrada do usuário, chama os métodos de `Cart` e imprime
  resultados/erros no console, sem lógica de negócio própria.
- **`index.js`**: monta um `Cart` com o catálogo real (`PRODUCTS`) e inicia
  `cli.js`.

## Menu (CLI)

```
1) Listar produtos disponíveis
2) Adicionar produto ao carrinho
3) Remover produto do carrinho
4) Alterar quantidade de um produto
5) Ver carrinho
6) Finalizar compra
0) Sair sem finalizar
```

- **Listar produtos**: mostra id, nome, preço e estoque disponível de cada
  produto do catálogo.
- **Adicionar**: pede id do produto e quantidade → `cart.addItem(id, qty)`.
- **Remover**: pede id do item no carrinho → `cart.removeItem(id)`.
- **Alterar quantidade**: pede id + nova quantidade →
  `cart.updateQuantity(id, qty)`.
- **Ver carrinho**: lista itens (nome, preço unitário, quantidade, subtotal)
  e o total geral (`cart.getTotal()`).
- **Finalizar compra**: imprime o resumo final (itens + total) e encerra o
  programa.
- **Sair**: encerra o programa sem imprimir resumo de finalização.

Qualquer erro lançado por `Cart` é capturado pela CLI, impresso como
mensagem amigável, e o menu é reexibido — o processo nunca quebra por uma
entrada inválida do usuário.

## Testes (Jest)

- `catalog.test.js`: `PRODUCTS` tem os campos esperados (`id`, `name`,
  `price`, `stock` para cada entrada); `findProductById` encontra um produto
  existente e retorna `undefined` para um id inexistente.
- `cart.test.js`: cobre a classe `Cart` isoladamente, com um catálogo de
  teste injetado no construtor (independente de `PRODUCTS`), incluindo:
  - `addItem` soma quantidade ao criar/atualizar um item, reserva estoque no
    catálogo, rejeita quando não há estoque suficiente, rejeita produto
    inexistente e quantidade inválida (não numérica, zero ou negativa).
  - `removeItem` remove o item e devolve o estoque; rejeita remoção de item
    ausente do carrinho.
  - `updateQuantity` ajusta a quantidade validando estoque disponível tanto
    para aumento quanto para redução; quantidade 0 remove o item; rejeita
    item ausente do carrinho e quantidade negativa/não numérica.
  - `getTotal` e `getItemCount` calculam corretamente com múltiplos itens e
    após operações de adicionar/remover/alterar.
- `cli.js` e `index.js` não têm teste unitário direto (I/O de terminal
  interativo) — cobertos por verificação manual via `npm start`, seguindo o
  mesmo padrão adotado no projeto `mario-kart-race-simulator`.

## Fora de escopo

- Interface gráfica ou web.
- Persistência de carrinho entre execuções (arquivo ou banco de dados).
- Cupons de desconto, frete ou qualquer regra de preço além de
  `preço × quantidade`.
- Cadastro dinâmico de novos produtos pelo usuário.
- Autenticação, múltiplos usuários ou múltiplos carrinhos simultâneos.

## Entrega

1. Branch `feat/carrinho-compras-shopee-nodejs` a partir de `main`.
2. Implementação completa + testes passando (`npm test`).
3. Commit(s) na branch.
4. Push e abertura de PR para `main` no repositório
   `filipeds/DIO-FormacaoNodeJsFundamentals`.
