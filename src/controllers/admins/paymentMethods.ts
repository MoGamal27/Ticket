import { Request, Response } from "express";
import { db } from "../../models/db";
import { manualPaymentTypes } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";
import { deletePhotoFromServer } from "../../utils/deleteImage";
import { saveBase64Image } from "../../utils/handleImages";
import { v4 } from "uuid";

export const getAllPaymentMethods = async (req: Request, res: Response) => {
  const methods = await db.select().from(manualPaymentTypes);
  SuccessResponse(res, { methods }, 200);
};

export const getMethod = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [method] = await db
    .select()
    .from(manualPaymentTypes)
    .where(eq(manualPaymentTypes.id, id));
  if (!method) throw new NotFound("Method not found");
  SuccessResponse(res, { method }, 200);
};

export const updateMethod = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [method] = await db
    .select()
    .from(manualPaymentTypes)
    .where(eq(manualPaymentTypes.id, id));
  if (!method) throw new NotFound("Method not found");
  const data = req.body;
  if (data.logoPath) {
    await deletePhotoFromServer(new URL(method.logoPath!).pathname);
    data.logoPath = await saveBase64Image(
      data.logoPath,
      v4(),
      req,
      "paymentMethods"
    );
  }
  await db
    .update(manualPaymentTypes)
    .set(data)
    .where(eq(manualPaymentTypes.id, id));
  SuccessResponse(res, { message: "Method Updated Successfully" }, 200);
};

export const deleteMethod = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [method] = await db
    .select()
    .from(manualPaymentTypes)
    .where(eq(manualPaymentTypes.id, id));
  if (!method) throw new NotFound("Method not found");
  await deletePhotoFromServer(new URL(method.logoPath!).pathname);
  await db.delete(manualPaymentTypes).where(eq(manualPaymentTypes.id, id));
  SuccessResponse(res, { message: "Method Deleted Successfully" }, 200);
};

export const createMethod = async (req: Request, res: Response) => {
  const data = req.body;
  data.logoPath = await saveBase64Image(
    data.logoPath,
    v4(),
    req,
    "paymentMethods"
  );
  await db.insert(manualPaymentTypes).values(data);
  SuccessResponse(res, { message: "Method Created Successfully" }, 201);
};


