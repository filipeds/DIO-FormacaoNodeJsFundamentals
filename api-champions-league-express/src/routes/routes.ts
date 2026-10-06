import { Router } from "express";
import * as clubs from "../controllers/clubs-controller";
import * as players from "../controllers/players-controller";
import * as matches from "../controllers/matches-controller";
import { getStandingsTable } from "../controllers/standings-controller";

const router = Router();

router.get("/clubs", clubs.getClubs);
router.get("/clubs/:id", clubs.getClubById);
router.post("/clubs", clubs.postClub);
router.put("/clubs/:id", clubs.putClub);
router.delete("/clubs/:id", clubs.deleteClubById);

router.get("/players", players.getPlayers);
router.get("/players/:id", players.getPlayerById);
router.post("/players", players.postPlayer);
router.put("/players/:id", players.putPlayer);
router.delete("/players/:id", players.deletePlayerById);

router.get("/matches", matches.getMatches);
router.get("/matches/:id", matches.getMatchById);

router.get("/standings", getStandingsTable);

export default router;
