import { Request, Response } from "express";
import * as service from "../services/matches-service";
import { StatusCode } from "../utils/status-code";

export const getMatches = (req: Request, res: Response) => {
  res.status(StatusCode.OK).json(service.listMatches(req.query.round, req.query.club));
};

export const getMatchById = (req: Request, res: Response) => {
  res.status(StatusCode.OK).json(service.getMatch(req.params.id));
};
