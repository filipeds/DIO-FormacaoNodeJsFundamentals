const readline = require('readline');
const { PRODUCTS, findProductById } = require('./catalog');
const { generateQrCodeFile, generateQrCodeTerminal } = require('./qrCode');
const { loadPasswordConfig, generatePassword } = require('./password');

const MENU = `
===== Gerador de QR Code para E-commerce =====
1) Gerar QR Code de um produto
2) Gerar senha segura
0) Sair
`;

function listProducts() {
  console.log('\n--- Produtos disponíveis ---');
  PRODUCTS.forEach((product) => {
    console.log(`${product.id}) ${product.name}`);
  });
}

function sanitizeFileName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function handleGenerateQrCode(ask) {
  listProducts();
  const id = Number((await ask('Escolha o id do produto: ')).trim());
  const product = findProductById(PRODUCTS, id);

  if (!product) {
    console.log(`Erro: Produto com id ${id} não encontrado.`);
    return;
  }

  const format = (await ask('Formato (1- PNG em arquivo, 2- ASCII no terminal): ')).trim();

  if (format === '1') {
    const fileName = `${product.id}-${sanitizeFileName(product.name)}`;
    try {
      const filePath = await generateQrCodeFile(product.url, fileName);
      console.log(`QR Code salvo em: ${filePath}`);
    } catch (error) {
      console.log(`Erro: ${error.message}`);
    }
  } else if (format === '2') {
    try {
      const ascii = await generateQrCodeTerminal(product.url);
      console.log(`\nQR Code de ${product.name}:\n`);
      console.log(ascii);
    } catch (error) {
      console.log(`Erro: ${error.message}`);
    }
  } else {
    console.log('Erro: formato inválido. Escolha 1 ou 2.');
  }
}

function handleGeneratePassword() {
  try {
    const config = loadPasswordConfig();
    const password = generatePassword(config);
    console.log(`Senha gerada: ${password}`);
  } catch (error) {
    console.log(`Erro: ${error.message}`);
  }
}

function startCli() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

  async function promptMenu() {
    console.log(MENU);
    const choice = (await ask('Escolha uma opção: ')).trim();

    switch (choice) {
      case '1':
        await handleGenerateQrCode(ask);
        return promptMenu();
      case '2':
        handleGeneratePassword();
        return promptMenu();
      case '0':
        console.log('Até logo!');
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
