# Simulador de Corridas Mario Kart — Design

## Contexto

Desafio de projeto da trilha "Formação Node.js Fundamentals" da DIO. O projeto
de referência (`digitalinnovationone/formacao-nodejs/03-projeto-mario-kart`) é
um script procedural (`src/index.js`) que simula uma corrida entre dois
personagens fixos (Mario x Luigi) ao longo de 5 rodadas. A cada rodada é
sorteado um bloco de pista (RETA, CURVA ou CONFRONTO); os jogadores rolam um
dado de 6 lados e somam o atributo correspondente. O `extras.md` do projeto de
referência descreve uma mecânica bônus de CONFRONTO (casco/bomba na derrota,
turbo na vitória) que **não** está implementada no `index.js` original.

Esta entrega replica e melhora o projeto original: reescreve a lógica com
classes, sorteia os competidores entre os 6 personagens do README de
referência, implementa a mecânica bônus do `extras.md`, e adiciona testes
automatizados.

## Objetivo

Entregar, no repositório `filipeds/DIO-FormacaoNodeJsFundamentals`, um projeto
Node.js funcional na pasta `mario-kart-race-simulator/`, na branch
`feat/simulador-corridas-mario-kart`, com PR aberto para `main`.

## Personagens

6 personagens fixos (dados do README de referência), cada um com
VELOCIDADE, MANOBRABILIDADE e PODER:

| Personagem | Velocidade | Manobrabilidade | Poder |
|---|---|---|---|
| Mario | 4 | 3 | 3 |
| Peach | 3 | 4 | 2 |
| Yoshi | 2 | 4 | 3 |
| Bowser | 5 | 2 | 5 |
| Luigi | 3 | 4 | 4 |
| Donkey Kong | 2 | 2 | 5 |

A cada execução, 2 personagens distintos são sorteados aleatoriamente entre
os 6 para disputar a corrida.

## Regras da corrida

- A corrida tem exatamente 5 rodadas.
- A cada rodada, sorteia-se um bloco: RETA, CURVA ou CONFRONTO
  (probabilidade igual entre os três).
- **RETA**: cada jogador rola 1d6 e soma VELOCIDADE. Quem tiver o maior
  total ganha 1 ponto. Empate não pontua.
- **CURVA**: cada jogador rola 1d6 e soma MANOBRABILIDADE. Quem tiver o
  maior total ganha 1 ponto. Empate não pontua.
- **CONFRONTO**: cada jogador rola 1d6 e soma PODER.
  - Quem tiver o maior total vence o confronto e ganha um **turbo**: sorteio
    aleatório decide se ganha +1 ponto ou não (mecânica de "turbo aleatório"
    do `extras.md`).
  - Quem perde o confronto sofre uma penalidade sorteada aleatoriamente
    entre **casco** (-1 ponto) ou **bomba** (-2 pontos).
  - Empate no confronto: nenhum efeito.
- A pontuação de um jogador nunca fica negativa; penalidades que levariam a
  pontuação abaixo de 0 são travadas em 0.
- Ao final das 5 rodadas, vence quem tiver mais pontos. Pontuação igual é
  empate.

## Arquitetura

```
mario-kart-race-simulator/
├── package.json
├── README.md
├── src/
│   ├── characters.js   // dados dos personagens + sorteio de 2 distintos
│   ├── dice.js         // rollDice(): inteiro 1-6
│   ├── track.js        // getRandomBlock(): "RETA" | "CURVA" | "CONFRONTO"
│   ├── race.js         // classes Character e Race
│   └── index.js         // ponto de entrada: monta e roda a corrida, imprime log
└── test/
    ├── dice.test.js
    ├── track.test.js
    ├── race.test.js
    └── characters.test.js
```

- **`characters.js`**: exporta a lista `CHARACTERS` e `pickTwoRandomCharacters()`
  que retorna 2 personagens distintos sorteados sem repetição.
- **`dice.js`**: exporta `rollDice()`.
- **`track.js`**: exporta `getRandomBlock()`.
- **`race.js`**: exporta a classe `Character` (nome, atributos, pontos —
  com método `addPoints(n)` que nunca deixa o total negativo) e a classe
  `Race` (recebe 2 `Character`, executa `run()` que simula as 5 rodadas
  usando `dice.js` e `track.js`, retorna um resumo com pontuação final e
  vencedor). `Race` recebe as dependências (`rollDice`, `getRandomBlock`)
  por injeção simples (parâmetros com default) para permitir mock nos testes.
- **`index.js`**: sorteia os 2 personagens, instancia `Race`, chama `run()`
  e imprime o log de cada rodada e o resultado final no console.

## Testes (Jest)

- `dice.test.js`: `rollDice()` sempre retorna inteiro entre 1 e 6.
- `track.test.js`: `getRandomBlock()` sempre retorna um dos 3 valores válidos.
- `characters.test.js`: `pickTwoRandomCharacters()` sempre retorna 2
  personagens diferentes, ambos pertencentes à lista `CHARACTERS`.
- `race.test.js`: mockando `rollDice`/`getRandomBlock` para forçar cenários
  determinísticos — RETA/CURVA atribuem ponto correto ao vencedor, CONFRONTO
  aplica penalidade (casco/bomba) e turbo corretamente, pontuação nunca fica
  negativa, e o resultado final aponta o vencedor certo (ou empate).

## Fora de escopo

- Interface gráfica ou web.
- Seleção manual/interativa de personagens (ficou definido como sorteio
  automático).
- Persistência de resultados entre execuções.

## Entrega

1. Branch `feat/simulador-corridas-mario-kart` a partir de `main`.
2. Implementação completa + testes passando (`npm test`).
3. Commit(s) na branch.
4. Push e abertura de PR para `main` no repositório
   `filipeds/DIO-FormacaoNodeJsFundamentals`.
