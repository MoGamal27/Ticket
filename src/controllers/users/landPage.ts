import { Request, Response } from "express";
import { db } from "../../models/db";
import {
  categories,
  cites,
  countries,
  homePageCover,
  homePageFAQ,
  tourDiscounts,
  tourPrice,
  tours,
  tourExtras,
  tourDaysOfWeek,
  tourExcludes,
  tourFAQ,
  tourHighlight,
  tourImages,
  tourIncludes,
  tourItinerary,
  currencies,
  extras,
  bookings,
  payments,
  manualPaymentMethod,
  users,
  manualPaymentTypes,
  bookingDetails,
  bookingExtras,
  tourSchedules,
  Medicals,
  categoryMedical,
  MedicalImages,
  medicalCategories,
  tourPromoCode,
  promoCode

} from "../../models/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";
import { NotFound, UnauthorizedError, ValidationError } from "../../Errors";
import { saveBase64Image } from "../../utils/handleImages";
import { v4 as uuid } from "uuid";
import { AuthenticatedRequest } from "../../types/custom";
import { title } from "process";
import { privateDecrypt } from "crypto";
import { sendEmail } from "../../utils/sendEmails";


// format start date to YYYY-MM-DD
export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]; 
};


export const getImages = async (req: Request, res: Response) => {
  let img;
  const [cover] = await db
    .select()
    .from(homePageCover)
    .where(eq(homePageCover.status, true));
  if (!cover)
    img = {
      imagePath: "https://bcknd.tickethub-tours.com/uploads/homes/default.jpg",
    };
  else img = cover;
  const category = await db.select().from(categories);
  const faqs = await db
    .select()
    .from(homePageFAQ)
    .where(eq(homePageFAQ.status, true));
  SuccessResponse(res, { cover: img, categories: category, faqs }, 200);
};

export const getFeaturedTours = async (req: Request, res: Response) => {
  const tour = await db
    .select({
      id: tours.id,
      title: tours.title,
      country: countries.name,
      city: cites.name,
      imagePath: tours.mainImage,
      price: tourPrice.adult,
      discount: tourDiscounts.value,
      discribtion: tours.describtion,
      duration: tours.durationDays,
    })
    .from(tours)
    .where(eq(tours.featured, true))
    .leftJoin(tourPrice, eq(tours.id, tourPrice.tourId))
    .leftJoin(cites, eq(cites.id, tours.city))
    .leftJoin(countries, eq(countries.id, tours.country))
    .leftJoin(tourDiscounts, eq(tourDiscounts.tourId, tours.id))
    .groupBy(tours.id);
  SuccessResponse(res, { tours: tour }, 200);
};

export const getToursByCategory = async (req: Request, res: Response) => {
  const category = req.params.category;

  const tour = await db
    .select({
      id: tours.id,
      title: tours.title,
      country: countries.name,
      city: cites.name,
      imagePath: tours.mainImage,
      price: tourPrice.adult,
      discount: tourDiscounts.value,
      discribtion: tours.describtion,
      duration: tours.durationDays,
    })
    .from(tours)
    .leftJoin(tourPrice, eq(tours.id, tourPrice.tourId))
    .leftJoin(cites, eq(cites.id, tours.city))
    .leftJoin(countries, eq(countries.id, tours.country))
    .leftJoin(tourDiscounts, eq(tourDiscounts.tourId, tours.id))
    .leftJoin(categories, eq(categories.id, tours.categoryId))
    .where(eq(categories.name, category.toLowerCase()));
  SuccessResponse(res, { tours: tour }, 200);
};

export const getTourById = async (req: Request, res: Response) => {
  const tourId = Number(req.params.id);
  const [mainTour] = await db
    .select({
      id: tours.id,
      title: tours.title,
      mainImage: tours.mainImage,
      description: tours.describtion,
      featured: tours.featured,
      status: tours.status,
      startDate: tours.startDate,
      endDate: tours.endDate,
      meetingPoint: tours.meetingPoint,
      meetingPointLocation: tours.meetingPointLocation,
      meetingPointAddress: tours.meetingPointAddress,
      points: tours.points,
      durationDays: tours.durationDays,
      durationHours: tours.durationHours,
      country: countries.name,
      city: cites.name,
      maxUsers: tours.maxUsers,
      category: categories.name,
      tourScheduleId: tourSchedules.id,
      price: {
        adult: tourPrice.adult,
        child: tourPrice.child,
        infant: tourPrice.infant,
        currency: currencies.id,
      },
    })
    .from(tours)
    .leftJoin(categories, eq(tours.categoryId, categories.id))
    .leftJoin(tourPrice, eq(tours.id, tourPrice.tourId))
    .leftJoin(currencies, eq(tourPrice.currencyId, currencies.id))
    .leftJoin(cites, eq(cites.id, tours.city))
    .leftJoin(countries, eq(countries.id, tours.country))
    .leftJoin(tourSchedules, eq(tourSchedules.tourId, tours.id))
    .where(eq(tours.id, tourId));

  if (!mainTour) throw new NotFound("tour not found");

  const [
    highlights,
    includes,
    excludes,
    itinerary,
    faq,
    discounts,
    daysOfWeek,
    extrasWithPrices,
    images,
  ] = await Promise.all([
    db.select().from(tourHighlight).where(eq(tourHighlight.tourId, tourId)),
    db.select().from(tourIncludes).where(eq(tourIncludes.tourId, tourId)),
    db.select().from(tourExcludes).where(eq(tourExcludes.tourId, tourId)),
    db.select().from(tourItinerary).where(eq(tourItinerary.tourId, tourId)),
    db.select().from(tourFAQ).where(eq(tourFAQ.tourId, tourId)),
    db.select().from(tourDiscounts).where(eq(tourDiscounts.tourId, tourId)),
    db
      .select({ dayOfWeek: tourDaysOfWeek.dayOfWeek })
      .from(tourDaysOfWeek)
      .where(eq(tourDaysOfWeek.tourId, tourId)),
    db.select({
        id: extras.id,
        name: extras.name,
        price: {
          adult: tourPrice.adult,
          child: tourPrice.child,
          infant: tourPrice.infant,
          currencyId: tourPrice.currencyId,
          // currency name
          currencyName: currencies.name,
        },
      })
      .from(tourExtras)
      .leftJoin(extras, eq(tourExtras.extraId, extras.id))
      .leftJoin(tourPrice, eq(tourExtras.priceId, tourPrice.id))
      .leftJoin(currencies, eq(tourPrice.currencyId, currencies.id))
      .where(eq(tourExtras.tourId, tourId)),
    db
      .select({ imagePath: tourImages.imagePath })
      .from(tourImages)
      .where(eq(tourImages.tourId, tourId)),
  ]);

  SuccessResponse(
    res,
    {
      ...mainTour,
      startDate: mainTour.startDate.toISOString().split('T')[0],
      endDate:  mainTour.endDate.toISOString().split('T')[0],
      highlights: highlights.map((h) => h.content),
      includes: includes.map((i) => i.content),
      excludes: excludes.map((e) => e.content),
      itinerary: itinerary.map((i) => ({
        title: i.title,
        imagePath: i.imagePath,
        description: i.describtion,
      })),
      faq: faq.map((f) => ({ question: f.question, answer: f.answer })),
      discounts,
      daysOfWeek: daysOfWeek.map((d) => d.dayOfWeek),
      extras: extrasWithPrices,
      images: images.map((img) => img.imagePath),
    },
    200
  );
};


/*export const createBookingWithPayment = async (req: Request, res: Response) => {
  const { 
    tourId, 
    adult,
    child,
    infant,
    image,
    price,
    discount,
    email,
    phoneNumber,
  } = req.body;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
  let userId;
  if (user) {
    userId = user.id;
  } else {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // Check if the tour exists
  const [tour] = await db
    .select()
    .from(tours)
    .where(eq(tours.id, tourId));
  if (!tour) {
    res.status(404).json({ message: "Tour not found" });
    return;
  }
  

 
  const [newBooking] = await db.insert(bookings).values({
    tourId,
    userId,
    status: "pending"
  }).$returningId();
  
  const [payment] = await db.insert(payments).values({
    bookingId: newBooking.id,
    method: "manual",
    status: "pending",
    amount: finalAmount,
    createdAt: new Date(),
  }).$returningId();

  
  if (image) {
    await db.insert(manualPaymentMethod).values({
      paymentId: payment.id,
      proofImage: image,
      uploadedAt: new Date()
    });
  }

  SuccessResponse(res, { 
    booking: newBooking,
    payment: payment
  }, 201);
};*/


// get payment method status true
export const getActivePaymentMethods = async (req: Request, res: Response) => {
  const methods = await db
    .select()
    .from(manualPaymentTypes)
    .where(eq(manualPaymentTypes.status, true));
  SuccessResponse(res, { methods }, 200);
};


export const createBookingWithPayment = async (req: Request, res: Response) => {
  const { 
    tourId,
    fullName,
    email,
    phone,
    notes,
    adultsCount,
    childrenCount,
    infantsCount,
    totalAmount,
    paymentMethodId,
    proofImage,
    extras,
    discount,
    location,
    address,
    promoCodeId
  } = req.body;

  // Parse tourId to ensure it's a number
  const tourIdNum = parseInt(tourId, 10);
  if (isNaN(tourIdNum)) {
    return res.status(400).json({
      success: false,
      message: "Invalid tourId provided"
    });
  }

  // Parse promoCodeId to ensure it's a number
   // Parse promoCodeId only if it's provided and not null/undefined
  let promoCodeIdNum: number | null = null;
  if (promoCodeId !== undefined && promoCodeId !== null && promoCodeId !== '') {
    promoCodeIdNum = parseInt(promoCodeId, 10);
    if (isNaN(promoCodeIdNum)) {
      return res.status(400).json({
        success: false,
        message: "Invalid promoCodeId provided"
      });
    }
  }


  const tourSchedule = await db
    .select({
      id: tourSchedules.id,
      tourId: tourSchedules.tourId
    })
    .from(tourSchedules)
    .where(eq(tourSchedules.id, tourIdNum)) 
    .limit(1);
    
  if (!tourSchedule || tourSchedule.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Tour schedule not found"
    });
  }

  // Extract the actual tourId from the schedule
  const actualTourId = tourSchedule[0].tourId;

  console.log("DEBUG - tourScheduleId:", tourIdNum);
  console.log("DEBUG - actualTourId:", actualTourId);
  console.log("DEBUG - promoCodeId:", promoCodeIdNum);
  
  try {
    // Check if user exists by email and get userId
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!existingUser.length) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email"
      });
    }

    const userId = existingUser[0].id;
    
   
    const promoCodeData = await db
      .select({
        id: promoCode.id,
        code: promoCode.code,
        usageLimit: promoCode.usageLimit,
        status: promoCode.status,
        startDate: promoCode.startDate,
        endDate: promoCode.endDate,
        tourPromoCodeId: tourPromoCode.id,
        tourId: tourPromoCode.tourId
      })
      .from(tourPromoCode)
      .leftJoin(promoCode, eq(promoCode.id, tourPromoCode.promoCodeId))
      .where(and(
        eq(tourPromoCode.tourId, actualTourId),
        eq(promoCode.id, promoCodeIdNum)
      ));

    if (promoCodeData && promoCodeData.length > 0) {
      const promo = promoCodeData[0];
      
      // Check usage limit - add null check
      if (promo.usageLimit === null || promo.usageLimit === undefined) {
        throw new Error("Promo code usage limit is invalid");
      }
      // Check if usage limit is still available
      if (promo.usageLimit > 0) {
        await db.update(promoCode)
          .set({ usageLimit: promo.usageLimit - 1 })
          .where(eq(promoCode.id, promo.id));
      } else {
        console.warn("Promo code usage limit reached or exceeded");
      }
    }
  
    // Start transaction
    await db.transaction(async (trx) => {
      // Create main booking record
      const [newBooking] = await trx.insert(bookings).values({
        tourId: tourIdNum,
        userId,
        status: "pending",
        discountNumber: discount,
        location: location,
        address: address, 
      }).$returningId();

      // Create booking details
      await trx.insert(bookingDetails).values({
        bookingId: newBooking.id,
        fullName,
        email,
        phone,
        notes: notes || null,
        adultsCount: adultsCount || 0,
        childrenCount: childrenCount || 0,
        infantsCount: infantsCount || 0,
        totalAmount: totalAmount
      });

      // Handle booking extras if provided
      if (extras) {
        const extrasToInsert = extras.map((e: any) => ({
          bookingId: newBooking.id,
          extraId: e.id,
          adultCount: parseInt(e.count.adult) || 0,
          childCount: parseInt(e.count.child) || 0,
          infantCount: parseInt(e.count.infant) || 0
        }));

        await trx.insert(bookingExtras).values(extrasToInsert);
      }

      // Create payment record
      const [payment] = await trx.insert(payments).values({
        bookingId: newBooking.id,
        method: "manual",
        status: "pending",
        amount: totalAmount,
        transactionId: null,
        createdAt: new Date()
      }).$returningId();

      // Handle proof image if provided
      let savedImageUrl = null;
      if (proofImage && paymentMethodId) {
        try {
          savedImageUrl = await saveBase64Image(proofImage, userId.toString(), req, "payment-proofs");
          
          await trx.insert(manualPaymentMethod).values({
            paymentId: payment.id,
            proofImage: savedImageUrl,
            manualPaymentTypeId: paymentMethodId,
            prooftext: null, 
            uploadedAt: new Date()
          });
        } catch (error) {
          console.error("Failed to save proof image:", error);
          throw new Error("Failed to save payment proof image");
        }
      }

      // Return success response
      SuccessResponse(res, { 
        booking: {
          id: newBooking.id,
          tourId: tourIdNum,
          userId,
          status: "pending",
          discountNumber: discount,
          location: location,
          address: address,
        },
        payment: {
          id: payment.id,
          bookingId: newBooking.id,
          method: "manual",
          status: "pending",
          amount: totalAmount,
          proofImage: savedImageUrl
        },
        details: {
          fullName,
          email,
          phone,
          notes,
          adultsCount,
          childrenCount,
          infantsCount,
          totalAmount
        },
        extras: extras || [],
        userId: userId
      }, 201);
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create booking"
    });
  }
};

// function to get booking with details
export const getBookingWithDetails = async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  try {
    const bookingData = await db
      .select({
        // Booking info
        bookingId: bookings.id,
        tourId: bookings.tourId,
        userId: bookings.userId,
        status: bookings.status,
        createdAt: bookings.createdAt,
        
        // User details
        fullName: bookingDetails.fullName,
        email: bookingDetails.email,
        phone: bookingDetails.phone,
        notes: bookingDetails.notes,
        adultsCount: bookingDetails.adultsCount,
        childrenCount: bookingDetails.childrenCount,
        infantsCount: bookingDetails.infantsCount,
        totalAmount: bookingDetails.totalAmount,
        
        // Payment
        paymentId: payments.id,
        paymentMethod: payments.method,
        paymentStatus: payments.status,
        paymentAmount: payments.amount,
        transactionId: payments.transactionId,
        
        // Manual payment proof
        proofImage: manualPaymentMethod.proofImage,
        proofText: manualPaymentMethod.prooftext,
      })
      .from(bookings)
      .leftJoin(bookingDetails, eq(bookings.id, bookingDetails.bookingId))
      .leftJoin(payments, eq(bookings.id, payments.bookingId))
      .leftJoin(manualPaymentMethod, eq(payments.id, manualPaymentMethod.paymentId))
      .where(eq(bookings.id, parseInt(bookingId)));

    if (!bookingData.length) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    SuccessResponse(res, bookingData[0]);

  } catch (error: any) {
    console.error("Get booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message
    });
  }
};


/*export const createMedical = async (req: Request, res: Response) => {
  const data = req.body;
  
  // Validate required fields
  if (!data.email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!data.categoryIds || !Array.isArray(data.categoryIds) || data.categoryIds.length === 0) {
    return res.status(400).json({ message: "At least one category ID is required" });
  }
  if (!data.describtion) {
    return res.status(400).json({ message: "Description is required" });
  }

  try {
    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email));
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate all categories exist
    const categories = await Promise.all(
      data.categoryIds.map(async (categoryId: number) => {
        const [category] = await db
          .select()
          .from(categoryMedical)
          .where(eq(categoryMedical.id, categoryId));
        if (!category) {
          throw new Error(`Category with ID ${categoryId} not found`);
        }
        return category;
      })
    );

    // Create medical records for each category
    const medicalRecords = await Promise.all(
      data.categoryIds.map(async (categoryId: number) => {
        const [newMedical] = await db.insert(Medicals).values({
          userId: user.id,
          categoryId: categoryId, // This was missing in your original code
          describtion: data.describtion,
        }).returning({ id: Medicals.id });
        
        return newMedical;
      })
    );

    // Handle images if provided
    if (data.images && data.images.length > 0) {
      // Create image records for each medical record
      await Promise.all(
        medicalRecords.flatMap(medicalRecord => 
          data.images.map(async (imagePath: string) => {
            await db.insert(MedicalImages).values({
              medicalId: medicalRecord.id,
              imagePath: await saveBase64Image(imagePath, uuid(), req, "medicalImages"),
            });
          })
        )
      );
    }

    SuccessResponse(res, { 
      message: "Medical Created Successfully",
      medicalRecords 
    }, 200);
  } catch (error: any) {
    if (error.message.startsWith('Category with ID')) {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error creating medical record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};*/

export const createMedical = async (req: Request, res: Response) => {
  const data = req.body;

  // Validate required fields
  if (!data.email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!data.categoryIds || !Array.isArray(data.categoryIds) || data.categoryIds.length === 0) {
    return res.status(400).json({ message: "At least one category ID is required" });
  }
  if (!data.describtion) {
    return res.status(400).json({ message: "Description is required" });
  }
  if (!data.fullName) {
    return res.status(400).json({ message: "Full name is required" });
  }
  if (!data.phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email));
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate all categories exist
    const categories = await Promise.all(
      data.categoryIds.map(async (categoryId: number) => {
        const [category] = await db
          .select()
          .from(categoryMedical)
          .where(eq(categoryMedical.id, categoryId));
        if (!category) {
          throw new Error(`Category with ID ${categoryId} not found`);
        }
        return category;
      })
    );

    // Create a single medical record with the new fields
    const [insertResult] = await db.insert(Medicals).values({
      userId: user.id,
      fullName: data.fullName, 
      phoneNumber: data.phoneNumber, 
      describtion: data.describtion,
    });

    const medicalId = insertResult.insertId;
    if (!medicalId) {
      throw new Error('Failed to create medical record');
    }

    // Create category associations
    await db.insert(medicalCategories).values(
      data.categoryIds.map(categoryId => ({
        medicalId: medicalId,
        categoryId: categoryId,
      }))
    );

    // Handle images if provided
    if (data.images && data.images.length > 0) {
      const imageRecords = await Promise.all(
        data.images.map(async (imagePath: string) => {
          const path = await saveBase64Image(imagePath, uuid(), req, "medicalImages");
          return {
            medicalId: medicalId,
            imagePath: path
          };
        })
      );
      
      await db.insert(MedicalImages).values(imageRecords);
    }

    // Get the created medical record with its categories
    const [medical] = await db
      .select({
        id: Medicals.id,
        userId: Medicals.userId,
        fullName: Medicals.fullName, 
        phoneNumber: Medicals.phoneNumber, 
        describtion: Medicals.describtion,
        status: Medicals.status,
      })
      .from(Medicals)
      .where(eq(Medicals.id, medicalId));

    // Get associated categories
    const associatedCategories = await db
      .select({
        categoryId: medicalCategories.categoryId,
      })
      .from(medicalCategories)
      .where(eq(medicalCategories.medicalId, medicalId));

    SuccessResponse(res, {
      message: "Medical record created successfully",
      medical: {
        ...medical,
        categories: associatedCategories
      }
    }, 201);
  } catch (error: any) {
    if (error.message.startsWith('Category with ID')) {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error creating medical record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getMedicalCategories = async (req: Request, res: Response) => {
    const data = await db.select().from(categoryMedical);
    SuccessResponse(res, { categoriesMedical: data }, 200);
    }


export const getAcceptMedicalRequests = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError("User not authenticated");
  }

  const userId = Number(req.user.id);

  // Get medical records
  const medicalRecords = await db
    .select({
      id: Medicals.id,
      userId: Medicals.userId,
      fullName: Medicals.fullName,
      phoneNumber: Medicals.phoneNumber,
      describtion: Medicals.describtion,
      documentUrl: Medicals.documentUrl,
      price: Medicals.price,
      status: Medicals.status,
    })
    .from(Medicals)
    .where(and(
      eq(Medicals.status, "accepted"),
      eq(Medicals.userId, userId)
    ));

  // Get categories for all medical records in one query
  const medicalIds = medicalRecords.map(record => record.id);
  
  const categories = medicalIds.length > 0 ? await db
    .select({
      medicalId: medicalCategories.medicalId,
      title: categoryMedical.title,
    })
    .from(medicalCategories)
    .innerJoin(categoryMedical, eq(categoryMedical.id, medicalCategories.categoryId))
    .where(inArray(medicalCategories.medicalId, medicalIds)) : [];

  // Group categories by medicalId
  const categoriesMap = categories.reduce((acc, category) => {
    if (!acc[category.medicalId!]) {
      acc[category.medicalId!] = [];
    }
    acc[category.medicalId!].push(category.title);
    return acc;
  }, {} as Record<number, string[]>);

  // Combine medical records with their categories
  const data = medicalRecords.map(record => ({
    ...record,
    titles: categoriesMap[record.id] || []
  }));

  SuccessResponse(res, { medicalRequests: data }, 200);
};

export const getRejectedMedicalRequests = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError("User not authenticated");
  }

  const userId = Number(req.user.id);

  const data = await db
    .select({
      id: Medicals.id,
      userId: Medicals.userId,
      fullName: Medicals.fullName,
      phoneNumber: Medicals.phoneNumber,
      title: categoryMedical.title,
      describtion: Medicals.describtion,
      price: Medicals.price,
      status: Medicals.status,
      reason: Medicals.rejectionReason,
    })
    .from(Medicals)
    .leftJoin(medicalCategories, eq(medicalCategories.medicalId, Medicals.id))
    .leftJoin(categoryMedical, eq(categoryMedical.id, medicalCategories.categoryId))
    .where(and(
      eq(Medicals.status, "rejected"),
      eq(Medicals.userId, userId)
    ));

  SuccessResponse(res, { medicalRequests: data }, 200);
}


/*export const applyPromoCode = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError("User not authenticated");
  }

  const userId = Number(req.user.id);
  const { tourId, code } = req.body;

  const data = await db
     .select({
      id: tourPromoCode.id,
      tourId: tourPromoCode.tourId,
      code: promoCode.code,
     })
     .from(tourPromoCode)
     .leftJoin(promoCode, eq(promoCode.id, tourPromoCode.promoCodeId))
     .where(and(
      eq(tourPromoCode.tourId, tourId),
      eq(promoCode.code, code)
     ));

     // check if code exist with tourid
     if (data.length === 0) {
      throw new NotFound("Promo Code Not Found");
    }

    // check usage limit

    // update usage limit
    

  SuccessResponse(res, { tourPromoCode: data }, 200);
}*/


export const applyPromoCode = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError("User not authenticated");
  }

  const userId = Number(req.user.id);
  const { tourId, code } = req.body;

  // Start a transaction to ensure data consistency
  await db.transaction(async (tx) => {
    // Get promo code details
    const promoCodeData = await tx
      .select({
        id: promoCode.id,
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        usageLimit: promoCode.usageLimit,
        status: promoCode.status,
        startDate: promoCode.startDate,
        endDate: promoCode.endDate,
        tourPromoCodeId: tourPromoCode.id
      })
      .from(tourPromoCode)
      .leftJoin(promoCode, eq(promoCode.id, tourPromoCode.promoCodeId))
      .where(and(
        eq(tourPromoCode.tourId, tourId),
        eq(promoCode.code, code)
      ));

    // Check if promo code exists for this tour
    if (promoCodeData.length === 0) {
      throw new NotFound("Promo Code Not Found for this tour");
    }

    const promo = promoCodeData[0];

    // Check if promo code is active
    if (!promo.status) {
      throw new ValidationError("Promo code is not active");
    }

    // Check validity dates - add null checks  
    if (!promo.startDate || !promo.endDate) {
      throw new ValidationError("Promo code dates are invalid");
    }

   const currentDate = new Date();
    const currentDateUTC = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);
    
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);
    
    // Set time to start/end of day for fair comparison
    const currentDateOnly = new Date(currentDateUTC.getFullYear(), currentDateUTC.getMonth(), currentDateUTC.getDate());
    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999);

    console.log('Current date (UTC):', currentDateOnly);
    console.log('Start date:', startDateOnly);
    console.log('End date:', endDateOnly);

    if (currentDateOnly < startDateOnly) {
      throw new ValidationError("Promo code is not yet valid");
    }

    if (currentDateOnly > endDateOnly) {
      throw new ValidationError("Promo code has expired");
    }

    // Check usage limit - add null check
    if (promo.usageLimit === null || promo.usageLimit === undefined) {
      throw new ValidationError("Promo code usage limit is invalid");
    }

    if (promo.usageLimit <= 0) {
      throw new ValidationError("Promo code usage limit exceeded");
    }

    SuccessResponse(res, { 
      success: true,
      promoCodeData: {
        id: promo.id,
        promoCode: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        status: promo.status, 
        usageLimit: promo.usageLimit,
      }
    }, 200);
  });
};


/* 
const categorizeBookings = (bookings) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const upcoming = [];
    const current = [];
    const history = [];

    bookings.forEach((booking) => {
      // console.log(Booking ID: ${booking.id});
      // console.log(Start Date: ${booking.originalStartDate});
      // console.log(End Date: ${booking.originalEndDate});
      
      if (!booking.originalStartDate || !booking.originalEndDate) {
        console.log("No dates - moving to history");
        history.push(booking);
        return;
      }

      const startDate = new Date(booking.originalStartDate);
      const endDate = new Date(booking.originalEndDate);
      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

      // console.log(Today: ${today.toDateString()});
      // console.log(Start Date Only: ${startDateOnly.toDateString()});
      // console.log(End Date Only: ${endDateOnly.toDateString()});

      if (startDateOnly > today) {
        console.log("Moving to upcoming");
        upcoming.push(booking);
      } else if (startDateOnly <= today && endDateOnly >= today) {
        console.log("Moving to current");
        current.push(booking);
      } else {
        console.log("Moving to history");
        history.push(booking);
      }
      console.log("---");
    });

    console.log(Final counts - Upcoming: ${upcoming.length}, Current: ${current.length}, History: ${history.length});
    return { upcoming, current, history };
  };
*/