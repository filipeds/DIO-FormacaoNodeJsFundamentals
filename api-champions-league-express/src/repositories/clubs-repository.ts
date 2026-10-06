import { ClubModel } from "../models/club-model";
import data from "./clubs.json";

const clubs: ClubModel[] = [...data];
let nextId = Math.max(...clubs.map((c) => c.id)) + 1;

export const findAllClubs = (): ClubModel[] => clubs;

export const findClubById = (id: number): ClubModel | undefined =>
  clubs.find((c) => c.id === id);

export const insertClub = (club: Omit<ClubModel, "id">): ClubModel => {
  const created = { id: nextId++, ...club };
  clubs.push(created);
  return created;
};

export const updateClub = (id: number, club: Omit<ClubModel, "id">): ClubModel | undefined => {
  const index = clubs.findIndex((c) => c.id === id);
  if (index === -1) return undefined;
  clubs[index] = { id, ...club };
  return clubs[index];
};

export const deleteClub = (id: number): boolean => {
  const index = clubs.findIndex((c) => c.id === id);
  if (index === -1) return false;
  clubs.splice(index, 1);
  return true;
};
