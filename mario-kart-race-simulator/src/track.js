const BLOCKS = ['RETA', 'CURVA', 'CONFRONTO'];

function getRandomBlock() {
  return BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
}

module.exports = { BLOCKS, getRandomBlock };
