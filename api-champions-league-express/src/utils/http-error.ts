import { StatusCode } from "./status-code";

export class HttpError extends Error {
  constructor(public status: StatusCode, message: string) {
    super(message);
  }
}
