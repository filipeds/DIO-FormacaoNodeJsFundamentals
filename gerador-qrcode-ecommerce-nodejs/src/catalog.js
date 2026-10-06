const PRODUCTS = [
  { id: 1, name: 'Tênis Esportivo Runner', url: 'https://loja.exemplo.com/produtos/tenis-esportivo-runner' },
  { id: 2, name: 'Fone de Ouvido Bluetooth Pro', url: 'https://loja.exemplo.com/produtos/fone-bluetooth-pro' },
  { id: 3, name: 'Smartwatch FitTrack', url: 'https://loja.exemplo.com/produtos/smartwatch-fittrack' },
  { id: 4, name: 'Mochila Notebook Urbana', url: 'https://loja.exemplo.com/produtos/mochila-notebook-urbana' },
  { id: 5, name: 'Cafeteira Elétrica Compacta', url: 'https://loja.exemplo.com/produtos/cafeteira-eletrica-compacta' },
  { id: 6, name: 'Luminária LED de Mesa', url: 'https://loja.exemplo.com/produtos/luminaria-led-mesa' },
];

function findProductById(products, id) {
  return products.find((product) => product.id === id);
}

module.exports = { PRODUCTS, findProductById };
