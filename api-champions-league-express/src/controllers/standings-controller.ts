import { Request, Response } from "express";
import { getStandings } from "../services/standings-service";
import { StatusCode } from "../utils/status-code";

export const getStandingsTable = (_req: Request, res: Response) => {
  res.status(StatusCode.OK).json(getStandings());
};
