import { IncomingMessage, ServerResponse } from "node:http";
import { sendError } from "./responses";

export type Handler = (req: IncomingMessage, res: ServerResponse, url: URL) => void;

export interface Route {
  method: string;
  path: string;
  handler: Handler;
}

const stripTrailingSlash = (path: string) =>
  path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

export function createRouter(routes: Route[]): Handler {
  return (req, res, url) => {
    const path = stripTrailingSlash(url.pathname);
    const samePath = routes.filter((route) => route.path === path);

    if (samePath.length === 0) {
      return sendError(res, 404, "Rota não encontrada");
    }

    const route = samePath.find((candidate) => candidate.method === req.method);
    if (!route) {
      return sendError(res, 405, "Método não permitido", {
        Allow: samePath.map((candidate) => candidate.method).join(", "),
      });
    }

    route.handler(req, res, url);
  };
}
