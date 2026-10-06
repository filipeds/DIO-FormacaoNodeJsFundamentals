import { Request, Response } from "express";
import * as service from "../services/players-service";
import { StatusCode } from "../utils/status-code";

export const getPlayers = (req: Request, res: Response) => {
  res.status(StatusCode.OK).json(service.listPlayers(req.query.club));
};

export const getPlayerById = (req: Request, res: Response) => {
  res.status(StatusCode.OK).json(service.getPlayer(req.params.id));
};

export const postPlayer = (req: Request, res: Response) => {
  res.status(StatusCode.CREATED).json(service.createPlayer(req.body));
};

export const putPlayer = (req: Request, res: Response) => {
  res.status(StatusCode.OK).json(service.replacePlayer(req.params.id, req.body));
};

export const deletePlayerById = (req: Request, res: Response) => {
  service.removePlayer(req.params.id);
  res.status(StatusCode.NO_CONTENT).send();
};
