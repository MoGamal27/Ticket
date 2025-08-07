import { AppError } from "./appError";
import { StatusCodes } from "http-status-codes";

export class BadRequest extends AppError {
  constructor(message = "Bad request", details?: any) {
    super(message, StatusCodes.BAD_REQUEST, details);
  }
}
