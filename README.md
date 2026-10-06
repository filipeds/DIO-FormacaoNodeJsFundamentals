# 🏎️ API Fórmula 1

> API REST com CRUD de times e pilotos de Fórmula 1, feita com Node.js, TypeScript e Fastify.

Desafio de projeto da trilha **Formação Node.js Fundamentals** da [DIO](https://www.dio.me/).

## Sobre esta branch

Esta branch (`feat/api-formula-1-fastify`) contém **apenas** este desafio, na pasta [`api-formula-1-fastify/`](api-formula-1-fastify). Ele foi integrado à `main` pelo [PR #5](https://github.com/filipeds/DIO-FormacaoNodeJsFundamentals/pull/5).

## Destaques

- CRUD completo de times e pilotos com ids únicos
- Validação por JSON schema do Fastify (erros 400)
- Filtro `GET /drivers?team=Ferrari` e health-check em `GET /`

## Tecnologias

- Node.js 20+
- Fastify e @fastify/cors
- TypeScript
- tsx e tsup

## Como rodar

```bash
cd api-formula-1-fastify
npm install
cp .env.example .env
npm run start:dev
```

Mais detalhes, regras e rotas no [README do projeto](api-formula-1-fastify/README.md).

## Referência

[digitalinnovationone/node-formula-1](https://github.com/digitalinnovationone/node-formula-1)

## Todos os desafios

A lista completa dos desafios da trilha está no [README da `main`](https://github.com/filipeds/DIO-FormacaoNodeJsFundamentals/tree/main#readme).
