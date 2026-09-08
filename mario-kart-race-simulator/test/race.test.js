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

const { Race } = require('../src/race');

describe('Race - RETA/CURVA rounds', () => {
  function makeRace(rollSequence, block) {
    const mario = new Character({ name: 'Mario', speed: 4, handling: 3, power: 3 });
    const bowser = new Character({ name: 'Bowser', speed: 5, handling: 2, power: 5 });
    let call = 0;
    const rollDice = () => rollSequence[call++];
    const getRandomBlock = () => block;
    const race = new Race(mario, bowser, { rollDice, getRandomBlock });
    return { race, mario, bowser };
  }

  test('RETA round: higher (roll + speed) wins 1 point', () => {
    // Mario: 2 + speed(4) = 6, Bowser: 1 + speed(5) = 6 -> tie first, then a winning case below
    const { race, mario, bowser } = makeRace([3, 1], 'RETA');
    const result = race.playRound(1);
    // Mario: 3 + 4 = 7, Bowser: 1 + 5 = 6 -> Mario wins
    expect(result.winner).toBe(mario);
    expect(mario.points).toBe(1);
    expect(bowser.points).toBe(0);
  });

  test('CURVA round: higher (roll + handling) wins 1 point', () => {
    const { race, mario, bowser } = makeRace([1, 6], 'CURVA');
    const result = race.playRound(1);
    // Mario: 1 + handling(3) = 4, Bowser: 6 + handling(2) = 8 -> Bowser wins
    expect(result.winner).toBe(bowser);
    expect(bowser.points).toBe(1);
    expect(mario.points).toBe(0);
  });

  test('tie in RETA/CURVA awards no point to anyone', () => {
    // Mario speed(4): roll1=5 -> 9. Bowser speed(5): roll2=4 -> 9. Tie.
    const { race, mario, bowser } = makeRace([5, 4], 'RETA');
    const result = race.playRound(1);
    expect(result.winner).toBeNull();
    expect(mario.points).toBe(0);
    expect(bowser.points).toBe(0);
  });
});
