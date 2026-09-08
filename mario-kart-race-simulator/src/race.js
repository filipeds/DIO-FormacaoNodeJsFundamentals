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
