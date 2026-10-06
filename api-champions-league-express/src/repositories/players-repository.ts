import { PlayerModel } from "../models/player-model";
import data from "./players.json";

const players: PlayerModel[] = [...data];
let nextId = Math.max(...players.map((p) => p.id)) + 1;

export const findAllPlayers = (): PlayerModel[] => players;

export const findPlayerById = (id: number): PlayerModel | undefined =>
  players.find((p) => p.id === id);

export const insertPlayer = (player: Omit<PlayerModel, "id">): PlayerModel => {
  const created = { id: nextId++, ...player };
  players.push(created);
  return created;
};

export const updatePlayer = (id: number, player: Omit<PlayerModel, "id">): PlayerModel | undefined => {
  const index = players.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  players[index] = { id, ...player };
  return players[index];
};

export const deletePlayer = (id: number): boolean => {
  const index = players.findIndex((p) => p.id === id);
  if (index === -1) return false;
  players.splice(index, 1);
  return true;
};
