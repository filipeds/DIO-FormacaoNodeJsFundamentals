import { Episode } from "../models/episode";
import { EpisodeRepository } from "../repositories/episode-repository";

export interface PodcastService {
  listAll(): Episode[];
  groupByCategory(): Record<string, Episode[]>;
  findByPodcast(name: string): Episode[];
}

export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function createPodcastService(repository: EpisodeRepository): PodcastService {
  return {
    listAll: () => repository.findAll(),

    groupByCategory() {
      const grouped: Record<string, Episode[]> = {};
      for (const episode of repository.findAll()) {
        for (const category of episode.categories) {
          (grouped[category] ??= []).push(episode);
        }
      }
      return grouped;
    },

    findByPodcast(name) {
      const term = normalize(name);
      return repository
        .findAll()
        .filter((episode) => normalize(episode.podcastName).includes(term));
    },
  };
}
