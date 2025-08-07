import { Request, Response } from "express";
import { db } from "../../models/db";
import { privileges } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";

export const getAllPrivilegs = async (req: Request, res: Response) => {
  const privilegs = await db.select().from(privileges);

  const grouped = privilegs.reduce((acc, curr) => {
    if (!acc[curr.name]) {
      acc[curr.name] = [];
    }
    acc[curr.name].push({
      id: curr.id,
      action: curr.action,
    });
    return acc;
  }, {} as Record<string, { id: number; action: string }[]>);

  SuccessResponse(res, { privilegs: grouped }, 200);
};

export const getPrivilegs = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [privileg] = await db
    .select()
    .from(privileges)
    .where(eq(privileges.id, id));
  if (!privileg) throw new NotFound("privileges not found");
  SuccessResponse(res, { privileg }, 200);
};

export const createPrivilegs = async (req: Request, res: Response) => {
  const { name, action } = req.body;
  await db.insert(privileges).values({ name, action });
  SuccessResponse(res, { message: "privilege created successfully" });
};

export const updatePrivilegs = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;
  const [privileg] = await db
    .select()
    .from(privileges)
    .where(eq(privileges.id, id));
  if (!privileg) throw new NotFound("privileges not found");
  await db.update(privileges).set(data).where(eq(privileges.id, id));
  SuccessResponse(res, { message: "Privileges Updated Successfully" }, 200);
};

export const deletePrivilegs = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [privileg] = await db
    .select()
    .from(privileges)
    .where(eq(privileges.id, id));
  if (!privileg) throw new NotFound("privileges not found");
  await db.delete(privileges).where(eq(privileges.id, id));
  SuccessResponse(res, { privileg }, 200);
};
