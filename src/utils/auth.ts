import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UnauthorizedError } from "../Errors";
dotenv.config();

export const generateToken = (user: any): string => {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;
    return {
      id: decoded.id,
      roles: decoded.roles,
    };
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
};
