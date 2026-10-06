import { createServer, Server } from "node:http";
import { createPodcastController } from "./controllers/podcast-controller";
import { sendError } from "./http/responses";
import { createRouter } from "./http/router";
import { createEpisodeRepository } from "./repositories/episode-repository";
import { createPodcastService, PodcastService } from "./services/podcast-service";

export function createApp(
  service: PodcastService = createPodcastService(createEpisodeRepository()),
): Server {
  const controller = createPodcastController(service);
  const router = createRouter([
    { method: "GET", path: "/episodes", handler: controller.listEpisodes },
    { method: "GET", path: "/episodes/by-category", handler: controller.listByCategory },
  ]);

  return createServer((req, res) => {
    try {
      const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
      router(req, res, url);
    } catch (error) {
      console.error(error);
      if (!res.headersSent) sendError(res, 500, "Erro interno");
    }
  });
}
