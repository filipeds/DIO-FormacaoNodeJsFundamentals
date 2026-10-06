import request from "supertest";
import { createApp } from "../src/app";

const app = createApp();

describe("health e 404", () => {
  it("GET / responde ok", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
  it("rota inexistente retorna 404", async () => {
    expect((await request(app).get("/nada")).status).toBe(404);
  });
});

describe("standings", () => {
  it("calcula a tabela ordenada por pontos", async () => {
    const res = await request(app).get("/standings");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(8);
    const points = res.body.map((r: any) => r.points);
    expect(points).toEqual([...points].sort((a: number, b: number) => b - a));
    const gf = res.body.reduce((s: number, r: any) => s + r.goalsFor, 0);
    const ga = res.body.reduce((s: number, r: any) => s + r.goalsAgainst, 0);
    expect(gf).toBe(ga);
    expect(res.body[0]).toMatchObject({ position: 1, club: "Real Madrid", points: 7 });
  });
});

describe("matches", () => {
  it("filtra por rodada", async () => {
    expect((await request(app).get("/matches?round=2")).body).toHaveLength(4);
  });
  it("filtra por clube", async () => {
    expect((await request(app).get("/matches?club=Arsenal")).body).toHaveLength(3);
  });
  it("round inválido retorna 400", async () => {
    expect((await request(app).get("/matches?round=abc")).status).toBe(400);
  });
  it("busca por id e 404", async () => {
    expect((await request(app).get("/matches/1")).body.homeClub).toBe("Real Madrid");
    expect((await request(app).get("/matches/999")).status).toBe(404);
  });
});

describe("clubs CRUD", () => {
  it("cria, atualiza e remove", async () => {
    const created = await request(app).post("/clubs").send({ name: "Benfica", country: "Portugal" });
    expect(created.status).toBe(201);
    const id = created.body.id;
    const put = await request(app).put(`/clubs/${id}`).send({ name: "SL Benfica", country: "Portugal" });
    expect(put.body.name).toBe("SL Benfica");
    expect((await request(app).delete(`/clubs/${id}`)).status).toBe(204);
    expect((await request(app).get(`/clubs/${id}`)).status).toBe(404);
  });
  it("valida body e id", async () => {
    expect((await request(app).post("/clubs").send({ name: "" })).status).toBe(400);
    expect((await request(app).get("/clubs/abc")).status).toBe(400);
  });
  it("JSON malformado retorna 400", async () => {
    const res = await request(app).post("/clubs").set("Content-Type", "application/json").send("{x");
    expect(res.status).toBe(400);
  });
  it("não remove clube com jogadores (409)", async () => {
    expect((await request(app).delete("/clubs/1")).status).toBe(409);
  });
});

describe("players CRUD", () => {
  it("lista e filtra por clube", async () => {
    const res = await request(app).get("/players?club=Real%20Madrid");
    expect(res.body).toHaveLength(2);
    expect(res.body[0].club).toBe("Real Madrid");
  });
  it("cria, atualiza e remove", async () => {
    const created = await request(app).post("/players").send({ name: "Rodrygo", position: "Atacante", clubId: 1 });
    expect(created.status).toBe(201);
    expect(created.body.club).toBe("Real Madrid");
    const id = created.body.id;
    const put = await request(app).put(`/players/${id}`).send({ name: "Rodrygo Goes", position: "Atacante", clubId: 1 });
    expect(put.body.name).toBe("Rodrygo Goes");
    expect((await request(app).delete(`/players/${id}`)).status).toBe(204);
    expect((await request(app).delete(`/players/${id}`)).status).toBe(404);
  });
  it("clubId inexistente retorna 400", async () => {
    const res = await request(app).post("/players").send({ name: "X", position: "Y", clubId: 999 });
    expect(res.status).toBe(400);
  });
});
