const { BLOCKS, getRandomBlock } = require('../src/track');

test('BLOCKS contains exactly the three valid block types', () => {
  expect(BLOCKS).toEqual(['RETA', 'CURVA', 'CONFRONTO']);
});

test('getRandomBlock always returns a valid block type', () => {
  for (let i = 0; i < 200; i++) {
    expect(BLOCKS).toContain(getRandomBlock());
  }
});
