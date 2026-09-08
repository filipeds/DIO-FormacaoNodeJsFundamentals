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
