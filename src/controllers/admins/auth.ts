import { Request, Response } from "express";
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
  let privilegeNames;
  let token;
  if (!admin.isSuperAdmin) {
    const result = await db
      .select({
        privilegeName: privileges.name,
        privilegeAction: privileges.action,
      })
      .from(adminPrivileges)
      .innerJoin(privileges, eq(adminPrivileges.privilegeId, privileges.id))
      .where(eq(adminPrivileges.adminId, admin.id));
    privilegeNames = result.map(
      (r) => r.privilegeName + "_" + r.privilegeAction
    );
    token = generateToken({
      id: admin.id,
      roles: privilegeNames,
    });
  } else {
    token = generateToken({
      id: admin.id,
      roles: ["super_admin"],
    });
  }

  SuccessResponse(
    res,
    { message: "login Successful", token: token, privileges: privilegeNames },
    200
  );
}
