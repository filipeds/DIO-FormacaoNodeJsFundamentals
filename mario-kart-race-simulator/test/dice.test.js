const { rollDice } = require('../src/dice');

test('rollDice always returns an integer between 1 and 6', () => {
  for (let i = 0; i < 200; i++) {
    const result = rollDice();
    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
  }
});
