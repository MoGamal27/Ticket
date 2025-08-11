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
exports.getBookingWithDetails = exports.createBookingWithPayment = exports.getActivePaymentMethods = exports.getTourById = exports.getToursByCategory = exports.getFeaturedTours = exports.getImages = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const Errors_1 = require("../../Errors");
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
        country: schema_1.countries.id,
        city: schema_1.cites.id,
        maxUsers: schema_1.tours.maxUsers,
        category: schema_1.categories.id,
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
    (0, response_1.SuccessResponse)(res, Object.assign(Object.assign({}, mainTour), { highlights: highlights.map((h) => h.content), includes: includes.map((i) => i.content), excludes: excludes.map((e) => e.content), itinerary: itinerary.map((i) => ({
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
    const { tourId, 
    // User information
    fullName, email, phone, notes, 
    // Passenger counts
    adultsCount, childrenCount, infantsCount, 
    //
    totalAmount, 
    // Payment method as ID
    paymentMethodId, proofImage, 
    // Extras array
    extras } = req.body;
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
        // Start transaction
        yield db_1.db.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            // Create main booking record
            const [newBooking] = yield trx.insert(schema_1.bookings).values({
                tourId: tourIdNum,
                userId,
                status: "pending",
            }).$returningId();
            // Create booking details - only store total amount
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
            if (proofImage && paymentMethodId) {
                yield trx.insert(schema_1.manualPaymentMethod).values({
                    paymentId: payment.id,
                    proofImage: proofImage,
                    manualPaymentTypeId: paymentMethodId, // Fawry, Visa, Vodafone Cash, InstaPay
                    prooftext: null,
                    uploadedAt: new Date()
                });
            }
            // Return success response
            (0, response_1.SuccessResponse)(res, {
                booking: {
                    id: newBooking.id,
                    tourId: tourIdNum,
                    userId,
                    status: "pending"
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
        }));
    }
    catch (error) {
        console.error("Booking creation error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create booking",
            error: error.message
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
