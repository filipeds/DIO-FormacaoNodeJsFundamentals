# 🎙️ Gerenciador de Podcasts

> API REST de episódios de podcasts por categoria, feita com Node.js e TypeScript sem frameworks, usando apenas `node:http`.

Desafio de projeto da trilha **Formação Node.js Fundamentals** da [DIO](https://www.dio.me/).

## Sobre esta branch

Esta branch (`feat/gerenciador-podcasts-nodejs-ts`) contém **apenas** este desafio, na pasta [`gerenciador-podcasts-nodejs-ts/`](gerenciador-podcasts-nodejs-ts). Ele foi integrado à `main` pelo [PR #4](https://github.com/filipeds/DIO-FormacaoNodeJsFundamentals/pull/4).

## Destaques

- `GET /episodes` com filtro `?podcast=` e `GET /episodes/by-category`
- Respostas 404, 405 e 500 padronizadas
- Reescrita com arquitetura e contrato próprios

## Tecnologias

- Node.js 22
- TypeScript
- tsx e tsup
- Jest + ts-jest

## Como rodar

```bash
cd gerenciador-podcasts-nodejs-ts
npm install
cp .env.example .env
npm run start:dev
```

Testes:

```bash
npm test
```

Mais detalhes, regras e rotas no [README do projeto](gerenciador-podcasts-nodejs-ts/README.md).

## Referência

[felipeAguiarCode/node-ts-webapi-without-frameworks-podcast-menager](https://github.com/felipeAguiarCode/node-ts-webapi-without-frameworks-podcast-menager)

## Todos os desafios

A lista completa dos desafios da trilha está no [README da `main`](https://github.com/filipeds/DIO-FormacaoNodeJsFundamentals/tree/main#readme).
