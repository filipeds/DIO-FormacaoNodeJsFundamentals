import {
  findAllClubs, findClubById, insertClub, updateClub, deleteClub,
} from "../repositories/clubs-repository";
import { findAllPlayers } from "../repositories/players-repository";
import { findAllMatches } from "../repositories/matches-repository";
import { HttpError } from "../utils/http-error";
import { StatusCode } from "../utils/status-code";
import { parseId, requireString } from "../utils/validators";

const parseBody = (body: unknown) => ({
  name: requireString(body, "name"),
  country: requireString(body, "country"),
});

export const listClubs = () => findAllClubs();

export const getClub = (rawId: unknown) => {
  const club = findClubById(parseId(rawId));
  if (!club) throw new HttpError(StatusCode.NOT_FOUND, "Clube não encontrado");
  return club;
};

export const createClub = (body: unknown) => insertClub(parseBody(body));

export const replaceClub = (rawId: unknown, body: unknown) => {
  const id = parseId(rawId);
  const updated = updateClub(id, parseBody(body));
  if (!updated) throw new HttpError(StatusCode.NOT_FOUND, "Clube não encontrado");
  return updated;
};

export const removeClub = (rawId: unknown) => {
  const id = parseId(rawId);
  const hasPlayers = findAllPlayers().some((p) => p.clubId === id);
  const hasMatches = findAllMatches().some((m) => m.homeClubId === id || m.awayClubId === id);
  if (hasPlayers || hasMatches) {
    throw new HttpError(StatusCode.CONFLICT, "Clube possui jogadores ou partidas vinculados");
  }
  if (!deleteClub(id)) throw new HttpError(StatusCode.NOT_FOUND, "Clube não encontrado");
};
