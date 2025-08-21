"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPromoCode = exports.getRejectedMedicalRequests = exports.getAcceptMedicalRequests = exports.getMedicalCategories = exports.createMedical = exports.getBookingWithDetails = exports.createBookingWithPayment = exports.getActivePaymentMethods = exports.getTourById = exports.getToursByCategory = exports.getFeaturedTours = exports.getImages = exports.formatDate = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const Errors_1 = require("../../Errors");
const handleImages_1 = require("../../utils/handleImages");
const uuid_1 = require("uuid");
// format start date to YYYY-MM-DD
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};
exports.formatDate = formatDate;
const getImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let img;
    const [cover] = yield db_1.db
        .select()
        .from(schema_1.homePageCover)
        .where((0, drizzle_orm_1.eq)(schema_1.homePageCover.status, true));
    if (!cover)
        img = {
            imagePath: "https://bcknd.tickethub-tours.com/uploads/homes/default.jpg",
        };
    else
        img = cover;
    const category = yield db_1.db.select().from(schema_1.categories);
    const faqs = yield db_1.db
        .select()
        .from(schema_1.homePageFAQ)
        .where((0, drizzle_orm_1.eq)(schema_1.homePageFAQ.status, true));
    (0, response_1.SuccessResponse)(res, { cover: img, categories: category, faqs }, 200);
});
exports.getImages = getImages;
const getFeaturedTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield db_1.db
        .select({
        id: schema_1.tours.id,
        title: schema_1.tours.title,
        country: schema_1.countries.name,
        city: schema_1.cites.name,
        imagePath: schema_1.tours.mainImage,
        price: schema_1.tourPrice.adult,
        discount: schema_1.tourDiscounts.value,
        discribtion: schema_1.tours.describtion,
        duration: schema_1.tours.durationDays,
    })
        .from(schema_1.tours)
        .where((0, drizzle_orm_1.eq)(schema_1.tours.featured, true))
        .leftJoin(schema_1.tourPrice, (0, drizzle_orm_1.eq)(schema_1.tours.id, schema_1.tourPrice.tourId))
        .leftJoin(schema_1.cites, (0, drizzle_orm_1.eq)(schema_1.cites.id, schema_1.tours.city))
        .leftJoin(schema_1.countries, (0, drizzle_orm_1.eq)(schema_1.countries.id, schema_1.tours.country))
        .leftJoin(schema_1.tourDiscounts, (0, drizzle_orm_1.eq)(schema_1.tourDiscounts.tourId, schema_1.tours.id))
        .groupBy(schema_1.tours.id);
    (0, response_1.SuccessResponse)(res, { tours: tour }, 200);
});
exports.getFeaturedTours = getFeaturedTours;
const getToursByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = req.params.category;
    const tour = yield db_1.db
        .select({
        id: schema_1.tours.id,
        title: schema_1.tours.title,
        country: schema_1.countries.name,
        city: schema_1.cites.name,
        imagePath: schema_1.tours.mainImage,
        price: schema_1.tourPrice.adult,
        discount: schema_1.tourDiscounts.value,
        discribtion: schema_1.tours.describtion,
        duration: schema_1.tours.durationDays,
    })
        .from(schema_1.tours)
        .leftJoin(schema_1.tourPrice, (0, drizzle_orm_1.eq)(schema_1.tours.id, schema_1.tourPrice.tourId))
        .leftJoin(schema_1.cites, (0, drizzle_orm_1.eq)(schema_1.cites.id, schema_1.tours.city))
        .leftJoin(schema_1.countries, (0, drizzle_orm_1.eq)(schema_1.countries.id, schema_1.tours.country))
        .leftJoin(schema_1.tourDiscounts, (0, drizzle_orm_1.eq)(schema_1.tourDiscounts.tourId, schema_1.tours.id))
        .leftJoin(schema_1.categories, (0, drizzle_orm_1.eq)(schema_1.categories.id, schema_1.tours.categoryId))
        .where((0, drizzle_orm_1.eq)(schema_1.categories.name, category.toLowerCase()));
    (0, response_1.SuccessResponse)(res, { tours: tour }, 200);
});
exports.getToursByCategory = getToursByCategory;
const getTourById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tourId = Number(req.params.id);
    const [mainTour] = yield db_1.db
        .select({
        id: schema_1.tours.id,
        title: schema_1.tours.title,
        mainImage: schema_1.tours.mainImage,
        description: schema_1.tours.describtion,
        featured: schema_1.tours.featured,
        status: schema_1.tours.status,
        startDate: schema_1.tours.startDate,
        endDate: schema_1.tours.endDate,
        meetingPoint: schema_1.tours.meetingPoint,
        meetingPointLocation: schema_1.tours.meetingPointLocation,
        meetingPointAddress: schema_1.tours.meetingPointAddress,
        points: schema_1.tours.points,
        durationDays: schema_1.tours.durationDays,
        durationHours: schema_1.tours.durationHours,
        country: schema_1.countries.name,
        city: schema_1.cites.name,
        maxUsers: schema_1.tours.maxUsers,
        category: schema_1.categories.name,
        tourScheduleId: schema_1.tourSchedules.id,
        price: {
            adult: schema_1.tourPrice.adult,
            child: schema_1.tourPrice.child,
            infant: schema_1.tourPrice.infant,
            currency: schema_1.currencies.id,
        },
    })
        .from(schema_1.tours)
        .leftJoin(schema_1.categories, (0, drizzle_orm_1.eq)(schema_1.tours.categoryId, schema_1.categories.id))
        .leftJoin(schema_1.tourPrice, (0, drizzle_orm_1.eq)(schema_1.tours.id, schema_1.tourPrice.tourId))
        .leftJoin(schema_1.currencies, (0, drizzle_orm_1.eq)(schema_1.tourPrice.currencyId, schema_1.currencies.id))
        .leftJoin(schema_1.cites, (0, drizzle_orm_1.eq)(schema_1.cites.id, schema_1.tours.city))
        .leftJoin(schema_1.countries, (0, drizzle_orm_1.eq)(schema_1.countries.id, schema_1.tours.country))
        .leftJoin(schema_1.tourSchedules, (0, drizzle_orm_1.eq)(schema_1.tourSchedules.tourId, schema_1.tours.id))
        .where((0, drizzle_orm_1.eq)(schema_1.tours.id, tourId));
    if (!mainTour)
        throw new Errors_1.NotFound("tour not found");
    const [highlights, includes, excludes, itinerary, faq, discounts, daysOfWeek, extrasWithPrices, images,] = yield Promise.all([
        db_1.db.select().from(schema_1.tourHighlight).where((0, drizzle_orm_1.eq)(schema_1.tourHighlight.tourId, tourId)),
        db_1.db.select().from(schema_1.tourIncludes).where((0, drizzle_orm_1.eq)(schema_1.tourIncludes.tourId, tourId)),
        db_1.db.select().from(schema_1.tourExcludes).where((0, drizzle_orm_1.eq)(schema_1.tourExcludes.tourId, tourId)),
        db_1.db.select().from(schema_1.tourItinerary).where((0, drizzle_orm_1.eq)(schema_1.tourItinerary.tourId, tourId)),
        db_1.db.select().from(schema_1.tourFAQ).where((0, drizzle_orm_1.eq)(schema_1.tourFAQ.tourId, tourId)),
        db_1.db.select().from(schema_1.tourDiscounts).where((0, drizzle_orm_1.eq)(schema_1.tourDiscounts.tourId, tourId)),
        db_1.db
            .select({ dayOfWeek: schema_1.tourDaysOfWeek.dayOfWeek })
            .from(schema_1.tourDaysOfWeek)
            .where((0, drizzle_orm_1.eq)(schema_1.tourDaysOfWeek.tourId, tourId)),
        db_1.db.select({
            id: schema_1.extras.id,
            name: schema_1.extras.name,
            price: {
                adult: schema_1.tourPrice.adult,
                child: schema_1.tourPrice.child,
                infant: schema_1.tourPrice.infant,
                currencyId: schema_1.tourPrice.currencyId,
                // currency name
                currencyName: schema_1.currencies.name,
            },
        })
            .from(schema_1.tourExtras)
            .leftJoin(schema_1.extras, (0, drizzle_orm_1.eq)(schema_1.tourExtras.extraId, schema_1.extras.id))
            .leftJoin(schema_1.tourPrice, (0, drizzle_orm_1.eq)(schema_1.tourExtras.priceId, schema_1.tourPrice.id))
            .leftJoin(schema_1.currencies, (0, drizzle_orm_1.eq)(schema_1.tourPrice.currencyId, schema_1.currencies.id))
            .where((0, drizzle_orm_1.eq)(schema_1.tourExtras.tourId, tourId)),
        db_1.db
            .select({ imagePath: schema_1.tourImages.imagePath })
            .from(schema_1.tourImages)
            .where((0, drizzle_orm_1.eq)(schema_1.tourImages.tourId, tourId)),
    ]);
    (0, response_1.SuccessResponse)(res, Object.assign(Object.assign({}, mainTour), { startDate: mainTour.startDate.toISOString().split('T')[0], endDate: mainTour.endDate.toISOString().split('T')[0], highlights: highlights.map((h) => h.content), includes: includes.map((i) => i.content), excludes: excludes.map((e) => e.content), itinerary: itinerary.map((i) => ({
            title: i.title,
            imagePath: i.imagePath,
            description: i.describtion,
        })), faq: faq.map((f) => ({ question: f.question, answer: f.answer })), discounts, daysOfWeek: daysOfWeek.map((d) => d.dayOfWeek), extras: extrasWithPrices, images: images.map((img) => img.imagePath) }), 200);
});
exports.getTourById = getTourById;
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
const getActivePaymentMethods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const methods = yield db_1.db
        .select()
        .from(schema_1.manualPaymentTypes)
        .where((0, drizzle_orm_1.eq)(schema_1.manualPaymentTypes.status, true));
    (0, response_1.SuccessResponse)(res, { methods }, 200);
});
exports.getActivePaymentMethods = getActivePaymentMethods;
const createBookingWithPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tourId, fullName, email, phone, notes, adultsCount, childrenCount, infantsCount, totalAmount, paymentMethodId, proofImage, extras, discount, location, address, promoCodeId } = req.body;
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
    let promoCodeIdNum = null;
    if (promoCodeId !== undefined && promoCodeId !== null && promoCodeId !== '') {
        promoCodeIdNum = parseInt(promoCodeId, 10);
        if (isNaN(promoCodeIdNum)) {
            return res.status(400).json({
                success: false,
                message: "Invalid promoCodeId provided"
            });
        }
    }
    const tourSchedule = yield db_1.db
        .select({
        id: schema_1.tourSchedules.id,
        tourId: schema_1.tourSchedules.tourId
    })
        .from(schema_1.tourSchedules)
        .where((0, drizzle_orm_1.eq)(schema_1.tourSchedules.id, tourIdNum))
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
        const existingUser = yield db_1.db
            .select({ id: schema_1.users.id })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
            .limit(1);
        if (!existingUser.length) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email"
            });
        }
        const userId = existingUser[0].id;
        const promoCodeData = yield db_1.db
            .select({
            id: schema_1.promoCode.id,
            code: schema_1.promoCode.code,
            usageLimit: schema_1.promoCode.usageLimit,
            status: schema_1.promoCode.status,
            startDate: schema_1.promoCode.startDate,
            endDate: schema_1.promoCode.endDate,
            tourPromoCodeId: schema_1.tourPromoCode.id,
            tourId: schema_1.tourPromoCode.tourId
        })
            .from(schema_1.tourPromoCode)
            .leftJoin(schema_1.promoCode, (0, drizzle_orm_1.eq)(schema_1.promoCode.id, schema_1.tourPromoCode.promoCodeId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.tourPromoCode.tourId, actualTourId), (0, drizzle_orm_1.eq)(schema_1.promoCode.id, promoCodeIdNum)));
        if (promoCodeData && promoCodeData.length > 0) {
            const promo = promoCodeData[0];
            // Check usage limit - add null check
            if (promo.usageLimit === null || promo.usageLimit === undefined) {
                throw new Error("Promo code usage limit is invalid");
            }
            // Check if usage limit is still available
            if (promo.usageLimit > 0) {
                yield db_1.db.update(schema_1.promoCode)
                    .set({ usageLimit: promo.usageLimit - 1 })
                    .where((0, drizzle_orm_1.eq)(schema_1.promoCode.id, promo.id));
            }
            else {
                console.warn("Promo code usage limit reached or exceeded");
            }
        }
        // Start transaction
        yield db_1.db.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            // Create main booking record
            const [newBooking] = yield trx.insert(schema_1.bookings).values({
                tourId: tourIdNum,
                userId,
                status: "pending",
                discountNumber: discount,
                location: location,
                address: address,
            }).$returningId();
            // Create booking details
            yield trx.insert(schema_1.bookingDetails).values({
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
                const extrasToInsert = extras.map((e) => ({
                    bookingId: newBooking.id,
                    extraId: e.id,
                    adultCount: parseInt(e.count.adult) || 0,
                    childCount: parseInt(e.count.child) || 0,
                    infantCount: parseInt(e.count.infant) || 0
                }));
                yield trx.insert(schema_1.bookingExtras).values(extrasToInsert);
            }
            // Create payment record
            const [payment] = yield trx.insert(schema_1.payments).values({
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
                    savedImageUrl = yield (0, handleImages_1.saveBase64Image)(proofImage, userId.toString(), req, "payment-proofs");
                    yield trx.insert(schema_1.manualPaymentMethod).values({
                        paymentId: payment.id,
                        proofImage: savedImageUrl,
                        manualPaymentTypeId: paymentMethodId,
                        prooftext: null,
                        uploadedAt: new Date()
                    });
                }
                catch (error) {
                    console.error("Failed to save proof image:", error);
                    throw new Error("Failed to save payment proof image");
                }
            }
            // Return success response
            (0, response_1.SuccessResponse)(res, {
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
        }));
    }
    catch (error) {
        console.error("Error creating booking:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create booking"
        });
    }
});
exports.createBookingWithPayment = createBookingWithPayment;
// function to get booking with details
const getBookingWithDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId } = req.params;
    try {
        const bookingData = yield db_1.db
            .select({
            // Booking info
            bookingId: schema_1.bookings.id,
            tourId: schema_1.bookings.tourId,
            userId: schema_1.bookings.userId,
            status: schema_1.bookings.status,
            createdAt: schema_1.bookings.createdAt,
            // User details
            fullName: schema_1.bookingDetails.fullName,
            email: schema_1.bookingDetails.email,
            phone: schema_1.bookingDetails.phone,
            notes: schema_1.bookingDetails.notes,
            adultsCount: schema_1.bookingDetails.adultsCount,
            childrenCount: schema_1.bookingDetails.childrenCount,
            infantsCount: schema_1.bookingDetails.infantsCount,
            totalAmount: schema_1.bookingDetails.totalAmount,
            // Payment
            paymentId: schema_1.payments.id,
            paymentMethod: schema_1.payments.method,
            paymentStatus: schema_1.payments.status,
            paymentAmount: schema_1.payments.amount,
            transactionId: schema_1.payments.transactionId,
            // Manual payment proof
            proofImage: schema_1.manualPaymentMethod.proofImage,
            proofText: schema_1.manualPaymentMethod.prooftext,
        })
            .from(schema_1.bookings)
            .leftJoin(schema_1.bookingDetails, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.bookingDetails.bookingId))
            .leftJoin(schema_1.payments, (0, drizzle_orm_1.eq)(schema_1.bookings.id, schema_1.payments.bookingId))
            .leftJoin(schema_1.manualPaymentMethod, (0, drizzle_orm_1.eq)(schema_1.payments.id, schema_1.manualPaymentMethod.paymentId))
            .where((0, drizzle_orm_1.eq)(schema_1.bookings.id, parseInt(bookingId)));
        if (!bookingData.length) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        (0, response_1.SuccessResponse)(res, bookingData[0]);
    }
    catch (error) {
        console.error("Get booking error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch booking",
            error: error.message
        });
    }
});
exports.getBookingWithDetails = getBookingWithDetails;
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
const createMedical = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const [user] = yield db_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, data.email));
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Validate all categories exist
        const categories = yield Promise.all(data.categoryIds.map((categoryId) => __awaiter(void 0, void 0, void 0, function* () {
            const [category] = yield db_1.db
                .select()
                .from(schema_1.categoryMedical)
                .where((0, drizzle_orm_1.eq)(schema_1.categoryMedical.id, categoryId));
            if (!category) {
                throw new Error(`Category with ID ${categoryId} not found`);
            }
            return category;
        })));
        // Create a single medical record with the new fields
        const [insertResult] = yield db_1.db.insert(schema_1.Medicals).values({
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
        yield db_1.db.insert(schema_1.medicalCategories).values(data.categoryIds.map(categoryId => ({
            medicalId: medicalId,
            categoryId: categoryId,
        })));
        // Handle images if provided
        if (data.images && data.images.length > 0) {
            const imageRecords = yield Promise.all(data.images.map((imagePath) => __awaiter(void 0, void 0, void 0, function* () {
                const path = yield (0, handleImages_1.saveBase64Image)(imagePath, (0, uuid_1.v4)(), req, "medicalImages");
                return {
                    medicalId: medicalId,
                    imagePath: path
                };
            })));
            yield db_1.db.insert(schema_1.MedicalImages).values(imageRecords);
        }
        // Get the created medical record with its categories
        const [medical] = yield db_1.db
            .select({
            id: schema_1.Medicals.id,
            userId: schema_1.Medicals.userId,
            fullName: schema_1.Medicals.fullName,
            phoneNumber: schema_1.Medicals.phoneNumber,
            describtion: schema_1.Medicals.describtion,
            status: schema_1.Medicals.status,
        })
            .from(schema_1.Medicals)
            .where((0, drizzle_orm_1.eq)(schema_1.Medicals.id, medicalId));
        // Get associated categories
        const associatedCategories = yield db_1.db
            .select({
            categoryId: schema_1.medicalCategories.categoryId,
        })
            .from(schema_1.medicalCategories)
            .where((0, drizzle_orm_1.eq)(schema_1.medicalCategories.medicalId, medicalId));
        (0, response_1.SuccessResponse)(res, {
            message: "Medical record created successfully",
            medical: Object.assign(Object.assign({}, medical), { categories: associatedCategories })
        }, 201);
    }
    catch (error) {
        if (error.message.startsWith('Category with ID')) {
            return res.status(404).json({ message: error.message });
        }
        console.error("Error creating medical record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createMedical = createMedical;
const getMedicalCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.db.select().from(schema_1.categoryMedical);
    (0, response_1.SuccessResponse)(res, { categoriesMedical: data }, 200);
});
exports.getMedicalCategories = getMedicalCategories;
const getAcceptMedicalRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new Errors_1.UnauthorizedError("User not authenticated");
    }
    const userId = Number(req.user.id);
    // Get medical records
    const medicalRecords = yield db_1.db
        .select({
        id: schema_1.Medicals.id,
        userId: schema_1.Medicals.userId,
        fullName: schema_1.Medicals.fullName,
        phoneNumber: schema_1.Medicals.phoneNumber,
        describtion: schema_1.Medicals.describtion,
        documentUrl: schema_1.Medicals.documentUrl,
        price: schema_1.Medicals.price,
        status: schema_1.Medicals.status,
    })
        .from(schema_1.Medicals)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.Medicals.status, "accepted"), (0, drizzle_orm_1.eq)(schema_1.Medicals.userId, userId)));
    // Get categories for all medical records in one query
    const medicalIds = medicalRecords.map(record => record.id);
    const categories = medicalIds.length > 0 ? yield db_1.db
        .select({
        medicalId: schema_1.medicalCategories.medicalId,
        title: schema_1.categoryMedical.title,
    })
        .from(schema_1.medicalCategories)
        .innerJoin(schema_1.categoryMedical, (0, drizzle_orm_1.eq)(schema_1.categoryMedical.id, schema_1.medicalCategories.categoryId))
        .where((0, drizzle_orm_1.inArray)(schema_1.medicalCategories.medicalId, medicalIds)) : [];
    // Group categories by medicalId
    const categoriesMap = categories.reduce((acc, category) => {
        if (!acc[category.medicalId]) {
            acc[category.medicalId] = [];
        }
        acc[category.medicalId].push(category.title);
        return acc;
    }, {});
    // Combine medical records with their categories
    const data = medicalRecords.map(record => (Object.assign(Object.assign({}, record), { titles: categoriesMap[record.id] || [] })));
    (0, response_1.SuccessResponse)(res, { medicalRequests: data }, 200);
});
exports.getAcceptMedicalRequests = getAcceptMedicalRequests;
const getRejectedMedicalRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new Errors_1.UnauthorizedError("User not authenticated");
    }
    const userId = Number(req.user.id);
    const data = yield db_1.db
        .select({
        id: schema_1.Medicals.id,
        userId: schema_1.Medicals.userId,
        fullName: schema_1.Medicals.fullName,
        phoneNumber: schema_1.Medicals.phoneNumber,
        title: schema_1.categoryMedical.title,
        describtion: schema_1.Medicals.describtion,
        price: schema_1.Medicals.price,
        status: schema_1.Medicals.status,
        reason: schema_1.Medicals.rejectionReason,
    })
        .from(schema_1.Medicals)
        .leftJoin(schema_1.medicalCategories, (0, drizzle_orm_1.eq)(schema_1.medicalCategories.medicalId, schema_1.Medicals.id))
        .leftJoin(schema_1.categoryMedical, (0, drizzle_orm_1.eq)(schema_1.categoryMedical.id, schema_1.medicalCategories.categoryId))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.Medicals.status, "rejected"), (0, drizzle_orm_1.eq)(schema_1.Medicals.userId, userId)));
    (0, response_1.SuccessResponse)(res, { medicalRequests: data }, 200);
});
exports.getRejectedMedicalRequests = getRejectedMedicalRequests;
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
const applyPromoCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        throw new Errors_1.UnauthorizedError("User not authenticated");
    }
    const userId = Number(req.user.id);
    const { tourId, code } = req.body;
    // Start a transaction to ensure data consistency
    yield db_1.db.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Get promo code details
        const promoCodeData = yield tx
            .select({
            id: schema_1.promoCode.id,
            code: schema_1.promoCode.code,
            discountType: schema_1.promoCode.discountType,
            discountValue: schema_1.promoCode.discountValue,
            usageLimit: schema_1.promoCode.usageLimit,
            status: schema_1.promoCode.status,
            startDate: schema_1.promoCode.startDate,
            endDate: schema_1.promoCode.endDate,
            tourPromoCodeId: schema_1.tourPromoCode.id
        })
            .from(schema_1.tourPromoCode)
            .leftJoin(schema_1.promoCode, (0, drizzle_orm_1.eq)(schema_1.promoCode.id, schema_1.tourPromoCode.promoCodeId))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.tourPromoCode.tourId, tourId), (0, drizzle_orm_1.eq)(schema_1.promoCode.code, code)));
        // Check if promo code exists for this tour
        if (promoCodeData.length === 0) {
            throw new Errors_1.NotFound("Promo Code Not Found for this tour");
        }
        const promo = promoCodeData[0];
        // Check if promo code is active
        if (!promo.status) {
            throw new Errors_1.ValidationError("Promo code is not active");
        }
        // Check validity dates - add null checks  
        if (!promo.startDate || !promo.endDate) {
            throw new Errors_1.ValidationError("Promo code dates are invalid");
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
            throw new Errors_1.ValidationError("Promo code is not yet valid");
        }
        if (currentDateOnly > endDateOnly) {
            throw new Errors_1.ValidationError("Promo code has expired");
        }
        // Check usage limit - add null check
        if (promo.usageLimit === null || promo.usageLimit === undefined) {
            throw new Errors_1.ValidationError("Promo code usage limit is invalid");
        }
        if (promo.usageLimit <= 0) {
            throw new Errors_1.ValidationError("Promo code usage limit exceeded");
        }
        (0, response_1.SuccessResponse)(res, {
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
    }));
});
exports.applyPromoCode = applyPromoCode;
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
