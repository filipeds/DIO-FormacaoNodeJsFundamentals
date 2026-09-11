require('dotenv').config();
const { startCli } = require('./cli');

function main() {
  console.log('Bem-vindo ao Gerador de QR Code para E-commerce!');
  startCli().catch((error) => {
    console.error(`Erro inesperado: ${error.message}`);
  });
}

if (require.main === module) {
  main();
}

module.exports = { main };
