# 📱 Gerador de QR Codes para E-commerce

Desafio de projeto da trilha **Formação Node.js Fundamentals** da [DIO](https://www.dio.me/).

## Sobre o desafio

Gerar, via terminal, QR Codes de links de produtos para acesso direto a
páginas de vendas online — sem interface gráfica. Como funcionalidade
extra, o projeto também inclui um gerador de senhas seguras configurável.

- **6 produtos** fixos no catálogo, cada um com um link de página de
  vendas.
- QR Code gerado como **PNG em arquivo** (`output/`) ou **ASCII direto no
  terminal**, à escolha do usuário.
- Gerador de senhas configurável via `.env` (tipos de caractere e
  comprimento).
- Código orientado a módulos por responsabilidade (`catalog`, `qrCode`,
  `password`, `cli`, `index`), com as bibliotecas de geração de QR Code
  injetadas como dependência — mesmo padrão de testabilidade usado nos
  outros projetos deste repositório.
- Toda ação inválida (produto inexistente, formato inválido, config de
  senha inválida) mostra uma mensagem de erro e mantém o programa
  rodando.
- Suíte de testes automatizados com Jest.

## Regras

- O QR Code só pode ser gerado para um produto do catálogo fixo (sem
  entrada de link personalizado).
- A senha gerada usa apenas os tipos de caractere habilitados no `.env` e
  tem exatamente o comprimento configurado.

## Como rodar

```bash
cd gerador-qrcode-ecommerce-nodejs
npm install
cp .env.example .env
npm start
```

## Como testar

```bash
npm test
```

## Estrutura

```
src/
├── catalog.js   # catálogo fixo de produtos (id, nome, link)
├── qrCode.js    # geração de QR Code em PNG e em ASCII no terminal
├── password.js  # config via .env + geração de senha segura
├── cli.js       # menu interativo de terminal (readline)
└── index.js     # ponto de entrada (CLI)
test/            # testes Jest para catalog, qrCode e password
```
