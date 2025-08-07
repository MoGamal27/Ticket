import { Request, Response } from "express";
import { db } from "../../models/db";
import { currencies } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";

export const getAllCurrencies = async (req: Request, res: Response) => {
  const currency = await db.select().from(currencies);
  SuccessResponse(res, { currencies: currency }, 200);
};

export const getCurrency = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [currency] = await db
    .select()
    .from(currencies)
    .where(eq(currencies.id, id));
  SuccessResponse(res, { currency }, 200);
};

export const createCurrency = async (req: Request, res: Response) => {
  const data = req.body;
  await db.insert(currencies).values(data);
  SuccessResponse(res, { message: "Currency Added Successfully" }, 201);
};

export const updateCurrency = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [currency] = await db
    .select()
    .from(currencies)
    .where(eq(currencies.id, id));
  if (!currency) throw new NotFound("Currency Not Found");
  const data = req.body;
  await db.update(currencies).set(data).where(eq(currencies.id, id));
  SuccessResponse(res, { message: "Currency Updated Successfully" }, 200);
};

export const deleteCurrency = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [currency] = await db
    .select()
    .from(currencies)
    .where(eq(currencies.id, id));
  if (!currency) throw new NotFound("Currency Not Found");
  const data = req.body;
  await db.delete(currencies).where(eq(currencies.id, id));
  SuccessResponse(res, { message: "Currency Deleted Successfully" }, 200);
};
