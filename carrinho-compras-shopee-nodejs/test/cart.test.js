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
