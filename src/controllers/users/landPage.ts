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
} from "../../models/schema";
import { eq } from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";
import { NotFound } from "../../Errors";

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
      category: categories.id,
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
    // User information
    fullName,
    email,
    phone,
    notes,
    // Passenger counts
    adultsCount,
    childrenCount,
    infantsCount,
    //
    totalAmount,
    // Payment method as ID
    paymentMethodId,
    proofImage,
    // Extras array
    extras,
    discount,
    location,
    address
  } = req.body;

  // Parse tourId to ensure it's a number
  const tourIdNum = parseInt(tourId, 10);
  if (isNaN(tourIdNum)) {
    return res.status(400).json({
      success: false,
      message: "Invalid tourId provided"
    });
  }

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


    // Start transaction
    await db.transaction(async (trx) => {
      // Create main booking record
      const [newBooking] = await trx.insert(bookings).values({
        tourId: tourIdNum,
        userId,
        status: "pending",
        discountNumber: discount || 0,
        location: location || null,
        address: address || null, 
      }).$returningId();

      // Create booking details - only store total amount
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
      if (proofImage && paymentMethodId) {
        await trx.insert(manualPaymentMethod).values({
          paymentId: payment.id,
          proofImage: proofImage,
          manualPaymentTypeId: paymentMethodId, // Fawry, Visa, Vodafone Cash, InstaPay
          prooftext: null, 
          uploadedAt: new Date()
        });
      }

      // Return success response
      SuccessResponse(res, { 
        booking: {
          id: newBooking.id,
          tourId: tourIdNum,
          userId,
          status: "pending",
          discountNumber: discount || 0,
          location: location || null,
          address: address || null,
        },
        payment: {
          id: payment.id,
          bookingId: newBooking.id,
          method: "manual",
          status: "pending",
          amount: totalAmount
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
      message: "Failed to create booking"
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
