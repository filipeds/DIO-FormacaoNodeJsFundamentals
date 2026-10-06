<div align="center">

  <img src="./.github/assets/banner.svg" alt="API Champions League" height="200">
  <h1><strong>API Champions League — Node.js + Express</strong></h1>
  <p>API REST com times, jogadores, partidas e classificação da Champions League, feita com <b>Node.js</b>, <b>TypeScript</b> e <b>Express</b>.</p>

</div>

## Sobre o desafio

Desafio de projeto da [DIO](https://www.dio.me/) (Formação Node.js Fundamentals). O projeto é baseado em [digitalinnovationone/nodejs-express-api](https://github.com/digitalinnovationone/nodejs-express-api) e mantém a **mesma arquitetura em camadas** do repositório de referência:

```
src/
  server.ts        # sobe o servidor na porta do .env
  app.ts           # Express, CORS, JSON, rotas, 404 e tratamento de erros
  routes/          # mapeia método + rota para o controller
  controllers/     # lê req/res e devolve o status HTTP
  services/        # regras de negócio
  repositories/    # dados em JSON (em memória)
  models/          # interfaces TypeScript
  utils/           # status-code, http-error, validators
```

### O que foi evoluído em relação ao original

- Servidor com **Express** no lugar do módulo `http` puro, com roteamento e `express.json()`.
- CRUD completo de **clubes** e **jogadores** (`GET`, `GET /:id`, `POST`, `PUT`, `DELETE`).
- **Partidas** com filtros por rodada e clube, e **classificação calculada** a partir dos resultados.
- Ids gerados pelo servidor, validação de entrada (400), 404, 409 e tratamento central de erros.
- **Testes automatizados** com Jest + Supertest.

## Passo a passo

1. Analisei a arquitetura do repositório base (rotas → controllers → services → repositories → models).
2. Configurei TypeScript (`strict`, CommonJS), Express, CORS, `tsx` e `tsup`.
3. Modelei `Club`, `Player`, `Match` e `Standing`, com dados em JSON.
4. Implementei repositories, services e controllers de cada recurso e as rotas.
5. Criei a classificação (3 pontos por vitória, 1 por empate; desempate por saldo, gols pró e nome).
6. Escrevi os testes e validei manualmente a API compilada.

## Tecnologias

- [Node.js](https://nodejs.org/) 20+
- [Express](https://expressjs.com/) e [cors](https://github.com/expressjs/cors)
- [TypeScript](https://www.typescriptlang.org/)
- [tsx](https://www.npmjs.com/package/tsx) e [tsup](https://www.npmjs.com/package/tsup)
- [Jest](https://jestjs.io/) e [Supertest](https://github.com/ladjs/supertest)

## Como rodar

```bash
npm install
cp .env.example .env
npm run start:dev
```

A API sobe em `http://localhost:3333` (ou na porta definida em `PORT`).

### Scripts

| Script | Descrição |
|---|---|
| `npm run start:dev` | Roda o servidor lendo o `.env` |
| `npm run start:watch` | Igual ao anterior, com reload automático |
| `npm run dist` | Compila o TypeScript para `dist/` |
| `npm run start:dist` | Compila e roda a versão de `dist/` |
| `npm test` | Executa os testes |

## Rotas

| Método | Rota | Descrição | Sucesso | Erros |
|---|---|---|---|---|
| GET | `/` | Health-check | 200 | — |
| GET | `/clubs` | Lista clubes | 200 | — |
| GET | `/clubs/:id` | Busca um clube | 200 | 400, 404 |
| POST | `/clubs` | Cria clube (`name`, `country`) | 201 | 400 |
| PUT | `/clubs/:id` | Substitui clube | 200 | 400, 404 |
| DELETE | `/clubs/:id` | Remove clube | 204 | 400, 404, 409 (tem jogadores/partidas) |
| GET | `/players` | Lista jogadores (`?club=Arsenal` filtra) | 200 | — |
| GET | `/players/:id` | Busca um jogador | 200 | 400, 404 |
| POST | `/players` | Cria jogador (`name`, `position`, `clubId`) | 201 | 400 |
| PUT | `/players/:id` | Substitui jogador | 200 | 400, 404 |
| DELETE | `/players/:id` | Remove jogador | 204 | 400, 404 |
| GET | `/matches` | Lista partidas (`?round=1`, `?club=Arsenal`) | 200 | 400 |
| GET | `/matches/:id` | Busca uma partida | 200 | 400, 404 |
| GET | `/standings` | Classificação calculada | 200 | — |

### Exemplos

```bash
curl http://localhost:3333/standings

curl "http://localhost:3333/matches?round=1"

curl -X POST http://localhost:3333/players \
  -H "Content-Type: application/json" \
  -d '{"name": "Rodrygo", "position": "Atacante", "clubId": 1}'

curl -X DELETE http://localhost:3333/players/1
```

> Os dados ficam em memória: reiniciar o servidor volta ao estado inicial.

## Créditos

Projeto de referência: [digitalinnovationone/nodejs-express-api](https://github.com/digitalinnovationone/nodejs-express-api).
