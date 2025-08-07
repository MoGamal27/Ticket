import { AppError } from "./appError";
import { StatusCodes } from "http-status-codes";

export class NotNullConstrainError extends AppError {
  constructor(field: string, details?: any) {
    super(`Field ${field} is required`, StatusCodes.BAD_REQUEST, details);
  }
}
