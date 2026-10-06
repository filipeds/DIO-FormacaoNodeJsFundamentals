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
