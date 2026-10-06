import { findAllClubs } from "../repositories/clubs-repository";
import { findAllMatches } from "../repositories/matches-repository";
import { StandingModel } from "../models/standing-model";

export const getStandings = (): StandingModel[] => {
  const table = new Map<number, Omit<StandingModel, "position">>();

  for (const club of findAllClubs()) {
    table.set(club.id, {
      clubId: club.id, club: club.name, played: 0, wins: 0, draws: 0,
      losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
    });
  }

  const apply = (id: number, scored: number, conceded: number) => {
    const row = table.get(id);
    if (!row) return;
    row.played++;
    row.goalsFor += scored;
    row.goalsAgainst += conceded;
    row.goalDifference = row.goalsFor - row.goalsAgainst;
    if (scored > conceded) {
      row.wins++;
      row.points += 3;
    } else if (scored === conceded) {
      row.draws++;
      row.points += 1;
    } else {
      row.losses++;
    }
  };

  for (const m of findAllMatches()) {
    apply(m.homeClubId, m.homeGoals, m.awayGoals);
    apply(m.awayClubId, m.awayGoals, m.homeGoals);
  }

  return [...table.values()]
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        a.club.localeCompare(b.club)
    )
    .map((row, i) => ({ position: i + 1, ...row }));
};
