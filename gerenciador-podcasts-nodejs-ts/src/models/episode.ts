export interface Episode {
  podcastName: string;
  title: string;
  videoId: string;
  cover: string;
  link: string;
  categories: string[];
}

export type RawEpisode = Omit<Episode, "link" | "cover">;
