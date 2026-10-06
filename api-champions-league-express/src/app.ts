import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes/routes";
import { HttpError } from "./utils/http-error";
import { StatusCode } from "./utils/status-code";

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.status(StatusCode.OK).json({ api: "Champions League", status: "ok" });
  });

  app.use(router);

  app.use((_req, res) => {
    res.status(StatusCode.NOT_FOUND).json({ error: "Rota não encontrada" });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ error: err.message });
    }
    if (err?.type === "entity.parse.failed") {
      return res.status(StatusCode.BAD_REQUEST).json({ error: "JSON inválido" });
    }
    console.error(err);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Erro interno" });
  });

  return app;
};
