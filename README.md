# 🏆 API Champions League

> API REST da Champions League com clubes, jogadores, partidas e classificação calculada, feita com Node.js, TypeScript e Express.

Desafio de projeto da trilha **Formação Node.js Fundamentals** da [DIO](https://www.dio.me/).

## Sobre esta branch

Esta branch (`feat/api-champions-league-express`) contém **apenas** este desafio, na pasta [`api-champions-league-express/`](api-champions-league-express). Ele foi integrado à `main` pelo [PR #9](https://github.com/filipeds/DIO-FormacaoNodeJsFundamentals/pull/9).

## Destaques

- Arquitetura em camadas: routes, controllers, services, repositories e models
- CRUD de clubes e jogadores, partidas com filtros e `GET /standings`
- Validação, erros 400, 404 e 409 e testes automatizados

## Tecnologias

- Node.js 20+
- Express e cors
- TypeScript
- Jest + Supertest

## Como rodar

```bash
cd api-champions-league-express
npm install
cp .env.example .env
npm run start:dev
```

Testes:

```bash
npm test
```

Mais detalhes, regras e rotas no [README do projeto](api-champions-league-express/README.md).

## Referência

[digitalinnovationone/nodejs-express-api](https://github.com/digitalinnovationone/nodejs-express-api)

## Todos os desafios

A lista completa dos desafios da trilha está no [README da `main`](https://github.com/filipeds/DIO-FormacaoNodeJsFundamentals/tree/main#readme).
