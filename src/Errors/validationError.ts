import { AppError } from "./appError";
import { StatusCodes } from "http-status-codes";
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, StatusCodes.BAD_REQUEST, details);
  }
}
