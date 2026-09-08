const { Character, Race } = require('../src/race');

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

describe('Race - CONFRONTO rounds', () => {
  function makeConfrontoRace(rollSequence, randomSequence) {
    const mario = new Character({ name: 'Mario', speed: 4, handling: 3, power: 3 });
    const bowser = new Character({ name: 'Bowser', speed: 5, handling: 2, power: 5 });
    let rollCall = 0;
    const rollDice = () => rollSequence[rollCall++];
    const getRandomBlock = () => 'CONFRONTO';
    let randomCall = 0;
    jest.spyOn(Math, 'random').mockImplementation(() => randomSequence[randomCall++]);
    const race = new Race(mario, bowser, { rollDice, getRandomBlock });
    return { race, mario, bowser };
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('confronto winner gets turbo when the random roll favors it, loser gets shell', () => {
    // Mario: 5 + power(3) = 8, Bowser: 1 + power(5) = 6 -> Mario wins
    // random[0] < 0.5 -> SHELL penalty for Bowser, random[1] < 0.5 -> turbo awarded to Mario
    const { race, mario, bowser } = makeConfrontoRace([5, 1], [0.1, 0.1]);
    bowser.addPoints(3); // nonzero starting points so SHELL (-1) is distinguishable from BOMB (-2)
    const result = race.playRound(1);

    expect(result.winner).toBe(mario);
    expect(result.loser).toBe(bowser);
    expect(result.penalty).toBe('SHELL');
    expect(result.turboAwarded).toBe(true);
    expect(bowser.points).toBe(2); // 3 - 1 (SHELL)
    expect(mario.points).toBe(1); // turbo point
  });

  test('confronto loser gets bomb and winner gets no turbo when random rolls are high', () => {
    const { race, mario, bowser } = makeConfrontoRace([5, 1], [0.9, 0.9]);
    bowser.addPoints(3); // nonzero starting points so BOMB (-2) is distinguishable from SHELL (-1)
    const result = race.playRound(1);

    expect(result.penalty).toBe('BOMB');
    expect(result.turboAwarded).toBe(false);
    expect(bowser.points).toBe(1); // 3 - 2 (BOMB)
    expect(mario.points).toBe(0); // no turbo
  });

  test('confronto penalty never drops points below 0', () => {
    // Bowser starts at 1 point; a BOMB (-2) would go negative without the floor
    const { race, mario, bowser } = makeConfrontoRace([5, 1], [0.9, 0.9]);
    bowser.addPoints(1);
    race.playRound(1);
    expect(bowser.points).toBe(0); // 1 - 2 floors at 0, not -1
  });

  test('confronto tie applies no penalty and no turbo', () => {
    // Mario power(3): roll1=6 -> 9. Bowser power(5): roll2=4 -> 9. Tie.
    const { race, mario, bowser } = makeConfrontoRace([6, 4], [0.1, 0.1]);
    const result = race.playRound(1);
    expect(result.winner).toBeNull();
    expect(result.loser).toBeNull();
    expect(result.penalty).toBeNull();
    expect(result.turboAwarded).toBe(false);
    expect(mario.points).toBe(0);
    expect(bowser.points).toBe(0);
  });
});

describe('Race - run() and getResult()', () => {
  test('run() plays exactly 5 rounds and declares the character with more points as winner', () => {
    const mario = new Character({ name: 'Mario', speed: 4, handling: 3, power: 3 });
    const bowser = new Character({ name: 'Bowser', speed: 5, handling: 2, power: 5 });
    // Force 5 RETA rounds where Mario always wins: roll1=6, roll2=1 each round
    // Mario: 6 + speed(4) = 10, Bowser: 1 + speed(5) = 6
    let call = 0;
    const rolls = [6, 1, 6, 1, 6, 1, 6, 1, 6, 1];
    const rollDice = () => rolls[call++];
    const getRandomBlock = () => 'RETA';
    const race = new Race(mario, bowser, { rollDice, getRandomBlock });

    const result = race.run();

    expect(race.rounds).toHaveLength(5);
    expect(mario.points).toBe(5);
    expect(bowser.points).toBe(0);
    expect(result.winner).toBe(mario);
    expect(result.character1).toBe(mario);
    expect(result.character2).toBe(bowser);
    expect(result.rounds).toHaveLength(5);
  });

  test('run() declares a tie when points are equal', () => {
    const mario = new Character({ name: 'Mario', speed: 4, handling: 3, power: 3 });
    const bowser = new Character({ name: 'Bowser', speed: 5, handling: 2, power: 5 });
    // Every round ties: roll1=5, roll2=4 -> Mario 5+4=9, Bowser 4+5=9
    let call = 0;
    const rolls = [5, 4, 5, 4, 5, 4, 5, 4, 5, 4];
    const rollDice = () => rolls[call++];
    const getRandomBlock = () => 'RETA';
    const race = new Race(mario, bowser, { rollDice, getRandomBlock });

    const result = race.run();

    expect(mario.points).toBe(0);
    expect(bowser.points).toBe(0);
    expect(result.winner).toBeNull();
  });
});
