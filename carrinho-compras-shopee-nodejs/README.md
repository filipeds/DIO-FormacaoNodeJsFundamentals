# 🛒 Carrinho de Compras Shopee

Desafio de projeto da trilha **Formação Node.js Fundamentals** da [DIO](https://www.dio.me/).

## Sobre o desafio

Simular, via terminal, um carrinho de compras inspirado na Shopee: o usuário
navega por um menu para listar produtos, adicionar, remover e alterar
quantidades no carrinho, com cálculo automático de totais e controle de
estoque. Toda a lógica de gerenciamento roda no backend (Node.js puro), sem
interface gráfica.

- **6 produtos** fixos no catálogo, cada um com preço e estoque.
- Estoque é **reservado** ao adicionar um item ao carrinho e **devolvido**
  ao remover ou reduzir a quantidade — nunca é possível reservar mais do
  que o estoque disponível.
- Código orientado a objetos (`Cart`), com módulos separados por
  responsabilidade (`catalog`, `cart`, `cli`, `index`).
- Toda ação inválida (produto inexistente, quantidade inválida, estoque
  insuficiente) mostra uma mensagem de erro e mantém o programa rodando.
- Suíte de testes automatizados com Jest cobrindo toda a lógica do carrinho.

## Regras

- O total do carrinho é sempre a soma de `preço × quantidade` de cada item,
  sem cupons, descontos ou taxas.
- A quantidade de um item no carrinho é sempre um número inteiro maior que
  zero; reduzir a quantidade a 0 remove o item do carrinho.
- O carrinho existe apenas em memória durante a execução — não há
  persistência entre execuções do programa.

## Como rodar

```bash
cd carrinho-compras-shopee-nodejs
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
├── catalog.js   # catálogo fixo de produtos (id, nome, preço, estoque)
├── cart.js      # classe Cart (motor do carrinho: adicionar, remover, totais)
├── cli.js       # menu interativo de terminal (readline), chama Cart
└── index.js     # ponto de entrada (CLI)
test/            # testes Jest para catalog e cart
```
