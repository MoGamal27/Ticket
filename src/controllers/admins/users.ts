import { Request, Response } from "express";
import { db } from "../../models/db";
import {
  users,
  emailVerifications,
  promoCodeUsers,
  bookings,
  bookingDetails,
  bookingExtras,
  payments,
  manualPaymentMethod,
  Medicals,
  medicalCategories,
  MedicalImages
} from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";

export const getAllUsers = async (req: Request, res: Response) => {
  const usersDate = await db.select().from(users);
  SuccessResponse(res, { users: usersDate }, 200);
};

export const createUser = async (req: Request, res: Response) => {
  const data = req.body;
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  await db.insert(users).values(data);
  SuccessResponse(res, { message: "User Created Successfully" }, 201);
};

export const getUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) throw new NotFound("User Not Found");
  SuccessResponse(res, { user }, 200);
};

export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;
  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) throw new NotFound("User Not Found");
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  await db.update(users).set(data).where(eq(users.id, id));
  SuccessResponse(res, { message: "User Updated Successfully" }, 200);
};



export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  
  // First check if user exists
  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) throw new NotFound("User Not Found");

  // Start a transaction to ensure all deletions succeed or fail together
  await db.transaction(async (tx) => {
    // Delete related records in the correct order to respect foreign key constraints
    
    // 1. Delete medical-related records first (deepest nested)
    const userMedicals = await tx.select().from(Medicals).where(eq(Medicals.userId, id));
    
    for (const medical of userMedicals) {
      // Delete medical categories
      await tx.delete(medicalCategories).where(eq(medicalCategories.medicalId, medical.id));
      
      // Delete medical images
      await tx.delete(MedicalImages).where(eq(MedicalImages.medicalId, medical.id));
    }
    
    // Delete medical records
    await tx.delete(Medicals).where(eq(Medicals.userId, id));

    // 2. Delete promo code usage
    await tx.delete(promoCodeUsers).where(eq(promoCodeUsers.userId, id));

    // 3. Delete email verification
    await tx.delete(emailVerifications).where(eq(emailVerifications.userId, id));

    // 4. Delete bookings and related records
    const userBookings = await tx.select().from(bookings).where(eq(bookings.userId, id));
    
    for (const booking of userBookings) {
      // Delete booking details
      await tx.delete(bookingDetails).where(eq(bookingDetails.bookingId, booking.id));
      
      // Delete booking extras
      await tx.delete(bookingExtras).where(eq(bookingExtras.bookingId, booking.id));
      
      // Delete payments
      const bookingPayments = await tx.select().from(payments).where(eq(payments.bookingId, booking.id));
      
      for (const payment of bookingPayments) {
        // Delete manual payment methods
        await tx.delete(manualPaymentMethod).where(eq(manualPaymentMethod.paymentId, payment.id));
      }
      
      await tx.delete(payments).where(eq(payments.bookingId, booking.id));
    }
    
    // Delete bookings
    await tx.delete(bookings).where(eq(bookings.userId, id));

    // 5. Finally delete the user
    await tx.delete(users).where(eq(users.id, id));
  });

  SuccessResponse(res, { message: "User and all related data deleted successfully" }, 200);
};