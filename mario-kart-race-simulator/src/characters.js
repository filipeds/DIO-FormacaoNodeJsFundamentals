const CHARACTERS = [
  { name: 'Mario', speed: 4, handling: 3, power: 3 },
  { name: 'Peach', speed: 3, handling: 4, power: 2 },
  { name: 'Yoshi', speed: 2, handling: 4, power: 3 },
  { name: 'Bowser', speed: 5, handling: 2, power: 5 },
  { name: 'Luigi', speed: 3, handling: 4, power: 4 },
  { name: 'Donkey Kong', speed: 2, handling: 2, power: 5 },
];

function pickTwoRandomCharacters() {
  const pool = [...CHARACTERS];
  const [first] = pool.splice(Math.floor(Math.random() * pool.length), 1);
  const [second] = pool.splice(Math.floor(Math.random() * pool.length), 1);
  return [first, second];
}

module.exports = { CHARACTERS, pickTwoRandomCharacters };
