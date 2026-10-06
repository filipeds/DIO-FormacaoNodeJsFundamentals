import { Request, Response } from "express";
import * as service from "../services/clubs-service";
import { StatusCode } from "../utils/status-code";

export const getClubs = (_req: Request, res: Response) => {
  res.status(StatusCode.OK).json(service.listClubs());
};

export const getClubById = (req: Request, res: Response) => {
  res.status(StatusCode.OK).json(service.getClub(req.params.id));
};

export const postClub = (req: Request, res: Response) => {
  res.status(StatusCode.CREATED).json(service.createClub(req.body));
};

export const putClub = (req: Request, res: Response) => {
  res.status(StatusCode.OK).json(service.replaceClub(req.params.id, req.body));
};

export const deleteClubById = (req: Request, res: Response) => {
  service.removeClub(req.params.id);
  res.status(StatusCode.NO_CONTENT).send();
};
