import { Request, Response } from "express";
import { db } from "../../models/db";
import {
  manualPaymentMethod,
  manualPaymentTypes,
  payments,
} from "../../models/schema";
import { eq } from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";
import { NotFound } from "../../Errors";

export const getPendingPayments = async (req: Request, res: Response) => {
  const paymentsData = await db
    .select()
    .from(payments)
    .where(eq(payments.status, "pending"));
  SuccessResponse(res, { payments: paymentsData }, 200);
};

export const getPaymentById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const [payment] = await db
    .select({
      payment: payments,
      manualMethod: manualPaymentMethod,
      manualType: manualPaymentTypes,
    })
    .from(payments)
    .where(eq(payments.id, id))
    .leftJoin(
      manualPaymentMethod,
      eq(manualPaymentMethod.paymentId, payments.id)
    )
    .leftJoin(
      manualPaymentTypes,
      eq(manualPaymentTypes.id, manualPaymentMethod.manualPaymentTypeId)
    );

  if (!payment) throw new NotFound("Payment Not Found");

  SuccessResponse(res, { payment }, 200);
};

export const changeStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [payment] = await db.select().from(payments).where(eq(payments.id, id));
  if (!payment) throw new NotFound("Payment Not Found");
  const { status, rejectionReason } = req.body;
  if (status === "cancelled") {
    await db
      .update(payments)
      .set({ status, rejectionReason })
      .where(eq(payments.id, id));
  }
  await db
    .update(payments)
    .set({ status, rejectionReason: null })
    .where(eq(payments.id, id));
  SuccessResponse(res, { message: "Status Changed Succussfully" }, 200);
};

export const getAutoPayments = async (req: Request, res: Response) => {
  const paymentsData = await db
    .select()
    .from(payments)
    .where(eq(payments.method, "auto"));
  SuccessResponse(res, { payments: paymentsData }, 200);
};
