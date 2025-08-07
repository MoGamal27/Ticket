import { AppError } from "./appError";
import { StatusCodes } from "http-status-codes";

export class UniqueConstrainError extends AppError {
  constructor(field: string, details?: any) {
    super(`Field ${field} must be unique`, StatusCodes.CONFLICT, details);
  }
}
