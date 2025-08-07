import { Request, Response } from "express";
import { db } from "../../models/db";
import { homePageFAQ } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";

export const getAllFaq = async (req: Request, res: Response) => {
  const faqs = await db.select().from(homePageFAQ);
  SuccessResponse(res, { faqs }, 200);
};

export const getFaqById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [faq] = await db
    .select()
    .from(homePageFAQ)
    .where(eq(homePageFAQ.id, id));
  if (!faq) throw new NotFound("FAQ Not Found");
  SuccessResponse(res, { faq }, 200);
};

export const createFaq = async (req: Request, res: Response) => {
  const data = req.body;
  await db.insert(homePageFAQ).values(data);
  SuccessResponse(res, { message: "FAQ Created Successfully" });
};

export const updateFaq = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [faq] = await db
    .select()
    .from(homePageFAQ)
    .where(eq(homePageFAQ.id, id));
  if (!faq) throw new NotFound("FAQ Not Found");
  const data = req.body;
  await db.update(homePageFAQ).set(data).where(eq(homePageFAQ.id, id));
  SuccessResponse(res, { message: "FAQ Updated Successfully" });
};

export const deleteFaq = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [faq] = await db
    .select()
    .from(homePageFAQ)
    .where(eq(homePageFAQ.id, id));
  if (!faq) throw new NotFound("FAQ Not Found");
  await db.delete(homePageFAQ).where(eq(homePageFAQ.id, id));
  SuccessResponse(res, { message: "FAQ Deleted Successfully" });
};
