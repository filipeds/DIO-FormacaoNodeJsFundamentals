const { Character } = require('../src/race');

describe('Character', () => {
  test('starts with 0 points', () => {
    const mario = new Character({ name: 'Mario', speed: 4, handling: 3, power: 3 });
    expect(mario.points).toBe(0);
  });

  test('addPoints increases points', () => {
    const mario = new Character({ name: 'Mario', speed: 4, handling: 3, power: 3 });
    mario.addPoints(2);
    expect(mario.points).toBe(2);
  });

  test('addPoints never lets points go below 0', () => {
    const mario = new Character({ name: 'Mario', speed: 4, handling: 3, power: 3 });
    mario.addPoints(1);
    mario.addPoints(-2);
    expect(mario.points).toBe(0);
  });
});
