import { createApp } from "./app";

try {
  process.loadEnvFile();
} catch {
  // .env é opcional; usa PORT do ambiente ou o padrão
}

const port = Number(process.env.PORT) || 3333;

createApp().listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
