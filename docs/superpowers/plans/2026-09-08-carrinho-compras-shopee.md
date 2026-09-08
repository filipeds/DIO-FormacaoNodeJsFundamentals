# Carrinho de Compras Shopee (Node.js) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Node.js shopping-cart simulator inspired by Shopee (portfolio challenge from DIO's Formação Node.js Fundamentals) in `carrinho-compras-shopee-nodejs/`, on branch `feat/carrinho-compras-shopee-nodejs`, with tests, then open a PR to `main`.

**Architecture:** Small CommonJS modules with single responsibilities (`catalog.js`, `cart.js`, `cli.js`, `index.js`), each with a matching Jest test file except the terminal I/O layer (`cli.js`/`index.js`, verified manually). All business logic (stock reservation, quantity changes, totals) lives in the `Cart` class, fully decoupled from terminal I/O.

**Tech Stack:** Node.js (CommonJS, no transpilation), Jest for testing, Node's built-in `readline` module, no runtime dependencies.

## Global Constraints

- `Cart` holds all business logic; `cli.js` contains no business logic, only I/O and calls into `Cart` (spec).
- Fixed catalog of 6 products defined in `catalog.js`, each with `id`, `name`, `price`, `stock` (spec).
- Stock is reserved when an item is added to the cart and returned when removed or reduced; the cart never allows reserving more than available stock (spec).
- Cart item quantity is always an integer > 0; `updateQuantity` with `0` removes the item (spec).
- Cart total is the sum of `price × quantity` per item — no discounts, coupons, or fees (spec).
- No persistence between runs — cart state lives only in memory for the process lifetime (spec).
- Every invalid action (unknown product, invalid quantity, insufficient stock, item not in cart) throws/logs a descriptive error and never crashes the process (spec).
- No runtime dependencies beyond Node.js itself; Jest is a devDependency only.

---

### Task 1: Project scaffold + catalog module

**Files:**
- Create: `carrinho-compras-shopee-nodejs/package.json`
- Create: `carrinho-compras-shopee-nodejs/.gitignore`
- Create: `carrinho-compras-shopee-nodejs/src/catalog.js`
- Test: `carrinho-compras-shopee-nodejs/test/catalog.test.js`

**Interfaces:**
- Produces: `catalog.js` exports `PRODUCTS: {id: number, name: string, price: number, stock: number}[]` (6 entries) and `findProductById(products, id): Product|undefined`.

- [ ] **Step 1: Create the project folder and package.json**

Create `carrinho-compras-shopee-nodejs/package.json`:

```json
{
  "name": "carrinho-compras-shopee-nodejs",
  "version": "1.0.0",
  "description": "Simulador de carrinho de compras inspirado na Shopee - desafio de projeto da DIO (Formação Node.js Fundamentals)",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  },
  "license": "ISC"
}
```

Create `carrinho-compras-shopee-nodejs/.gitignore`:

```
node_modules/
```

- [ ] **Step 2: Install dependencies**

Run (from `carrinho-compras-shopee-nodejs/`): `npm install`
Expected: `node_modules/` created, `package-lock.json` created, no errors.

- [ ] **Step 3: Write the failing test**

Create `carrinho-compras-shopee-nodejs/test/catalog.test.js`:

```js
const { PRODUCTS, findProductById } = require('../src/catalog');

test('PRODUCTS has 6 entries with id, name, price, and stock', () => {
  expect(PRODUCTS).toHaveLength(6);
  PRODUCTS.forEach((product) => {
    expect(typeof product.id).toBe('number');
    expect(typeof product.name).toBe('string');
    expect(typeof product.price).toBe('number');
    expect(typeof product.stock).toBe('number');
  });
});

test('findProductById returns the matching product', () => {
  const product = findProductById(PRODUCTS, 1);
  expect(product.name).toBe('Fone de Ouvido Bluetooth');
});

test('findProductById returns undefined for an unknown id', () => {
  expect(findProductById(PRODUCTS, 999)).toBeUndefined();
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx jest test/catalog.test.js`
Expected: FAIL — `Cannot find module '../src/catalog'`

- [ ] **Step 5: Write minimal implementation**

Create `carrinho-compras-shopee-nodejs/src/catalog.js`:

```js
const PRODUCTS = [
  { id: 1, name: 'Fone de Ouvido Bluetooth', price: 79.90, stock: 15 },
  { id: 2, name: 'Capinha de Celular', price: 19.90, stock: 30 },
  { id: 3, name: 'Carregador Turbo', price: 34.90, stock: 20 },
  { id: 4, name: 'Mouse sem Fio', price: 49.90, stock: 12 },
  { id: 5, name: 'Power Bank 10000mAh', price: 89.90, stock: 10 },
  { id: 6, name: 'Suporte para Celular', price: 24.90, stock: 25 },
];

function findProductById(products, id) {
  return products.find((product) => product.id === id);
}

module.exports = { PRODUCTS, findProductById };
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx jest test/catalog.test.js`
Expected: PASS (3 tests)

- [ ] **Step 7: Commit**

```bash
git add carrinho-compras-shopee-nodejs/package.json carrinho-compras-shopee-nodejs/.gitignore carrinho-compras-shopee-nodejs/src/catalog.js carrinho-compras-shopee-nodejs/test/catalog.test.js carrinho-compras-shopee-nodejs/package-lock.json
git commit -m "feat: scaffold carrinho-compras-shopee-nodejs project with catalog module"
```

---

### Task 2: Cart class — addItem (reserve stock)

**Files:**
- Create: `carrinho-compras-shopee-nodejs/src/cart.js`
- Test: `carrinho-compras-shopee-nodejs/test/cart.test.js`

**Interfaces:**
- Consumes: `PRODUCTS` from `./catalog` (Task 1) as the default constructor argument.
- Produces: `cart.js` exports `Cart` — `new Cart(products = PRODUCTS)` with fields `products` (the injected catalog array, mutated in place for stock reservation) and `items` (a `Map<number, number>` of `productId -> quantity`). Method `addItem(productId: number, quantity: number): void` — throws `Error` for invalid quantity, unknown product, or insufficient stock; otherwise increments the item's quantity in `items` and decrements `stock` on the matching product in `products`.

- [ ] **Step 1: Write the failing test**

Create `carrinho-compras-shopee-nodejs/test/cart.test.js`:

```js
const { Cart } = require('../src/cart');

function makeTestProducts() {
  return [
    { id: 1, name: 'Produto A', price: 10, stock: 5 },
    { id: 2, name: 'Produto B', price: 20, stock: 2 },
  ];
}

describe('Cart - addItem', () => {
  test('adds a new item and reserves stock', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);

    cart.addItem(1, 2);

    expect(cart.items.get(1)).toBe(2);
    expect(products[0].stock).toBe(3);
  });

  test('increases quantity when adding the same product again', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);

    cart.addItem(1, 2);
    cart.addItem(1, 1);

    expect(cart.items.get(1)).toBe(3);
    expect(products[0].stock).toBe(2);
  });

  test('throws when there is not enough stock', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);

    expect(() => cart.addItem(2, 5)).toThrow('Estoque insuficiente');
    expect(products[1].stock).toBe(2);
  });

  test('throws for an unknown product id', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);

    expect(() => cart.addItem(999, 1)).toThrow('não encontrado');
  });

  test.each([0, -1, 1.5, 'a'])('throws for invalid quantity %p', (quantity) => {
    const products = makeTestProducts();
    const cart = new Cart(products);

    expect(() => cart.addItem(1, quantity)).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest test/cart.test.js`
Expected: FAIL — `Cannot find module '../src/cart'`

- [ ] **Step 3: Write minimal implementation**

Create `carrinho-compras-shopee-nodejs/src/cart.js`:

```js
const { PRODUCTS, findProductById } = require('./catalog');

class Cart {
  constructor(products = PRODUCTS) {
    this.products = products;
    this.items = new Map();
  }

  addItem(productId, quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Quantidade deve ser um número inteiro maior que zero.');
    }

    const product = findProductById(this.products, productId);
    if (!product) {
      throw new Error(`Produto com id ${productId} não encontrado.`);
    }

    if (product.stock < quantity) {
      throw new Error(`Estoque insuficiente para ${product.name}. Disponível: ${product.stock}.`);
    }

    const currentQuantity = this.items.get(productId) || 0;
    this.items.set(productId, currentQuantity + quantity);
    product.stock -= quantity;
  }
}

module.exports = { Cart };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest test/cart.test.js`
Expected: PASS (5 tests, including 4 from `test.each`)

- [ ] **Step 5: Commit**

```bash
git add carrinho-compras-shopee-nodejs/src/cart.js carrinho-compras-shopee-nodejs/test/cart.test.js
git commit -m "feat: add Cart.addItem with stock reservation"
```

---

### Task 3: Cart class — removeItem (return stock)

**Files:**
- Modify: `carrinho-compras-shopee-nodejs/src/cart.js`
- Modify: `carrinho-compras-shopee-nodejs/test/cart.test.js`

**Interfaces:**
- Consumes: `Cart`, `this.items`, `this.products` from Task 2.
- Produces: `Cart.removeItem(productId: number): void` — throws `Error` if the product is not in the cart; otherwise deletes it from `items` and adds its quantity back to the matching product's `stock`.

- [ ] **Step 1: Write the failing test**

Add to `carrinho-compras-shopee-nodejs/test/cart.test.js` (append, keep the existing `addItem` describe block and the `makeTestProducts` helper):

```js
describe('Cart - removeItem', () => {
  test('removes the item and returns stock', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);
    cart.addItem(1, 2);

    cart.removeItem(1);

    expect(cart.items.has(1)).toBe(false);
    expect(products[0].stock).toBe(5);
  });

  test('throws when the item is not in the cart', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);

    expect(() => cart.removeItem(1)).toThrow('não está no carrinho');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest test/cart.test.js`
Expected: FAIL — `TypeError: cart.removeItem is not a function`

- [ ] **Step 3: Write minimal implementation**

In `carrinho-compras-shopee-nodejs/src/cart.js`, add a `removeItem` method to the `Cart` class, right after `addItem`:

```js
  removeItem(productId) {
    const quantity = this.items.get(productId);
    if (quantity === undefined) {
      throw new Error(`Produto com id ${productId} não está no carrinho.`);
    }

    const product = findProductById(this.products, productId);
    product.stock += quantity;
    this.items.delete(productId);
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest test/cart.test.js`
Expected: PASS (all `addItem` and `removeItem` tests)

- [ ] **Step 5: Commit**

```bash
git add carrinho-compras-shopee-nodejs/src/cart.js carrinho-compras-shopee-nodejs/test/cart.test.js
git commit -m "feat: add Cart.removeItem with stock return"
```

---

### Task 4: Cart class — updateQuantity

**Files:**
- Modify: `carrinho-compras-shopee-nodejs/src/cart.js`
- Modify: `carrinho-compras-shopee-nodejs/test/cart.test.js`

**Interfaces:**
- Consumes: `Cart`, `this.items`, `this.products`, `removeItem` from Task 3.
- Produces: `Cart.updateQuantity(productId: number, quantity: number): void` — throws `Error` for a negative/non-integer quantity, or if the product is not in the cart. `quantity === 0` delegates to `removeItem`. Otherwise adjusts `items` to the new absolute quantity, throwing if the increase exceeds available stock, and adjusts `stock` by the difference.

- [ ] **Step 1: Write the failing test**

Add to `carrinho-compras-shopee-nodejs/test/cart.test.js`:

```js
describe('Cart - updateQuantity', () => {
  test('increases quantity and reserves the extra stock', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);
    cart.addItem(1, 2);

    cart.updateQuantity(1, 4);

    expect(cart.items.get(1)).toBe(4);
    expect(products[0].stock).toBe(1);
  });

  test('decreases quantity and returns the freed stock', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);
    cart.addItem(1, 4);

    cart.updateQuantity(1, 1);

    expect(cart.items.get(1)).toBe(1);
    expect(products[0].stock).toBe(4);
  });

  test('setting quantity to 0 removes the item', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);
    cart.addItem(1, 2);

    cart.updateQuantity(1, 0);

    expect(cart.items.has(1)).toBe(false);
    expect(products[0].stock).toBe(5);
  });

  test('throws when increasing beyond available stock', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);
    cart.addItem(1, 2);

    expect(() => cart.updateQuantity(1, 10)).toThrow('Estoque insuficiente');
    expect(cart.items.get(1)).toBe(2);
  });

  test('throws when the item is not in the cart', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);

    expect(() => cart.updateQuantity(1, 2)).toThrow('não está no carrinho');
  });

  test('throws for a negative quantity', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);
    cart.addItem(1, 2);

    expect(() => cart.updateQuantity(1, -1)).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest test/cart.test.js`
Expected: FAIL — `TypeError: cart.updateQuantity is not a function`

- [ ] **Step 3: Write minimal implementation**

In `carrinho-compras-shopee-nodejs/src/cart.js`, add an `updateQuantity` method to the `Cart` class, right after `removeItem`:

```js
  updateQuantity(productId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error('Quantidade deve ser um número inteiro maior ou igual a zero.');
    }

    const currentQuantity = this.items.get(productId);
    if (currentQuantity === undefined) {
      throw new Error(`Produto com id ${productId} não está no carrinho.`);
    }

    if (quantity === 0) {
      this.removeItem(productId);
      return;
    }

    const product = findProductById(this.products, productId);
    const diff = quantity - currentQuantity;

    if (diff > 0 && product.stock < diff) {
      throw new Error(`Estoque insuficiente para ${product.name}. Disponível: ${product.stock}.`);
    }

    product.stock -= diff;
    this.items.set(productId, quantity);
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest test/cart.test.js`
Expected: PASS (all `addItem`, `removeItem`, and `updateQuantity` tests)

- [ ] **Step 5: Commit**

```bash
git add carrinho-compras-shopee-nodejs/src/cart.js carrinho-compras-shopee-nodejs/test/cart.test.js
git commit -m "feat: add Cart.updateQuantity with stock-aware validation"
```

---

### Task 5: Cart class — getItems/getTotal/getItemCount

**Files:**
- Modify: `carrinho-compras-shopee-nodejs/src/cart.js`
- Modify: `carrinho-compras-shopee-nodejs/test/cart.test.js`

**Interfaces:**
- Consumes: `Cart`, `this.items`, `this.products` from Task 4.
- Produces: `Cart.getItems(): {productId: number, name: string, price: number, quantity: number, subtotal: number}[]`, `Cart.getTotal(): number` (sum of every item's subtotal), `Cart.getItemCount(): number` (sum of every item's quantity).

- [ ] **Step 1: Write the failing test**

Add to `carrinho-compras-shopee-nodejs/test/cart.test.js`:

```js
describe('Cart - getItems/getTotal/getItemCount', () => {
  test('getItems returns product details with subtotal', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);
    cart.addItem(1, 2);
    cart.addItem(2, 1);

    const items = cart.getItems();

    expect(items).toEqual([
      { productId: 1, name: 'Produto A', price: 10, quantity: 2, subtotal: 20 },
      { productId: 2, name: 'Produto B', price: 20, quantity: 1, subtotal: 20 },
    ]);
  });

  test('getTotal sums the subtotal of every item', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);
    cart.addItem(1, 2);
    cart.addItem(2, 1);

    expect(cart.getTotal()).toBe(40);
  });

  test('getItemCount sums the quantity of every item', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);
    cart.addItem(1, 2);
    cart.addItem(2, 1);

    expect(cart.getItemCount()).toBe(3);
  });

  test('empty cart has total 0 and count 0', () => {
    const products = makeTestProducts();
    const cart = new Cart(products);

    expect(cart.getItems()).toEqual([]);
    expect(cart.getTotal()).toBe(0);
    expect(cart.getItemCount()).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest test/cart.test.js`
Expected: FAIL — `TypeError: cart.getItems is not a function`

- [ ] **Step 3: Write minimal implementation**

In `carrinho-compras-shopee-nodejs/src/cart.js`, add `getItems`, `getTotal`, and `getItemCount` methods to the `Cart` class, right after `updateQuantity`:

```js
  getItems() {
    return Array.from(this.items.entries()).map(([productId, quantity]) => {
      const product = findProductById(this.products, productId);
      return {
        productId,
        name: product.name,
        price: product.price,
        quantity,
        subtotal: product.price * quantity,
      };
    });
  }

  getTotal() {
    return this.getItems().reduce((total, item) => total + item.subtotal, 0);
  }

  getItemCount() {
    return Array.from(this.items.values()).reduce((count, quantity) => count + quantity, 0);
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest test/cart.test.js`
Expected: PASS (all tests in the file)

- [ ] **Step 5: Run the full test suite**

Run (from `carrinho-compras-shopee-nodejs/`): `npm test`
Expected: All test files (`catalog.test.js`, `cart.test.js`) PASS.

- [ ] **Step 6: Commit**

```bash
git add carrinho-compras-shopee-nodejs/src/cart.js carrinho-compras-shopee-nodejs/test/cart.test.js
git commit -m "feat: add Cart.getItems, getTotal, and getItemCount"
```

---

### Task 6: CLI entry point (menu + index.js)

**Files:**
- Create: `carrinho-compras-shopee-nodejs/src/cli.js`
- Create: `carrinho-compras-shopee-nodejs/src/index.js`

**Interfaces:**
- Consumes: `Cart` from `./cart` (Task 5), `PRODUCTS` from `./catalog` (Task 1).
- Produces: `cli.js` exports `startCli(cart: Cart): Promise<void>` — runs an interactive `readline` menu loop over the given `Cart` until the user finishes or exits. `index.js` running via `node src/index.js` builds a `Cart` and starts the CLI, printing a welcome banner.

- [ ] **Step 1: Write the implementation**

Create `carrinho-compras-shopee-nodejs/src/cli.js`:

```js
const readline = require('readline');

const MENU = `
===== Carrinho de Compras Shopee =====
1) Listar produtos disponíveis
2) Adicionar produto ao carrinho
3) Remover produto do carrinho
4) Alterar quantidade de um produto
5) Ver carrinho
6) Finalizar compra
0) Sair sem finalizar
`;

function formatMoney(value) {
  return `R$ ${value.toFixed(2)}`;
}

function listProducts(cart) {
  console.log('\n--- Produtos disponíveis ---');
  cart.products.forEach((product) => {
    console.log(`${product.id}) ${product.name} - ${formatMoney(product.price)} (estoque: ${product.stock})`);
  });
}

function showCart(cart) {
  const items = cart.getItems();
  console.log('\n--- Seu carrinho ---');
  if (items.length === 0) {
    console.log('O carrinho está vazio.');
    return;
  }
  items.forEach((item) => {
    console.log(`${item.productId}) ${item.name} - ${item.quantity}x ${formatMoney(item.price)} = ${formatMoney(item.subtotal)}`);
  });
  console.log(`Total: ${formatMoney(cart.getTotal())}`);
}

function finishPurchase(cart) {
  const items = cart.getItems();
  console.log('\n===== Resumo da compra =====');
  if (items.length === 0) {
    console.log('Nenhum item no carrinho.');
    return;
  }
  items.forEach((item) => {
    console.log(`${item.name} - ${item.quantity}x ${formatMoney(item.price)} = ${formatMoney(item.subtotal)}`);
  });
  console.log(`Total: ${formatMoney(cart.getTotal())}`);
  console.log('\nCompra finalizada. Obrigado por comprar com a gente!');
}

function startCli(cart) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

  async function promptMenu() {
    console.log(MENU);
    const choice = (await ask('Escolha uma opção: ')).trim();

    switch (choice) {
      case '1':
        listProducts(cart);
        return promptMenu();
      case '2': {
        const id = Number((await ask('Id do produto: ')).trim());
        const quantity = Number((await ask('Quantidade: ')).trim());
        try {
          cart.addItem(id, quantity);
          console.log('Produto adicionado ao carrinho.');
        } catch (error) {
          console.log(`Erro: ${error.message}`);
        }
        return promptMenu();
      }
      case '3': {
        const id = Number((await ask('Id do produto a remover: ')).trim());
        try {
          cart.removeItem(id);
          console.log('Produto removido do carrinho.');
        } catch (error) {
          console.log(`Erro: ${error.message}`);
        }
        return promptMenu();
      }
      case '4': {
        const id = Number((await ask('Id do produto: ')).trim());
        const quantity = Number((await ask('Nova quantidade: ')).trim());
        try {
          cart.updateQuantity(id, quantity);
          console.log('Quantidade atualizada.');
        } catch (error) {
          console.log(`Erro: ${error.message}`);
        }
        return promptMenu();
      }
      case '5':
        showCart(cart);
        return promptMenu();
      case '6':
        finishPurchase(cart);
        rl.close();
        return undefined;
      case '0':
        console.log('Saindo sem finalizar a compra.');
        rl.close();
        return undefined;
      default:
        console.log('Opção inválida. Tente novamente.');
        return promptMenu();
    }
  }

  return promptMenu();
}

module.exports = { startCli };
```

Create `carrinho-compras-shopee-nodejs/src/index.js`:

```js
const { Cart } = require('./cart');
const { startCli } = require('./cli');

function main() {
  const cart = new Cart();
  console.log('Bem-vindo ao Carrinho de Compras Shopee!');
  startCli(cart);
}

if (require.main === module) {
  main();
}

module.exports = { main };
```

- [ ] **Step 2: Manually run and inspect output**

Run (from `carrinho-compras-shopee-nodejs/`): `npm start`
Expected: prints the welcome banner and the menu. Manually exercise each option:
- `1` lists the 6 products with price and stock.
- `2` adds a valid product/quantity, confirms success, and shows reduced stock afterward via option `1`.
- `2` again with a quantity greater than available stock prints an `Erro: Estoque insuficiente...` message and does not crash.
- `3` removes an item and returns its stock (check via `1`).
- `4` changes a quantity up and down, and setting it to `0` removes the item.
- `5` shows the current items and total.
- `6` prints the final summary and exits cleanly.
- Re-run `npm start` and choose `0` to confirm it exits without a summary.

- [ ] **Step 3: Run the full test suite once more**

Run: `npm test`
Expected: All existing tests still PASS (`cli.js`/`index.js` have no direct unit tests — pure orchestration/terminal I/O already exercised manually, same pattern as the `mario-kart-race-simulator` project).

- [ ] **Step 4: Commit**

```bash
git add carrinho-compras-shopee-nodejs/src/cli.js carrinho-compras-shopee-nodejs/src/index.js
git commit -m "feat: add interactive CLI entry point for the shopping cart"
```

---

### Task 7: Project README

**Files:**
- Create: `carrinho-compras-shopee-nodejs/README.md`

**Interfaces:**
- None (documentation only).

- [ ] **Step 1: Write the README**

Create `carrinho-compras-shopee-nodejs/README.md`:

```markdown
# 🛒 Carrinho de Compras Shopee

Desafio de projeto da trilha **Formação Node.js Fundamentals** da [DIO](https://www.dio.me/).

## Sobre o desafio

Simular, via terminal, um carrinho de compras inspirado na Shopee: o usuário
navega por um menu para listar produtos, adicionar, remover e alterar
quantidades no carrinho, com cálculo automático de totais e controle de
estoque. Toda a lógica de gerenciamento roda no backend (Node.js puro), sem
interface gráfica.

- **6 produtos** fixos no catálogo, cada um com preço e estoque.
- Estoque é **reservado** ao adicionar um item ao carrinho e **devolvido**
  ao remover ou reduzir a quantidade — nunca é possível reservar mais do
  que o estoque disponível.
- Código orientado a objetos (`Cart`), com módulos separados por
  responsabilidade (`catalog`, `cart`, `cli`, `index`).
- Toda ação inválida (produto inexistente, quantidade inválida, estoque
  insuficiente) mostra uma mensagem de erro e mantém o programa rodando.
- Suíte de testes automatizados com Jest cobrindo toda a lógica do carrinho.

## Regras

- O total do carrinho é sempre a soma de `preço × quantidade` de cada item,
  sem cupons, descontos ou taxas.
- A quantidade de um item no carrinho é sempre um número inteiro maior que
  zero; reduzir a quantidade a 0 remove o item do carrinho.
- O carrinho existe apenas em memória durante a execução — não há
  persistência entre execuções do programa.

## Como rodar

```bash
cd carrinho-compras-shopee-nodejs
npm install
npm start
```

## Como testar

```bash
npm test
```

## Estrutura

```
src/
├── catalog.js   # catálogo fixo de produtos (id, nome, preço, estoque)
├── cart.js      # classe Cart (motor do carrinho: adicionar, remover, totais)
├── cli.js       # menu interativo de terminal (readline), chama Cart
└── index.js     # ponto de entrada (CLI)
test/            # testes Jest para catalog e cart
```
```

- [ ] **Step 2: Commit**

```bash
git add carrinho-compras-shopee-nodejs/README.md
git commit -m "docs: add project README for the shopping cart simulator"
```

---

### Task 8: Push branch and open PR

**Files:** none (git/GitHub operations only).

- [ ] **Step 1: Verify all tests pass and branch is correct**

Run: `git branch --show-current`
Expected: `feat/carrinho-compras-shopee-nodejs`

Run (from `carrinho-compras-shopee-nodejs/`): `npm test`
Expected: All tests PASS.

- [ ] **Step 2: Push the branch**

```bash
git push -u origin feat/carrinho-compras-shopee-nodejs
```

- [ ] **Step 3: Open the PR**

```bash
gh pr create --title "feat: carrinho de compras Shopee" --body "$(cat <<'EOF'
## Summary
- Desafio de projeto da DIO (Formação Node.js Fundamentals): carrinho de compras inspirado na Shopee, via terminal.
- Lógica de negócio isolada na classe `Cart` (adicionar, remover, alterar quantidade, calcular totais), desacoplada da CLI.
- Catálogo fixo de 6 produtos com controle de estoque: reserva ao adicionar, devolução ao remover/reduzir, nunca permite reservar além do disponível.
- Menu interativo de terminal (readline) para gerenciar o carrinho e finalizar a compra.
- Suíte de testes Jest cobrindo catálogo e toda a lógica do carrinho.

## Test plan
- [x] `npm test` passa em `carrinho-compras-shopee-nodejs/`
- [x] `npm start` executado manualmente, exercitando todas as opções do menu (listar, adicionar, remover, alterar quantidade, ver carrinho, finalizar, sair)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: Report the PR URL to the user**

The `gh pr create` command output includes the PR URL — share it as the final deliverable.
