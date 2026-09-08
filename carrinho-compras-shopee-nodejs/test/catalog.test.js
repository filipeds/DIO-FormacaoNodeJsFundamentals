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
