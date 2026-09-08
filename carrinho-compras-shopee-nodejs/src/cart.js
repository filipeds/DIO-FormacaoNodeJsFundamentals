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

  removeItem(productId) {
    const quantity = this.items.get(productId);
    if (quantity === undefined) {
      throw new Error(`Produto com id ${productId} não está no carrinho.`);
    }

    const product = findProductById(this.products, productId);
    product.stock += quantity;
    this.items.delete(productId);
  }
}

module.exports = { Cart };
