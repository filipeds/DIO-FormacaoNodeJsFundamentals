# Gerenciador de Podcasts (API Node + TypeScript)

API REST de episódios de podcasts organizados por categoria, feita com **Node.js + TypeScript**, **sem frameworks** (somente `node:http`). Projeto do desafio da trilha **Formação Node.js Fundamentals** da [DIO](https://www.dio.me/).

Foi inspirado no repositório base [`felipeAguiarCode/node-ts-webapi-without-frameworks-podcast-menager`](https://github.com/felipeAguiarCode/node-ts-webapi-without-frameworks-podcast-menager), mas é uma **reescrita** com arquitetura e contrato próprios (não é uma cópia).

## Tecnologias

- Node.js 22 (`node:http`, `process.loadEnvFile`)
- TypeScript 5 (fixado em `^5` por compatibilidade com o `ts-jest`)
- tsx (desenvolvimento com reload), tsup (build de produção)
- Jest + ts-jest (testes)

## Como rodar

```bash
npm install
cp .env.example .env      # define a PORT (padrão 3333)
npm run start:dev         # desenvolvimento, com reload
```

Build e produção:

```bash
npm run build && npm start
```

Testes:

```bash
npm test
```

## Endpoints

| Método | Rota | Resposta |
|---|---|---|
| GET | `/episodes` | `200` lista de episódios |
| GET | `/episodes?podcast=<nome>` | `200` episódios filtrados (sem distinção de caixa/acento, por "contém"); lista vazia se não houver |
| GET | `/episodes/by-category` | `200` objeto `{ categoria: Episode[] }` |
| qualquer outra rota | — | `404 {"error":"Rota não encontrada"}` |
| método diferente de GET em rota existente | — | `405 {"error":"Método não permitido"}` + header `Allow: GET` |
| erro inesperado | — | `500 {"error":"Erro interno"}` |

Formato de `Episode`: `{ podcastName, title, videoId, cover, link, categories: string[] }`.

### Exemplos

```bash
curl -s localhost:3333/episodes
```
```json
[{"podcastName":"Código Aberto","title":"Por que TypeScript venceu o JavaScript puro?","videoId":"cAb3rT0001x","categories":["tecnologia","carreira"],"link":"https://www.youtube.com/watch?v=cAb3rT0001x","cover":"https://img.youtube.com/vi/cAb3rT0001x/maxresdefault.jpg"}, ...]
```

```bash
curl -s "localhost:3333/episodes?podcast=mente"
```
```json
[{"podcastName":"Mente em Foco","title":"Foco profundo em um mundo de notificações","videoId":"mEnT3F0003z","categories":["mindset","saude"],"link":"https://www.youtube.com/watch?v=mEnT3F0003z","cover":"https://img.youtube.com/vi/mEnT3F0003z/maxresdefault.jpg"}, ...]
```

```bash
curl -s localhost:3333/episodes/by-category
```
```json
{"tecnologia":[{"podcastName":"Código Aberto","title":"Por que TypeScript venceu o JavaScript puro?", ...}, ...],"mindset":[...], ...}
```

## Arquitetura

```
src/
├── models/        # tipos (Episode, RawEpisode)
├── data/          # catálogo de episódios (episodes.json)
├── repositories/  # acesso aos dados; monta link e cover a partir do videoId
├── services/      # regras de negócio: listar, agrupar por categoria, filtrar por podcast
├── http/          # router simples (404/405) e helpers de resposta JSON
├── controllers/   # traduz requisições HTTP em chamadas ao service
├── app.ts         # monta rotas e o servidor (createApp)
└── server.ts      # ponto de entrada: lê a PORT e sobe o servidor
tests/             # testes de repository, service e API (Jest)
```

## Passo a passo de como foi feito

1. **Scaffold:** projeto npm com TypeScript, tsx, tsup e Jest; `tsconfig`, `.gitignore` e `.env.example`.
2. **Repository:** modelo `Episode`, catálogo em JSON e `createEpisodeRepository`, que gera `link` e `cover` a partir do `videoId`.
3. **Service:** `createPodcastService` com listagem, agrupamento por categoria e filtro por nome normalizado (sem acento/caixa).
4. **HTTP:** helpers de resposta, router próprio com 404/405 e `Allow`, controller e `createApp` com tratamento de erro 500.
5. **Testes:** testes unitários do repository e do service, e testes de integração da API subindo o servidor.
6. **Build:** `tsup` gera `dist/server.js` (CJS), executado com `npm start`.

## Observação

Os podcasts e os `videoId` do catálogo são **fictícios**, apenas para demonstração.
