# 📱 Gerador de QR Codes para E-commerce

> Gerador de QR Codes de links de produtos pelo terminal, em PNG ou ASCII, com um gerador de senhas seguras configurável como extra.

Desafio de projeto da trilha **Formação Node.js Fundamentals** da [DIO](https://www.dio.me/).

## Sobre esta branch

Esta branch (`feat/gerador-qrcode-ecommerce-nodejs`) contém **apenas** este desafio, na pasta [`gerador-qrcode-ecommerce-nodejs/`](gerador-qrcode-ecommerce-nodejs). Ele foi integrado à `main` pelo [PR #8](https://github.com/filipeds/DIO-FormacaoNodeJsFundamentals/pull/8).

## Destaques

- QR Code salvo como PNG em `output/` ou exibido em ASCII
- Gerador de senhas configurável via `.env`
- Bibliotecas injetadas como dependência, facilitando os testes

## Tecnologias

- Node.js
- JavaScript (CommonJS)
- Jest
- configuração via `.env`

## Como rodar

```bash
cd gerador-qrcode-ecommerce-nodejs
npm install
cp .env.example .env
npm start
```

Testes:

```bash
npm test
```

Mais detalhes, regras e rotas no [README do projeto](gerador-qrcode-ecommerce-nodejs/README.md).

## Todos os desafios

A lista completa dos desafios da trilha está no [README da `main`](https://github.com/filipeds/DIO-FormacaoNodeJsFundamentals/tree/main#readme).
