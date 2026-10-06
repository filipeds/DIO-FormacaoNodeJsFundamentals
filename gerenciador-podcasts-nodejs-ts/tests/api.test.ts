import { AddressInfo } from "node:net";
import { Server } from "node:http";
import { createApp } from "../src/app";
import { PodcastService } from "../src/services/podcast-service";

let server: Server;
let base: string;

async function start(app: Server) {
  await new Promise<void>((resolve) => app.listen(0, resolve));
  server = app;
  base = `http://127.0.0.1:${(app.address() as AddressInfo).port}`;
}

afterEach(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe("API de podcasts", () => {
  beforeEach(async () => start(createApp()));

  it("GET /episodes devolve todos os episódios em JSON", async () => {
    const res = await fetch(`${base}/episodes`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  it("GET /episodes?podcast= filtra ignorando caixa e acento", async () => {
    const res = await fetch(`${base}/episodes?podcast=CODIGO`);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.length).toBeGreaterThan(0);
    expect(body.every((e: { podcastName: string }) => e.podcastName === "Código Aberto")).toBe(true);
  });

  it("GET /episodes?podcast= inexistente devolve 200 e lista vazia", async () => {
    const res = await fetch(`${base}/episodes?podcast=nada`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("GET /episodes/by-category agrupa por categoria", async () => {
    const res = await fetch(`${base}/episodes/by-category`);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(Object.keys(body)).toEqual(expect.arrayContaining(["tecnologia", "mindset", "saude"]));
  });

  it("aceita barra final na rota", async () => {
    const res = await fetch(`${base}/episodes/`);
    expect(res.status).toBe(200);
  });

  it("rota desconhecida devolve 404 em JSON", async () => {
    const res = await fetch(`${base}/nada`);
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Rota não encontrada" });
  });

  it("método não-GET devolve 405 com Allow", async () => {
    const res = await fetch(`${base}/episodes`, { method: "POST" });
    expect(res.status).toBe(405);
    expect(res.headers.get("allow")).toBe("GET");
    expect(await res.json()).toEqual({ error: "Método não permitido" });
  });
});

describe("falha inesperada", () => {
  it("devolve 500 sem vazar detalhes", async () => {
    const broken: PodcastService = {
      listAll: () => {
        throw new Error("segredo interno");
      },
      groupByCategory: () => ({}),
      findByPodcast: () => [],
    };
    jest.spyOn(console, "error").mockImplementation(() => {});
    await start(createApp(broken));
    const res = await fetch(`${base}/episodes`);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Erro interno" });
  });
});
