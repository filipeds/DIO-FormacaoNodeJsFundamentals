import { findAllMatches, findMatchById } from "../repositories/matches-repository";
import { findClubById, findAllClubs } from "../repositories/clubs-repository";
import { MatchModel } from "../models/match-model";
import { HttpError } from "../utils/http-error";
import { StatusCode } from "../utils/status-code";
import { parseId } from "../utils/validators";

const describeMatch = (m: MatchModel) => ({
  ...m,
  homeClub: findClubById(m.homeClubId)?.name ?? null,
  awayClub: findClubById(m.awayClubId)?.name ?? null,
});

export const listMatches = (round?: unknown, club?: unknown) => {
  let matches = findAllMatches();

  if (round !== undefined) {
    const n = Number(round);
    if (!Number.isInteger(n) || n < 1) {
      throw new HttpError(StatusCode.BAD_REQUEST, "round deve ser um inteiro positivo");
    }
    matches = matches.filter((m) => m.round === n);
  }

  if (typeof club === "string" && club.trim() !== "") {
    const wanted = club.trim().toLowerCase();
    const ids = findAllClubs()
      .filter((c) => c.name.toLowerCase() === wanted)
      .map((c) => c.id);
    matches = matches.filter((m) => ids.includes(m.homeClubId) || ids.includes(m.awayClubId));
  }

  return matches.map(describeMatch);
};

export const getMatch = (rawId: unknown) => {
  const match = findMatchById(parseId(rawId));
  if (!match) throw new HttpError(StatusCode.NOT_FOUND, "Partida não encontrada");
  return describeMatch(match);
};
