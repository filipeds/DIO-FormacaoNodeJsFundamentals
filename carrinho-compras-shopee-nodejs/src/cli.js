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
