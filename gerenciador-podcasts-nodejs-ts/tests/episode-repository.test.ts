import { createEpisodeRepository } from "../src/repositories/episode-repository";
import { RawEpisode } from "../src/models/episode";

const raw: RawEpisode[] = [
  { podcastName: "Demo", title: "Ep 1", videoId: "abc123", categories: ["x"] },
];

describe("episode repository", () => {
  it("deriva link e cover a partir do videoId", () => {
    const [episode] = createEpisodeRepository(raw).findAll();
    expect(episode).toEqual({
      podcastName: "Demo",
      title: "Ep 1",
      videoId: "abc123",
      categories: ["x"],
      link: "https://www.youtube.com/watch?v=abc123",
      cover: "https://img.youtube.com/vi/abc123/maxresdefault.jpg",
    });
  });

  it("carrega o catálogo padrão com todos os campos preenchidos", () => {
    const episodes = createEpisodeRepository().findAll();
    expect(episodes.length).toBeGreaterThan(0);
    for (const e of episodes) {
      expect(e.podcastName && e.title && e.videoId && e.link && e.cover).toBeTruthy();
      expect(e.categories.length).toBeGreaterThan(0);
    }
  });
});
