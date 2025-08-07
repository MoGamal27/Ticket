import { AppError } from "./appError";
import { StatusCodes } from "http-status-codes";

export class ConflictError extends AppError {
  constructor(message = "Resource Conflict", details?: any) {
    super(message, StatusCodes.CONFLICT, details);
  }
}
