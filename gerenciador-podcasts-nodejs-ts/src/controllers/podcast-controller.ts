import { Handler } from "../http/router";
import { sendJson } from "../http/responses";
import { PodcastService } from "../services/podcast-service";

export function createPodcastController(service: PodcastService): {
  listEpisodes: Handler;
  listByCategory: Handler;
} {
  return {
    listEpisodes(_req, res, url) {
      const podcast = url.searchParams.get("podcast");
      sendJson(res, 200, podcast === null ? service.listAll() : service.findByPodcast(podcast));
    },

    listByCategory(_req, res) {
      sendJson(res, 200, service.groupByCategory());
    },
  };
}
