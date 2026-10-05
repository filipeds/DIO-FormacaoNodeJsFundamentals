import { createPodcastService, normalize } from "../src/services/podcast-service";
import { Episode } from "../src/models/episode";

const make = (podcastName: string, categories: string[]): Episode => ({
  podcastName,
  title: `${podcastName} ep`,
  videoId: "id",
  cover: "c",
  link: "l",
  categories,
});

const episodes = [
  make("Código Aberto", ["tecnologia", "carreira"]),
  make("Mente em Foco", ["mindset"]),
  make("Riso Solto", ["tecnologia"]),
];
const service = createPodcastService({ findAll: () => episodes });

describe("normalize", () => {
  it("remove acentos, caixa e espaços nas pontas", () => {
    expect(normalize("  CÓdigo ABERTO ")).toBe("codigo aberto");
  });
});

describe("podcast service", () => {
  it("listAll devolve todos os episódios", () => {
    expect(service.listAll()).toHaveLength(3);
  });

  it("groupByCategory coloca o episódio em cada uma de suas categorias", () => {
    const grouped = service.groupByCategory();
    expect(Object.keys(grouped).sort()).toEqual(["carreira", "mindset", "tecnologia"]);
    expect(grouped.tecnologia.map((e) => e.podcastName)).toEqual(["Código Aberto", "Riso Solto"]);
    expect(grouped.carreira).toHaveLength(1);
  });

  it("findByPodcast ignora acento e caixa e aceita trecho do nome", () => {
    expect(service.findByPodcast("codigo")).toHaveLength(1);
    expect(service.findByPodcast("MENTE EM")).toHaveLength(1);
  });

  it("findByPodcast devolve lista vazia quando não encontra", () => {
    expect(service.findByPodcast("inexistente")).toEqual([]);
  });
});
