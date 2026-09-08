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
