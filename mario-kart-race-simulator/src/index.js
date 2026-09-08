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
      const penaltyLabel = result.penalty === 'SHELL' ? 'um casco 🐢 (-1 ponto)' : 'uma bomba 💣 (-2 pontos)';
      console.log(`${result.loser.name} foi atingido por ${penaltyLabel}`);
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
