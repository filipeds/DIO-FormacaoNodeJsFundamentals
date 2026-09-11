const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');

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

module.exports = { generateQrCodeFile };
