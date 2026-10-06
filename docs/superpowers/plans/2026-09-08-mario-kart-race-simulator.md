# Simulador de Corridas Mario Kart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Node.js Mario Kart race simulator (portfolio challenge from DIO's Formação Node.js Fundamentals) in `mario-kart-race-simulator/`, on branch `feat/simulador-corridas-mario-kart`, with tests, then open a PR to `main`.

**Architecture:** Small CommonJS modules with single responsibilities (`dice.js`, `track.js`, `characters.js`, `race.js`, `index.js`), each with a matching Jest test file. `Race` takes `rollDice`/`getRandomBlock` as injectable dependencies (defaulting to the real modules) so round outcomes are deterministic in tests.

**Tech Stack:** Node.js (CommonJS, no transpilation), Jest for testing, no runtime dependencies.

## Global Constraints

- Race is exactly 5 rounds (spec: "A corrida tem exatamente 5 rodadas").
- Block types: RETA, CURVA, CONFRONTO — equal probability (spec).
- RETA uses `speed`, CURVA uses `handling`, CONFRONTO uses `power` (spec).
- CONFRONTO winner: random turbo chance of +1 point. CONFRONTO loser: random penalty of shell (-1) or bomb (-2) (spec, from `extras.md`).
- Points can never go negative (spec).
- 6 fixed characters from the reference README: Mario, Peach, Yoshi, Bowser, Luigi, Donkey Kong, with the exact attribute values in the spec table (spec).
- Two distinct characters are randomly drawn from the 6 for each run (spec — no manual selection, out of scope).
- No runtime dependencies beyond Node.js itself; Jest is a devDependency only.

---

### Task 1: Project scaffold + dice module

**Files:**
- Create: `mario-kart-race-simulator/package.json`
- Create: `mario-kart-race-simulator/.gitignore`
- Create: `mario-kart-race-simulator/src/dice.js`
- Test: `mario-kart-race-simulator/test/dice.test.js`

**Interfaces:**
- Produces: `dice.js` exports `rollDice(): number` — integer in `[1, 6]`.

- [ ] **Step 1: Create the project folder and package.json**

Create `mario-kart-race-simulator/package.json`:

```json
{
  "name": "mario-kart-race-simulator",
  "version": "1.0.0",
  "description": "Simulador de corridas do Mario Kart - desafio de projeto da DIO (Formação Node.js Fundamentals)",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  },
  "license": "ISC"
}
```

Create `mario-kart-race-simulator/.gitignore`:

```
node_modules/
```

- [ ] **Step 2: Install dependencies**

Run (from `mario-kart-race-simulator/`): `npm install`
Expected: `node_modules/` created, `package-lock.json` created, no errors.

- [ ] **Step 3: Write the failing test**

Create `mario-kart-race-simulator/test/dice.test.js`:

```js
const { rollDice } = require('../src/dice');

test('rollDice always returns an integer between 1 and 6', () => {
  for (let i = 0; i < 200; i++) {
    const result = rollDice();
    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
  }
});
```

- [ ] **Step 4: Run test to verify it fails**

Run (from `mario-kart-race-simulator/`): `npx jest test/dice.test.js`
Expected: FAIL — `Cannot find module '../src/dice'`

- [ ] **Step 5: Write minimal implementation**

Create `mario-kart-race-simulator/src/dice.js`:

```js
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

module.exports = { rollDice };
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx jest test/dice.test.js`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add mario-kart-race-simulator/package.json mario-kart-race-simulator/.gitignore mario-kart-race-simulator/src/dice.js mario-kart-race-simulator/test/dice.test.js mario-kart-race-simulator/package-lock.json
git commit -m "feat: scaffold mario-kart-race-simulator project with dice module"
```

---

### Task 2: Track module

**Files:**
- Create: `mario-kart-race-simulator/src/track.js`
- Test: `mario-kart-race-simulator/test/track.test.js`

**Interfaces:**
- Produces: `track.js` exports `BLOCKS: string[]` (`['RETA', 'CURVA', 'CONFRONTO']`) and `getRandomBlock(): string` — one of `BLOCKS`.

- [ ] **Step 1: Write the failing test**

Create `mario-kart-race-simulator/test/track.test.js`:

```js
const { BLOCKS, getRandomBlock } = require('../src/track');

test('BLOCKS contains exactly the three valid block types', () => {
  expect(BLOCKS).toEqual(['RETA', 'CURVA', 'CONFRONTO']);
});

test('getRandomBlock always returns a valid block type', () => {
  for (let i = 0; i < 200; i++) {
    expect(BLOCKS).toContain(getRandomBlock());
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest test/track.test.js`
Expected: FAIL — `Cannot find module '../src/track'`

- [ ] **Step 3: Write minimal implementation**

Create `mario-kart-race-simulator/src/track.js`:

```js
const BLOCKS = ['RETA', 'CURVA', 'CONFRONTO'];

function getRandomBlock() {
  return BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
}

module.exports = { BLOCKS, getRandomBlock };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest test/track.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add mario-kart-race-simulator/src/track.js mario-kart-race-simulator/test/track.test.js
git commit -m "feat: add track block sorting module"
```

---

### Task 3: Characters module

**Files:**
- Create: `mario-kart-race-simulator/src/characters.js`
- Test: `mario-kart-race-simulator/test/characters.test.js`

**Interfaces:**
- Produces: `characters.js` exports `CHARACTERS: {name: string, speed: number, handling: number, power: number}[]` (6 entries) and `pickTwoRandomCharacters(): [Character, Character]` returning two distinct entries from `CHARACTERS`.

- [ ] **Step 1: Write the failing test**

Create `mario-kart-race-simulator/test/characters.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest test/characters.test.js`
Expected: FAIL — `Cannot find module '../src/characters'`

- [ ] **Step 3: Write minimal implementation**

Create `mario-kart-race-simulator/src/characters.js`:

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest test/characters.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add mario-kart-race-simulator/src/characters.js mario-kart-race-simulator/test/characters.test.js
git commit -m "feat: add character roster and random pairing"
```

---

### Task 4: Character class (points that never go negative)

**Files:**
- Create: `mario-kart-race-simulator/src/race.js`
- Test: `mario-kart-race-simulator/test/race.test.js`

**Interfaces:**
- Consumes: nothing yet (Character is standalone).
- Produces: `race.js` exports `Character` — `new Character({name, speed, handling, power})` with fields `name, speed, handling, power, points` (points starts at 0) and method `addPoints(amount: number): void` that adds `amount` to `points`, floored at 0.

- [ ] **Step 1: Write the failing test**

Create `mario-kart-race-simulator/test/race.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest test/race.test.js`
Expected: FAIL — `Cannot find module '../src/race'`

- [ ] **Step 3: Write minimal implementation**

Create `mario-kart-race-simulator/src/race.js`:

```js
class Character {
  constructor({ name, speed, handling, power }) {
    this.name = name;
    this.speed = speed;
    this.handling = handling;
    this.power = power;
    this.points = 0;
  }

  addPoints(amount) {
    this.points = Math.max(0, this.points + amount);
  }
}

module.exports = { Character };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest test/race.test.js`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add mario-kart-race-simulator/src/race.js mario-kart-race-simulator/test/race.test.js
git commit -m "feat: add Character class with non-negative points"
```

---

### Task 5: Race class — RETA/CURVA skill-test rounds

**Files:**
- Modify: `mario-kart-race-simulator/src/race.js`
- Modify: `mario-kart-race-simulator/test/race.test.js`

**Interfaces:**
- Consumes: `Character` from Task 4; `rollDice` from `./dice` (Task 1); `getRandomBlock` from `./track` (Task 2).
- Produces: `Race` class — `new Race(character1, character2, deps = {})` where `deps.rollDice` and `deps.getRandomBlock` default to the real modules. Method `playRound(round: number): {round, block, roll1, roll2, total1, total2, winner}` for a single RETA/CURVA round (CONFRONTO handled in Task 6).

- [ ] **Step 1: Write the failing test**

Add to `mario-kart-race-simulator/test/race.test.js` (append, keep existing `Character` describe block):

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest test/race.test.js`
Expected: FAIL — `Race is not a constructor` (or `TypeError: race.playRound is not a function`)

- [ ] **Step 3: Write minimal implementation**

Replace the contents of `mario-kart-race-simulator/src/race.js` with:

```js
const { rollDice } = require('./dice');
const { getRandomBlock } = require('./track');

class Character {
  constructor({ name, speed, handling, power }) {
    this.name = name;
    this.speed = speed;
    this.handling = handling;
    this.power = power;
    this.points = 0;
  }

  addPoints(amount) {
    this.points = Math.max(0, this.points + amount);
  }
}

class Race {
  constructor(character1, character2, deps = {}) {
    this.character1 = character1;
    this.character2 = character2;
    this.rollDice = deps.rollDice || rollDice;
    this.getRandomBlock = deps.getRandomBlock || getRandomBlock;
    this.rounds = [];
  }

  playRound(round) {
    const block = this.getRandomBlock();
    const roll1 = this.rollDice();
    const roll2 = this.rollDice();
    return this.resolveSkillTest(round, block, roll1, roll2);
  }

  resolveSkillTest(round, block, roll1, roll2) {
    const attribute = block === 'RETA' ? 'speed' : 'handling';
    const total1 = roll1 + this.character1[attribute];
    const total2 = roll2 + this.character2[attribute];

    let winner = null;
    if (total1 > total2) {
      this.character1.addPoints(1);
      winner = this.character1;
    } else if (total2 > total1) {
      this.character2.addPoints(1);
      winner = this.character2;
    }

    return { round, block, roll1, roll2, total1, total2, winner };
  }
}

module.exports = { Character, Race };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest test/race.test.js`
Expected: PASS (all `Character` and `Race - RETA/CURVA rounds` tests)

- [ ] **Step 5: Commit**

```bash
git add mario-kart-race-simulator/src/race.js mario-kart-race-simulator/test/race.test.js
git commit -m "feat: add Race RETA/CURVA round resolution"
```

---

### Task 6: Race class — CONFRONTO (shell/bomb penalty + turbo)

**Files:**
- Modify: `mario-kart-race-simulator/src/race.js`
- Modify: `mario-kart-race-simulator/test/race.test.js`

**Interfaces:**
- Consumes: `Character`, `Race` from Task 5.
- Produces: `Race.playRound` now also handles `'CONFRONTO'`, returning `{round, block: 'CONFRONTO', roll1, roll2, total1, total2, winner, loser, penalty: 'SHELL'|'BOMB'|null, turboAwarded: boolean}`. Exports `PENALTIES = { SHELL: -1, BOMB: -2 }` from `race.js`.

- [ ] **Step 1: Write the failing test**

Add to `mario-kart-race-simulator/test/race.test.js`:

```js
const { PENALTIES } = require('../src/race');

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
    const result = race.playRound(1);

    expect(result.winner).toBe(mario);
    expect(result.loser).toBe(bowser);
    expect(result.penalty).toBe('SHELL');
    expect(result.turboAwarded).toBe(true);
    expect(bowser.points).toBe(0); // was 0, penalty floors at 0
    expect(mario.points).toBe(1); // turbo point
  });

  test('confronto loser gets bomb and winner gets no turbo when random rolls are high', () => {
    const { race, mario, bowser } = makeConfrontoRace([5, 1], [0.9, 0.9]);
    const result = race.playRound(1);

    expect(result.penalty).toBe('BOMB');
    expect(result.turboAwarded).toBe(false);
    expect(mario.points).toBe(0); // no turbo
  });

  test('confronto penalty never drops points below 0', () => {
    const { race, mario, bowser } = makeConfrontoRace([5, 1], [0.9, 0.9]);
    race.playRound(1);
    expect(bowser.points).toBe(0);
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest test/race.test.js`
Expected: FAIL — CONFRONTO round falls through `resolveSkillTest` using `undefined` attribute, or `PENALTIES` is `undefined` (not exported yet), causing assertion failures on `result.penalty`/`result.turboAwarded`.

- [ ] **Step 3: Write minimal implementation**

Replace `mario-kart-race-simulator/src/race.js` with:

```js
const { rollDice } = require('./dice');
const { getRandomBlock } = require('./track');

const PENALTIES = { SHELL: -1, BOMB: -2 };

class Character {
  constructor({ name, speed, handling, power }) {
    this.name = name;
    this.speed = speed;
    this.handling = handling;
    this.power = power;
    this.points = 0;
  }

  addPoints(amount) {
    this.points = Math.max(0, this.points + amount);
  }
}

class Race {
  constructor(character1, character2, deps = {}) {
    this.character1 = character1;
    this.character2 = character2;
    this.rollDice = deps.rollDice || rollDice;
    this.getRandomBlock = deps.getRandomBlock || getRandomBlock;
    this.rounds = [];
  }

  playRound(round) {
    const block = this.getRandomBlock();
    const roll1 = this.rollDice();
    const roll2 = this.rollDice();

    if (block === 'CONFRONTO') {
      return this.resolveConfronto(round, roll1, roll2);
    }
    return this.resolveSkillTest(round, block, roll1, roll2);
  }

  resolveSkillTest(round, block, roll1, roll2) {
    const attribute = block === 'RETA' ? 'speed' : 'handling';
    const total1 = roll1 + this.character1[attribute];
    const total2 = roll2 + this.character2[attribute];

    let winner = null;
    if (total1 > total2) {
      this.character1.addPoints(1);
      winner = this.character1;
    } else if (total2 > total1) {
      this.character2.addPoints(1);
      winner = this.character2;
    }

    return { round, block, roll1, roll2, total1, total2, winner };
  }

  resolveConfronto(round, roll1, roll2) {
    const total1 = roll1 + this.character1.power;
    const total2 = roll2 + this.character2.power;

    let winner = null;
    let loser = null;
    if (total1 > total2) {
      winner = this.character1;
      loser = this.character2;
    } else if (total2 > total1) {
      winner = this.character2;
      loser = this.character1;
    }

    let penalty = null;
    let turboAwarded = false;

    if (winner && loser) {
      penalty = Math.random() < 0.5 ? 'SHELL' : 'BOMB';
      loser.addPoints(PENALTIES[penalty]);

      turboAwarded = Math.random() < 0.5;
      if (turboAwarded) {
        winner.addPoints(1);
      }
    }

    return {
      round,
      block: 'CONFRONTO',
      roll1,
      roll2,
      total1,
      total2,
      winner,
      loser,
      penalty,
      turboAwarded,
    };
  }
}

module.exports = { Character, Race, PENALTIES };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest test/race.test.js`
Expected: PASS (all `Character`, `Race - RETA/CURVA rounds`, and `Race - CONFRONTO rounds` tests)

- [ ] **Step 5: Commit**

```bash
git add mario-kart-race-simulator/src/race.js mario-kart-race-simulator/test/race.test.js
git commit -m "feat: add Race CONFRONTO mechanic with shell/bomb penalty and turbo"
```

---

### Task 7: Race class — full run() and getResult()

**Files:**
- Modify: `mario-kart-race-simulator/src/race.js`
- Modify: `mario-kart-race-simulator/test/race.test.js`

**Interfaces:**
- Consumes: `Race.playRound` from Task 6.
- Produces: `Race.run(): {character1, character2, winner, rounds}` — runs exactly 5 rounds via `playRound`, appends each round result to `this.rounds`, and returns the final summary via `getResult()`. `getResult()` returns `winner: Character|null` (`null` on tie).

- [ ] **Step 1: Write the failing test**

Add to `mario-kart-race-simulator/test/race.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest test/race.test.js`
Expected: FAIL — `race.run is not a function`

- [ ] **Step 3: Write minimal implementation**

In `mario-kart-race-simulator/src/race.js`, add `run()` and `getResult()` methods to the `Race` class (insert after `playRound`, before `resolveSkillTest`):

```js
  run() {
    for (let round = 1; round <= 5; round++) {
      this.rounds.push(this.playRound(round));
    }
    return this.getResult();
  }

  getResult() {
    let winner = null;
    if (this.character1.points > this.character2.points) winner = this.character1;
    else if (this.character2.points > this.character1.points) winner = this.character2;

    return {
      character1: this.character1,
      character2: this.character2,
      winner,
      rounds: this.rounds,
    };
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest test/race.test.js`
Expected: PASS (all tests in the file)

- [ ] **Step 5: Run the full test suite**

Run (from `mario-kart-race-simulator/`): `npm test`
Expected: All test files (`dice.test.js`, `track.test.js`, `characters.test.js`, `race.test.js`) PASS.

- [ ] **Step 6: Commit**

```bash
git add mario-kart-race-simulator/src/race.js mario-kart-race-simulator/test/race.test.js
git commit -m "feat: add Race run() and getResult() for full 5-round race"
```

---

### Task 8: Entry point (index.js) with console log output

**Files:**
- Create: `mario-kart-race-simulator/src/index.js`

**Interfaces:**
- Consumes: `pickTwoRandomCharacters` from `characters.js` (Task 3), `Character`/`Race` from `race.js` (Task 7).
- Produces: running `node src/index.js` prints a round-by-round log and a final result, mirroring the reference project's console output style.

- [ ] **Step 1: Write the implementation**

Create `mario-kart-race-simulator/src/index.js`:

```js
const { pickTwoRandomCharacters } = require('./characters');
const { Character, Race } = require('./race');

function describeRound(result) {
  console.log(`\n🏁 Rodada ${result.round} — Bloco: ${result.block}`);

  if (result.block === 'CONFRONTO') {
    console.log(`Confronto de PODER: ${result.total1} x ${result.total2}`);
    if (result.winner) {
      console.log(`${result.winner.name} venceu o confronto! 🥊`);
      console.log(
        result.turboAwarded
          ? `${result.winner.name} ganhou um turbo! +1 ponto 🚀`
          : `${result.winner.name} não ganhou turbo desta vez.`
      );
      const penaltyLabel = result.penalty === 'SHELL' ? 'casco 🐢 (-1 ponto)' : 'bomba 💣 (-2 pontos)';
      console.log(`${result.loser.name} foi atingido por um ${penaltyLabel}`);
    } else {
      console.log('Confronto empatado! Nenhum efeito.');
    }
  } else {
    console.log(`Resultado: ${result.total1} x ${result.total2}`);
    console.log(result.winner ? `${result.winner.name} marcou um ponto!` : 'Rodada empatada, ninguém pontua.');
  }
}

function declareWinner(result) {
  console.log('\n===== Resultado final =====');
  console.log(`${result.character1.name}: ${result.character1.points} ponto(s)`);
  console.log(`${result.character2.name}: ${result.character2.points} ponto(s)`);

  if (result.winner) {
    console.log(`\n🏆 ${result.winner.name} venceu a corrida! Parabéns!`);
  } else {
    console.log('\nA corrida terminou em empate!');
  }
}

function main() {
  const [data1, data2] = pickTwoRandomCharacters();
  const character1 = new Character(data1);
  const character2 = new Character(data2);

  console.log(`🚨 Corrida entre ${character1.name} e ${character2.name} começando...`);

  const race = new Race(character1, character2);
  race.run();

  race.rounds.forEach(describeRound);
  declareWinner(race.getResult());
}

if (require.main === module) {
  main();
}

module.exports = { main };
```

- [ ] **Step 2: Manually run and inspect output**

Run (from `mario-kart-race-simulator/`): `npm start`
Expected: Console prints a start banner, 5 round descriptions (with confronto rounds showing penalty/turbo), and a final result with a winner or tie declared. Run it 3-4 times to see different characters and outcomes.

- [ ] **Step 3: Run the full test suite once more**

Run: `npm test`
Expected: All existing tests still PASS (index.js has no direct unit tests — it's covered by manual verification since it's pure orchestration/console output already exercised by `Race` tests).

- [ ] **Step 4: Commit**

```bash
git add mario-kart-race-simulator/src/index.js
git commit -m "feat: add CLI entry point that runs and prints the race"
```

---

### Task 9: Project README

**Files:**
- Create: `mario-kart-race-simulator/README.md`

**Interfaces:**
- None (documentation only).

- [ ] **Step 1: Write the README**

Create `mario-kart-race-simulator/README.md`:

```markdown
# 🏁 Simulador de Corridas Mario Kart

Desafio de projeto da trilha **Formação Node.js Fundamentals** da [DIO](https://www.dio.me/).

Projeto de referência: [digitalinnovationone/formacao-nodejs — 03-projeto-mario-kart](https://github.com/digitalinnovationone/formacao-nodejs/tree/main/03-projeto-mario-kart)

## Sobre o desafio

Simular uma corrida de Mario Kart entre dois personagens sorteados
aleatoriamente, disputando 5 rodadas em blocos de pista sorteados (reta,
curva ou confronto), cada um testando um atributo diferente do personagem.

Esta versão vai além do script de referência (que usava dois personagens
fixos e funções soltas):

- **6 personagens** sorteáveis (Mario, Peach, Yoshi, Bowser, Luigi, Donkey Kong).
- Código orientado a objetos (`Character`, `Race`), com módulos separados por
  responsabilidade (`dice`, `track`, `characters`, `race`).
- Implementa a mecânica bônus descrita no `extras.md` do projeto original:
  no confronto, quem perde é atingido por um **casco** (-1 ponto) ou uma
  **bomba** (-2 pontos), sorteado aleatoriamente; quem vence tem chance de
  ganhar um **turbo** (+1 ponto).
- Pontuação nunca fica negativa.
- Suíte de testes automatizados com Jest.

## Regras

- A corrida tem 5 rodadas.
- A cada rodada é sorteado um bloco: `RETA`, `CURVA` ou `CONFRONTO`.
  - `RETA`: cada personagem rola 1d6 + `VELOCIDADE`; maior total marca 1 ponto.
  - `CURVA`: cada personagem rola 1d6 + `MANOBRABILIDADE`; maior total marca 1 ponto.
  - `CONFRONTO`: cada personagem rola 1d6 + `PODER`; quem vence pode ganhar um
    turbo (+1 ponto, sorteado); quem perde sofre casco (-1) ou bomba (-2),
    sorteado.
- Pontuação nunca é negativa.
- Ao final das 5 rodadas, vence quem tiver mais pontos (empate é possível).

## Como rodar

```bash
cd mario-kart-race-simulator
npm install
npm start
```

## Como testar

```bash
npm test
```

## Estrutura

```
src/
├── characters.js   # roster de personagens e sorteio de 2 competidores
├── dice.js         # rolagem de dado de 6 lados
├── track.js        # sorteio do bloco de pista
├── race.js         # classes Character e Race (motor da corrida)
└── index.js         # ponto de entrada (CLI)
test/                # testes Jest para cada módulo
```
```

- [ ] **Step 2: Commit**

```bash
git add mario-kart-race-simulator/README.md
git commit -m "docs: add project README for the mario kart race simulator"
```

---

### Task 10: Push branch and open PR

**Files:** none (git/GitHub operations only).

- [ ] **Step 1: Verify all tests pass and branch is correct**

Run: `git branch --show-current`
Expected: `feat/simulador-corridas-mario-kart`

Run (from `mario-kart-race-simulator/`): `npm test`
Expected: All tests PASS.

- [ ] **Step 2: Push the branch**

```bash
git push -u origin feat/simulador-corridas-mario-kart
```

- [ ] **Step 3: Open the PR**

```bash
gh pr create --title "feat: simulador de corridas Mario Kart" --body "$(cat <<'EOF'
## Summary
- Desafio de projeto da DIO (Formação Node.js Fundamentals): simulador de corridas Mario Kart.
- Reescrito com classes (`Character`, `Race`) e módulos separados por responsabilidade.
- Sorteia 2 dos 6 personagens de referência a cada execução.
- Implementa a mecânica bônus do `extras.md` do projeto original (casco/bomba na derrota, turbo na vitória do confronto).
- Pontuação nunca fica negativa.
- Suíte de testes Jest cobrindo dado, pista, personagens e motor da corrida.

## Test plan
- [x] `npm test` passa em `mario-kart-race-simulator/`
- [x] `npm start` executado manualmente algumas vezes, log de rodadas e resultado final conferidos

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: Report the PR URL to the user**

The `gh pr create` command output includes the PR URL — share it as the final deliverable.
