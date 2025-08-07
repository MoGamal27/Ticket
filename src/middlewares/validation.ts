import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodError, AnyZodObject, ZodEffects } from "zod";

export const validate = (
  schema: AnyZodObject | ZodEffects<AnyZodObject>
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw error;
      }
      next(error);
    }
  };
};
