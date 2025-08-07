import { AppError } from "./appError";
import { StatusCodes } from "http-status-codes";

export class NotFound extends AppError {
  constructor(message = "Not Found Resource", details?: any) {
    super(message, StatusCodes.NOT_FOUND, details);
  }
}
