import { Response } from "express";

interface ISuccessResponse<T> {
  success: true;
  data: T;
}

export interface IErrorResponse {
  success: false;
  error: {
    code: number;
    message: string;
    details?: any;
  };
}

export const SuccessResponse = <T>(
  res: Response,
  data: T,
  statusCode: number = 200
): void => {
  const response: ISuccessResponse<T> = { success: true, data: data };
  res.status(statusCode).json(response);
};
