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
}

module.exports = { Cart };
