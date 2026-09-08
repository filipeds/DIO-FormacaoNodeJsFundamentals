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
