import { MatchModel } from "../models/match-model";
import data from "./matches.json";

const matches: MatchModel[] = [...data];

export const findAllMatches = (): MatchModel[] => matches;

export const findMatchById = (id: number): MatchModel | undefined =>
  matches.find((m) => m.id === id);
