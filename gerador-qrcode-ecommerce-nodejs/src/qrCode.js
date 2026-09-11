const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');

const OUTPUT_DIR = 'output';

async function generateQrCodeFile(url, fileName, deps = {}) {
  const toFile = deps.toFile || qrcode.toFile;

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const filePath = path.join(OUTPUT_DIR, `${fileName}.png`);
  await toFile(filePath, url);
  return filePath;
}

function generateQrCodeTerminal(url, deps = {}) {
  const generate = deps.generate || qrcodeTerminal.generate;

  return new Promise((resolve, reject) => {
    generate(url, { small: true }, (qrCodeAscii) => {
      if (!qrCodeAscii) {
        reject(new Error('Não foi possível gerar o QR Code no terminal.'));
        return;
      }
      resolve(qrCodeAscii);
    });
  });
}

module.exports = { generateQrCodeFile, generateQrCodeTerminal };
