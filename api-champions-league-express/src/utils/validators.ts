import { HttpError } from "./http-error";
import { StatusCode } from "./status-code";

export const parseId = (value: unknown): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(StatusCode.BAD_REQUEST, "id deve ser um inteiro positivo");
  }
  return id;
};

export const requireString = (body: any, field: string): string => {
  const value = body?.[field];
  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(StatusCode.BAD_REQUEST, `${field} é obrigatório e deve ser texto`);
  }
  return value.trim();
};

export const requireInt = (body: any, field: string): number => {
  const value = body?.[field];
  if (!Number.isInteger(value) || value < 1) {
    throw new HttpError(StatusCode.BAD_REQUEST, `${field} é obrigatório e deve ser um inteiro positivo`);
  }
  return value;
};
