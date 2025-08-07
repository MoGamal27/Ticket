import { Request, Response } from "express";
import { db } from "../../models/db";
import {
  bookings,
  payments,
  promoCode,
  tours,
  users,
} from "../../models/schema";
import { eq, sql } from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";

export const getStatistics = async (req: Request, res: Response) => {
  const [{ userCount }] = await db
    .select({ userCount: sql<number>`COUNT(*)` })
    .from(users);
  const [{ tourCount }] = await db
    .select({ tourCount: sql<number>`COUNT(*)` })
    .from(tours);
  const [{ bookingCount }] = await db
    .select({ bookingCount: sql<number>`COUNT(*)` })
    .from(bookings);
  const [{ paymnetCount }] = await db
    .select({ paymnetCount: sql<number>`COUNT(*)` })
    .from(payments)
    .where(eq(payments.status, "pending"));
  const [{ promocodeCount }] = await db
    .select({ promocodeCount: sql<number>`COUNT(*)` })
    .from(promoCode)
    .where(eq(promoCode.status, true));
  SuccessResponse(
    res,
    { userCount, tourCount, bookingCount, paymnetCount, promocodeCount },
    200
  );
};
