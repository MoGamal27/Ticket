import { Request, Response } from "express";
import { db } from "../../models/db";
import { adminPrivileges, admins, privileges } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";
import { saveBase64Image } from "../../utils/handleImages";
import { v4 as uuid } from "uuid";
import { deletePhotoFromServer } from "../../utils/deleteImage";

export const getAllAdmins = async (req: Request, res: Response) => {
  const adminsD = await db.select().from(admins);
  SuccessResponse(res, { admins: adminsD }, 200);
};

export const getAdmin = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const [admin] = await db.select().from(admins).where(eq(admins.id, id));
  if (!admin) throw new NotFound("Admin Not Found");

  const privilegsRaw = await db
    .select({
      id: privileges.id,
      name: privileges.name,
      action: privileges.action,
    })
    .from(adminPrivileges)
    .where(eq(adminPrivileges.adminId, id))
    .leftJoin(privileges, eq(privileges.id, adminPrivileges.privilegeId));

  const groupedPrivilegs = privilegsRaw.reduce((acc, curr) => {
    if (!curr.name) return acc; // skip if no privilege
    if (!acc[curr.name]) {
      acc[curr.name] = [];
    }
    acc[curr.name].push({
      id: curr.id!,
      action: curr.action!,
    });
    return acc;
  }, {} as Record<string, { id: number; action: string }[]>);

  SuccessResponse(res, { ...admin, privilegs: groupedPrivilegs }, 200);
};

export const createAdmin = async (req: Request, res: Response) => {
  const data = req.body;
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  if (data.imagePath) {
    data.imagePath = await saveBase64Image(
      data.imagePath,
      uuid(),
      req,
      "admins"
    );
  }
  data.isSuperAdmin = data.isSuperAdmin === "superAdmin";
  await db.insert(admins).values(data);
  SuccessResponse(res, { message: "Admin Created Successfully" });
};

export const updateAdmin = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;
  const [admin] = await db.select().from(admins).where(eq(admins.id, id));
  if (!admin) throw new NotFound("Admin Not Found");
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  if (data.imagePath) {
    await deletePhotoFromServer(new URL(admin.imagePath!).pathname);
    data.imagePath = await saveBase64Image(
      data.imagePath,
      uuid(),
      req,
      "admins"
    );
  }
  data.isSuperAdmin = data.isSuperAdmin === "superAdmin";
  await db.update(admins).set(data).where(eq(admins.id, id));
  SuccessResponse(res, { message: "Admin Updated Successfully" }, 200);
};

export const deleteAdmin = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [admin] = await db.select().from(admins).where(eq(admins.id, id));
  if (!admin) throw new NotFound("Admin Not Found");
  if (admin.imagePath)
    await deletePhotoFromServer(new URL(admin.imagePath!).pathname);
  await db.delete(admins).where(eq(admins.id, id));
  SuccessResponse(res, { message: "Admin Deleted Successfully" }, 200);
};

// Privilegs
export const addPrivilegesAdmin = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const privilegesList = req.body.privilegesIds;
  const [admin] = await db.select().from(admins).where(eq(admins.id, id));
  if (!admin) throw new NotFound("Admin Not Found");
  await db.delete(adminPrivileges).where(eq(adminPrivileges.adminId, id));
  for (const privilege of privilegesList) {
    await db.insert(adminPrivileges).values({
      adminId: id,
      privilegeId: privilege,
    });
  }
  SuccessResponse(res, { message: "Admin has privileges successfully" });
};
