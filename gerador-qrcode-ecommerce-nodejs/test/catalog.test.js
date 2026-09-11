const { PRODUCTS, findProductById } = require('../src/catalog');

test('PRODUCTS has 6 entries with id, name, and url', () => {
  expect(PRODUCTS).toHaveLength(6);
  PRODUCTS.forEach((product) => {
    expect(typeof product.id).toBe('number');
    expect(typeof product.name).toBe('string');
    expect(typeof product.url).toBe('string');
  });
});

test('findProductById returns the matching product', () => {
  const product = findProductById(PRODUCTS, 1);
  expect(product.name).toBe('Tênis Esportivo Runner');
});

test('findProductById returns undefined for an unknown id', () => {
  expect(findProductById(PRODUCTS, 999)).toBeUndefined();
});
