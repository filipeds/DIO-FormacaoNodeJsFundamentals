import { createApp } from "./app";

const port = Number(process.env.PORT) || 3333;

createApp().listen(port, () => {
  console.log(`servidor iniciado na porta ${port}`);
});
