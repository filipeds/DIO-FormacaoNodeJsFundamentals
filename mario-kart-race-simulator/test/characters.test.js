const { CHARACTERS, pickTwoRandomCharacters } = require('../src/characters');

test('CHARACTERS has the 6 reference roster entries with correct attributes', () => {
  expect(CHARACTERS).toEqual([
    { name: 'Mario', speed: 4, handling: 3, power: 3 },
    { name: 'Peach', speed: 3, handling: 4, power: 2 },
    { name: 'Yoshi', speed: 2, handling: 4, power: 3 },
    { name: 'Bowser', speed: 5, handling: 2, power: 5 },
    { name: 'Luigi', speed: 3, handling: 4, power: 4 },
    { name: 'Donkey Kong', speed: 2, handling: 2, power: 5 },
  ]);
});

test('pickTwoRandomCharacters always returns two distinct characters from the roster', () => {
  for (let i = 0; i < 50; i++) {
    const [a, b] = pickTwoRandomCharacters();
    expect(a.name).not.toBe(b.name);
    expect(CHARACTERS).toContainEqual(a);
    expect(CHARACTERS).toContainEqual(b);
  }
});
