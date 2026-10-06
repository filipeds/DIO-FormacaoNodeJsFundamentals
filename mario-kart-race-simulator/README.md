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
