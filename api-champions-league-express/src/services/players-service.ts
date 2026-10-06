import {
  findAllPlayers, findPlayerById, insertPlayer, updatePlayer, deletePlayer,
} from "../repositories/players-repository";
import { findClubById, findAllClubs } from "../repositories/clubs-repository";
import { PlayerModel } from "../models/player-model";
import { HttpError } from "../utils/http-error";
import { StatusCode } from "../utils/status-code";
import { parseId, requireInt, requireString } from "../utils/validators";

const withClub = (player: PlayerModel) => ({
  ...player,
  club: findClubById(player.clubId)?.name ?? null,
});

const parseBody = (body: unknown) => {
  const parsed = {
    name: requireString(body, "name"),
    position: requireString(body, "position"),
    clubId: requireInt(body, "clubId"),
  };
  if (!findClubById(parsed.clubId)) {
    throw new HttpError(StatusCode.BAD_REQUEST, "clubId não corresponde a nenhum clube");
  }
  return parsed;
};

export const listPlayers = (club?: unknown) => {
  let players = findAllPlayers();
  if (typeof club === "string" && club.trim() !== "") {
    const wanted = club.trim().toLowerCase();
    const ids = findAllClubs()
      .filter((c) => c.name.toLowerCase() === wanted)
      .map((c) => c.id);
    players = players.filter((p) => ids.includes(p.clubId));
  }
  return players.map(withClub);
};

export const getPlayer = (rawId: unknown) => {
  const player = findPlayerById(parseId(rawId));
  if (!player) throw new HttpError(StatusCode.NOT_FOUND, "Jogador não encontrado");
  return withClub(player);
};

export const createPlayer = (body: unknown) => withClub(insertPlayer(parseBody(body)));

export const replacePlayer = (rawId: unknown, body: unknown) => {
  const id = parseId(rawId);
  if (!findPlayerById(id)) throw new HttpError(StatusCode.NOT_FOUND, "Jogador não encontrado");
  return withClub(updatePlayer(id, parseBody(body))!);
};

export const removePlayer = (rawId: unknown) => {
  if (!deletePlayer(parseId(rawId))) {
    throw new HttpError(StatusCode.NOT_FOUND, "Jogador não encontrado");
  }
};
