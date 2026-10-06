import episodesData from "../data/episodes.json";
import { Episode, RawEpisode } from "../models/episode";

export interface EpisodeRepository {
  findAll(): Episode[];
}

export function createEpisodeRepository(
  raw: RawEpisode[] = episodesData as RawEpisode[],
): EpisodeRepository {
  const episodes: Episode[] = raw.map((item) => ({
    ...item,
    link: `https://www.youtube.com/watch?v=${item.videoId}`,
    cover: `https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg`,
  }));

  return { findAll: () => [...episodes] };
}
