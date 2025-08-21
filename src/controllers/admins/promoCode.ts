import { Request, Response } from "express";
import { db } from "../../models/db";
import { promoCode, promoCodeUsers } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";

export const getAllPromoCodes = async (req: Request, res: Response) => {
  const codes = await db.select().from(promoCode);
  
  const formattedCodes = codes.map(code => ({
    ...code,
   startDate: code.startDate.toISOString().split('T')[0],
  endDate: code.endDate.toISOString().split('T')[0]
  })); 
  SuccessResponse(res, { codes: formattedCodes });
};

export const getCode = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [code] = await db.select().from(promoCode).where(eq(promoCode.id, id));
  if (!code) throw new NotFound("Promo Code Not Found");
  const codeUsers = await db
    .select()
    .from(promoCodeUsers)
    .where(eq(promoCodeUsers.promoCodeId, id));
  SuccessResponse(res, { ...code, codeUsers }, 200);
};

export const createCode = async (req: Request, res: Response) => {
  const data = req.body;
  
  // Convert date strings to Date objects
  const processedData = {
    ...data,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate)
  };
  
  await db.insert(promoCode).values(processedData);
  SuccessResponse(res, { message: "Code created Successfully" }, 201);
};

export const updateCode = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [code] = await db.select().from(promoCode).where(eq(promoCode.id, id));
  if (!code) throw new NotFound("Code Not Found");
  const data = req.body;
  await db.update(promoCode).set(data).where(eq(promoCode.id, id));
  SuccessResponse(res, { message: "Code updated Successfully" }, 201);
};

export const deleteCode = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [code] = await db.select().from(promoCode).where(eq(promoCode.id, id));
  if (!code) throw new NotFound("Code Not Found");
  await db.delete(promoCode).where(eq(promoCode.id, id));
  SuccessResponse(res, { message: "Code deleted Successfully" }, 201);
};
