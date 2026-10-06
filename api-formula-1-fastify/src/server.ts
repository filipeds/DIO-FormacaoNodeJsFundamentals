import fastify from "fastify";
import cors from "@fastify/cors";

const server = fastify({ logger: true });

server.register(cors, {
  origin: "*",
});

interface Team {
  id: number;
  name: string;
  base: string;
}

interface Driver {
  id: number;
  name: string;
  teamId: number;
}

const teams: Team[] = [
  { id: 1, name: "McLaren", base: "Woking, United Kingdom" },
  { id: 2, name: "Mercedes", base: "Brackley, United Kingdom" },
  { id: 3, name: "Red Bull Racing", base: "Milton Keynes, United Kingdom" },
  { id: 4, name: "Ferrari", base: "Maranello, Italy" },
  { id: 5, name: "Alpine", base: "Enstone, United Kingdom" },
  { id: 6, name: "Aston Martin", base: "Silverstone, United Kingdom" },
  { id: 7, name: "Williams", base: "Grove, United Kingdom" },
  { id: 8, name: "Haas", base: "Kannapolis, United States" },
  { id: 9, name: "Racing Bulls", base: "Faenza, Italy" },
  { id: 10, name: "Kick Sauber", base: "Hinwil, Switzerland" },
];

const drivers: Driver[] = [
  { id: 1, name: "Max Verstappen", teamId: 3 },
  { id: 2, name: "Lewis Hamilton", teamId: 4 },
  { id: 3, name: "Lando Norris", teamId: 1 },
  { id: 4, name: "Charles Leclerc", teamId: 4 },
  { id: 5, name: "George Russell", teamId: 2 },
  { id: 6, name: "Oscar Piastri", teamId: 1 },
  { id: 7, name: "Fernando Alonso", teamId: 6 },
];

let nextTeamId = Math.max(...teams.map((t) => t.id)) + 1;
let nextDriverId = Math.max(...drivers.map((d) => d.id)) + 1;

interface IdParams {
  id: string;
}

const idParamsSchema = {
  type: "object",
  required: ["id"],
  properties: { id: { type: "integer", minimum: 1 } },
};

const teamBodySchema = {
  type: "object",
  required: ["name", "base"],
  additionalProperties: false,
  properties: {
    name: { type: "string", minLength: 1 },
    base: { type: "string", minLength: 1 },
  },
};

const driverBodySchema = {
  type: "object",
  required: ["name", "teamId"],
  additionalProperties: false,
  properties: {
    name: { type: "string", minLength: 1 },
    teamId: { type: "integer", minimum: 1 },
  },
};

const withTeam = (driver: Driver) => {
  const { teamId, ...rest } = driver;
  const team = teams.find((t) => t.id === teamId);
  return { ...rest, teamId, team: team ? team.name : null };
};

server.get("/", async () => {
  return { message: "API de Fórmula 1 no ar", routes: ["/teams", "/drivers"] };
});

// ---------- Teams ----------

server.get("/teams", async (request, response) => {
  response.type("application/json").code(200);
  return { teams };
});

server.get<{ Params: IdParams }>(
  "/teams/:id",
  { schema: { params: idParamsSchema } },
  async (request, response) => {
    const id = Number(request.params.id);
    const team = teams.find((t) => t.id === id);

    if (!team) {
      response.type("application/json").code(404);
      return { message: "Team Not Found" };
    }

    response.type("application/json").code(200);
    return { team };
  }
);

server.post<{ Body: Omit<Team, "id"> }>(
  "/teams",
  { schema: { body: teamBodySchema } },
  async (request, response) => {
    const team: Team = { id: nextTeamId++, ...request.body };
    teams.push(team);

    response.type("application/json").code(201);
    return { team };
  }
);

server.put<{ Params: IdParams; Body: Omit<Team, "id"> }>(
  "/teams/:id",
  { schema: { params: idParamsSchema, body: teamBodySchema } },
  async (request, response) => {
    const id = Number(request.params.id);
    const index = teams.findIndex((t) => t.id === id);

    if (index === -1) {
      response.type("application/json").code(404);
      return { message: "Team Not Found" };
    }

    teams[index] = { id, ...request.body };

    response.type("application/json").code(200);
    return { team: teams[index] };
  }
);

server.delete<{ Params: IdParams }>(
  "/teams/:id",
  { schema: { params: idParamsSchema } },
  async (request, response) => {
    const id = Number(request.params.id);
    const index = teams.findIndex((t) => t.id === id);

    if (index === -1) {
      response.type("application/json").code(404);
      return { message: "Team Not Found" };
    }

    if (drivers.some((d) => d.teamId === id)) {
      response.type("application/json").code(409);
      return { message: "Team still has drivers" };
    }

    teams.splice(index, 1);
    response.code(204);
    return;
  }
);

// ---------- Drivers ----------

server.get<{ Querystring: { team?: string } }>(
  "/drivers",
  {
    schema: {
      querystring: { type: "object", properties: { team: { type: "string" } } },
    },
  },
  async (request, response) => {
    const { team } = request.query;
    const list = team
      ? drivers.filter((d) => {
          const driverTeam = teams.find((t) => t.id === d.teamId);
          return driverTeam?.name.toLowerCase() === team.toLowerCase();
        })
      : drivers;

    response.type("application/json").code(200);
    return { drivers: list.map(withTeam) };
  }
);

server.get<{ Params: IdParams }>(
  "/drivers/:id",
  { schema: { params: idParamsSchema } },
  async (request, response) => {
    const id = Number(request.params.id);
    const driver = drivers.find((d) => d.id === id);

    if (!driver) {
      response.type("application/json").code(404);
      return { message: "Driver Not Found" };
    }

    response.type("application/json").code(200);
    return { driver: withTeam(driver) };
  }
);

server.post<{ Body: Omit<Driver, "id"> }>(
  "/drivers",
  { schema: { body: driverBodySchema } },
  async (request, response) => {
    if (!teams.some((t) => t.id === request.body.teamId)) {
      response.type("application/json").code(400);
      return { message: "Team does not exist" };
    }

    const driver: Driver = { id: nextDriverId++, ...request.body };
    drivers.push(driver);

    response.type("application/json").code(201);
    return { driver: withTeam(driver) };
  }
);

server.put<{ Params: IdParams; Body: Omit<Driver, "id"> }>(
  "/drivers/:id",
  { schema: { params: idParamsSchema, body: driverBodySchema } },
  async (request, response) => {
    const id = Number(request.params.id);
    const index = drivers.findIndex((d) => d.id === id);

    if (index === -1) {
      response.type("application/json").code(404);
      return { message: "Driver Not Found" };
    }

    if (!teams.some((t) => t.id === request.body.teamId)) {
      response.type("application/json").code(400);
      return { message: "Team does not exist" };
    }

    drivers[index] = { id, ...request.body };

    response.type("application/json").code(200);
    return { driver: withTeam(drivers[index]) };
  }
);

server.delete<{ Params: IdParams }>(
  "/drivers/:id",
  { schema: { params: idParamsSchema } },
  async (request, response) => {
    const id = Number(request.params.id);
    const index = drivers.findIndex((d) => d.id === id);

    if (index === -1) {
      response.type("application/json").code(404);
      return { message: "Driver Not Found" };
    }

    drivers.splice(index, 1);
    response.code(204);
    return;
  }
);

const port = Number(process.env.PORT) || 3333;

server.listen({ port }, () => {
  console.log(`Server init on port ${port}`);
});
