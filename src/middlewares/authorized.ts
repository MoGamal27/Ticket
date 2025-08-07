import { NextFunction, Request, Response, RequestHandler } from "express";
import { UnauthorizedError } from "../Errors";

export const authorizePermissions = (
  ...requiredPermissions: string[]
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { id: number; roles: string[] };
    console.log(user);
    if (!user) throw new UnauthorizedError("No permissions loaded");
    if (!user.roles) {
      throw new UnauthorizedError(`No permissions loade ${user}`);
    }
    if (user.roles.includes("super_admin")) {
      return next();
    }
    const hasPermission = requiredPermissions.every((p) =>
      user.roles.includes(p)
    );

    if (!hasPermission) {
      throw new UnauthorizedError("Permission denied");
    }

    next();
  };
};
