import { Request, Response, NextFunction } from "express";
import { db } from "../models/db"; 
import { adminPrivileges, privileges } from "../models/schema"; 
import { eq, and } from "drizzle-orm";

export const hasPrivilege = (requiredName: string, requiredAction: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Assuming you store admin ID in req.user after authentication
      const adminId = (req as any).user?.id;
      
      if (!adminId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if admin has the required privilege
      const hasAccess = await db
        .select()
        .from(adminPrivileges)
        .innerJoin(privileges, eq(adminPrivileges.privilegeId, privileges.id))
        .where(
          and(
            eq(adminPrivileges.adminId, adminId),
            eq(privileges.name, requiredName),
            eq(privileges.action, requiredAction)
          )
        )
        .limit(1);

      if (hasAccess.length === 0) {
        return res.status(403).json({ 
          error: "Access denied. you don't have the required privilege." 
        });
      }

      next();
    } catch (error) {
      console.error("Privilege check error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
};