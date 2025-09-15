import { Request, Response, NextFunction } from "express";
import { db } from "../../models/db";
import { adminPrivileges, admins, privileges } from "../../models/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/auth";
import { UnauthorizedError } from "../../Errors";
import { SuccessResponse } from "../../utils/response";

export async function login(req: Request, res: Response) {
  const data = req.body;

  const [admin] = await db
    .select()
    .from(admins)
    .where(eq(admins.email, data.email));

  if (!admin) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const match = await bcrypt.compare(data.password, admin.password);
  if (!match) {
    throw new UnauthorizedError("Invalid email or password");
  }

  let token;
  let groupedPrivileges = {};

  // Get privileges for ALL admins from admin_privileges table
  const result = await db
    .select({
      privilegeName: privileges.name,
      privilegeAction: privileges.action,
      privilegeId: privileges.id
    })
    .from(adminPrivileges)
    .innerJoin(privileges, eq(adminPrivileges.privilegeId, privileges.id))
    .where(eq(adminPrivileges.adminId, admin.id));

  const privilegeNames = result.map(
    (r) => r.privilegeName + "_" + r.privilegeAction
  );

  // Group the assigned privileges
  groupedPrivileges = result.reduce((acc, curr) => {
    if (!acc[curr.privilegeName]) {
      acc[curr.privilegeName] = [];
    }
    acc[curr.privilegeName].push({
      id: curr.privilegeId,
      action: curr.privilegeAction,
    });
    return acc;
  }, {} as Record<string, { id: number; action: string }[]>);

  // For super admin, add the super_admin role but don't automatically give all privileges
  if (admin.isSuperAdmin) {
    privilegeNames.push("super_admin");
  }

  token = generateToken({
    id: admin.id,
    roles: privilegeNames,
  });

  SuccessResponse(
    res,
    {
      message: "login Successful",
      token: token,
      groupedPrivileges: groupedPrivileges
    },
    200
  );
}
