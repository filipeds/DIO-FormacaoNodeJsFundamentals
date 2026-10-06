const { Cart } = require('./cart');
const { startCli } = require('./cli');

function main() {
  const cart = new Cart();
  console.log('Bem-vindo ao Carrinho de Compras Shopee!');
  startCli(cart).catch((error) => {
    console.error(`Erro inesperado: ${error.message}`);
  });
}

if (require.main === module) {
  main();
}

module.exports = { main };
