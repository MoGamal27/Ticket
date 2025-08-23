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
exports.updateTour = exports.deleteTour = exports.addData = exports.createTour = exports.getTourById = exports.getAllTours = exports.formatDate = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const generateSchedules_1 = require("../../utils/generateSchedules");
const handleImages_1 = require("../../utils/handleImages");
const uuid_1 = require("uuid");
const deleteImage_1 = require("../../utils/deleteImage");
const date_fns_1 = require("date-fns");
const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};
exports.formatDate = formatDate;
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const toursData = yield db_1.db
        .select({
        tours: schema_1.tours,
        startDate: schema_1.tours.startDate,
        endDate: schema_1.tours.endDate,
        countryName: schema_1.countries.name,
        cityName: schema_1.cites.name,
    })
        .from(schema_1.tours)
        .leftJoin(schema_1.countries, (0, drizzle_orm_1.eq)(schema_1.tours.country, schema_1.countries.id))
        .leftJoin(schema_1.cites, (0, drizzle_orm_1.eq)(schema_1.tours.city, schema_1.cites.id));
    (0, response_1.SuccessResponse)(res, {
        tours: toursData.map(tour => (Object.assign(Object.assign({}, tour.tours), { startDate: (0, exports.formatDate)(tour.tours.startDate), endDate: (0, exports.formatDate)(tour.tours.endDate) }))),
    }, 200);
});
exports.getAllTours = getAllTours;
const getTourById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tourId = Number(req.params.id);
    const [mainTour] = yield db_1.db
        .select({
        id: schema_1.tours.id,
        title: schema_1.tours.title,
        mainImage: schema_1.tours.mainImage,
        description: schema_1.tours.describtion,
        featured: schema_1.tours.featured,
        meetingPoint: schema_1.tours.meetingPoint,
        meetingPointLocation: schema_1.tours.meetingPointLocation,
        meetingPointAddress: schema_1.tours.meetingPointAddress,
        points: schema_1.tours.points,
        status: schema_1.tours.status,
        startDate: schema_1.tours.startDate,
        endDate: schema_1.tours.endDate,
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
    const [highlights, includes, excludes, itinerary, faq, discounts, daysOfWeek, extrasWithPrices, images, promoCodes] = yield Promise.all([
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
        db_1.db
            .select({
            id: schema_1.extras.id,
            name: schema_1.extras.name,
            price: {
                adult: schema_1.tourPrice.adult,
                child: schema_1.tourPrice.child,
                infant: schema_1.tourPrice.infant,
                currency: schema_1.tourPrice.currencyId,
                currencyName: schema_1.currencies.name,
            },
        })
            .from(schema_1.tourExtras)
            .leftJoin(schema_1.extras, (0, drizzle_orm_1.eq)(schema_1.tourExtras.extraId, schema_1.extras.id))
            .leftJoin(schema_1.tourPrice, (0, drizzle_orm_1.eq)(schema_1.tourExtras.priceId, schema_1.tourPrice.id))
            .leftJoin(schema_1.currencies, (0, drizzle_orm_1.eq)(schema_1.tourPrice.currencyId, schema_1.currencies.id))
            .where((0, drizzle_orm_1.eq)(schema_1.tourExtras.tourId, tourId)),
        db_1.db
            .select({
            id: schema_1.tourImages.id,
            imagePath: schema_1.tourImages.imagePath
        })
            .from(schema_1.tourImages)
            .where((0, drizzle_orm_1.eq)(schema_1.tourImages.tourId, tourId)),
        db_1.db
            .select({
            id: schema_1.promoCode.id,
            code: schema_1.promoCode.code
        })
            .from(schema_1.tourPromoCode)
            .leftJoin(schema_1.promoCode, (0, drizzle_orm_1.eq)(schema_1.tourPromoCode.promoCodeId, schema_1.promoCode.id))
            .where((0, drizzle_orm_1.eq)(schema_1.tourPromoCode.tourId, tourId)),
    ]);
    (0, response_1.SuccessResponse)(res, Object.assign(Object.assign({}, mainTour), { startDate: mainTour.startDate.toISOString().split('T')[0], endDate: mainTour.endDate.toISOString().split('T')[0], highlights: highlights.map((h) => h.content), includes: includes.map((i) => i.content), excludes: excludes.map((e) => e.content), itinerary: itinerary.map((i) => ({
            id: i.id,
            title: i.title,
            imagePath: i.imagePath,
            description: i.describtion,
        })), faq: faq.map((f) => ({ question: f.question, answer: f.answer })), promoCode: promoCodes.map((p) => ({
            id: p.id,
            code: p.code
        })), // Use the query result variable
        discounts, daysOfWeek: daysOfWeek.map((d) => d.dayOfWeek), extras: extrasWithPrices, images: images.map((img) => ({
            id: img.id,
            url: img.imagePath
        })) }), 200);
});
exports.getTourById = getTourById;
const createTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    // Start transaction - ALL operations must be inside this transaction
    yield db_1.db.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        console.log("before add");
        // Insert main tour using transaction
        const [newTour] = yield tx
            .insert(schema_1.tours)
            .values({
            title: data.title,
            mainImage: yield (0, handleImages_1.saveBase64Image)(data.mainImage, (0, uuid_1.v4)(), req, "tours"),
            categoryId: data.categoryId,
            describtion: data.description,
            status: true,
            featured: (_a = data.featured) !== null && _a !== void 0 ? _a : false,
            meetingPoint: (_b = data.meetingPoint) !== null && _b !== void 0 ? _b : false,
            meetingPointLocation: data.meetingPoint
                ? data.meetingPointLocation
                : null,
            meetingPointAddress: data.meetingPoint ? data.meetingPointAddress : null,
            points: (_c = data.points) !== null && _c !== void 0 ? _c : 0,
            startDate: data.startDate,
            endDate: data.endDate,
            durationDays: data.durationDays,
            durationHours: data.durationHours,
            country: data.country,
            city: data.city,
            maxUsers: data.maxUsers,
        })
            .$returningId();
        console.log("tour added success");
        const tourId = newTour.id;
        // Insert related content if provided (ALL using tx instead of db)
        if (data.prices && data.prices.length > 0) {
            yield tx.insert(schema_1.tourPrice).values(data.prices.map((price) => ({
                adult: price.adult,
                child: price.child,
                infant: price.infant,
                currencyId: price.currencyId,
                tourId,
            })));
        }
        if (data.discounts && data.discounts.length > 0) {
            yield tx.insert(schema_1.tourDiscounts).values(data.discounts.map((discount) => {
                var _a;
                return ({
                    tourId,
                    targetGroup: discount.targetGroup,
                    type: discount.type,
                    value: discount.value,
                    minPeople: (_a = discount.minPeople) !== null && _a !== void 0 ? _a : 0,
                    maxPeople: discount.maxPeople,
                    kindBy: discount.kindBy,
                });
            }));
        }
        if (data.images && data.images.length > 0) {
            const imageRecords = yield Promise.all(data.images.map((imagePath) => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    tourId,
                    imagePath: yield (0, handleImages_1.saveBase64Image)(imagePath, (0, uuid_1.v4)(), req, "tourImages"),
                });
            })));
            yield tx.insert(schema_1.tourImages).values(imageRecords);
        }
        if ((_d = data.highlights) === null || _d === void 0 ? void 0 : _d.length) {
            yield tx
                .insert(schema_1.tourHighlight)
                .values(data.highlights.map((content) => ({ content, tourId })));
        }
        if ((_e = data.includes) === null || _e === void 0 ? void 0 : _e.length) {
            yield tx
                .insert(schema_1.tourIncludes)
                .values(data.includes.map((content) => ({ content, tourId })));
        }
        if ((_f = data.excludes) === null || _f === void 0 ? void 0 : _f.length) {
            yield tx
                .insert(schema_1.tourExcludes)
                .values(data.excludes.map((content) => ({ content, tourId })));
        }
        if ((_g = data.itinerary) === null || _g === void 0 ? void 0 : _g.length) {
            const itineraryItems = yield Promise.all(data.itinerary.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    title: item.title,
                    imagePath: yield (0, handleImages_1.saveBase64Image)(item.imagePath, (0, uuid_1.v4)(), req, "itineraryImages"),
                    describtion: item.description,
                    tourId,
                });
            })));
            yield tx.insert(schema_1.tourItinerary).values(itineraryItems);
        }
        if ((_h = data.faq) === null || _h === void 0 ? void 0 : _h.length) {
            yield tx.insert(schema_1.tourFAQ).values(data.faq.map((item) => ({
                question: item.question,
                answer: item.answer,
                tourId,
            })));
        }
        if ((_j = data.daysOfWeek) === null || _j === void 0 ? void 0 : _j.length) {
            yield tx
                .insert(schema_1.tourDaysOfWeek)
                .values(data.daysOfWeek.map((day) => ({ dayOfWeek: day, tourId })));
        }
        if ((_k = data.extras) === null || _k === void 0 ? void 0 : _k.length) {
            for (const extra of data.extras) {
                const [extraPrice] = yield tx
                    .insert(schema_1.tourPrice)
                    .values({
                    adult: extra.price.adult,
                    child: extra.price.child,
                    infant: extra.price.infant,
                    currencyId: extra.price.currencyId,
                    tourId,
                })
                    .$returningId();
                yield tx.insert(schema_1.tourExtras).values({
                    tourId,
                    extraId: extra.extraId,
                    priceId: extraPrice.id,
                });
            }
        }
        if (data.promoCodeIds && data.promoCodeIds.length > 0) {
            // Validate that the promo codes exist using transaction
            const existingPromoCodes = yield tx
                .select({
                id: schema_1.promoCode.id
            })
                .from(schema_1.promoCode)
                .where((0, drizzle_orm_1.inArray)(schema_1.promoCode.id, data.promoCodeIds));
            const existingPromoCodeIds = existingPromoCodes.map(pc => pc.id);
            const invalidPromoCodeIds = data.promoCodeIds.filter((id) => !existingPromoCodeIds.includes(id));
            // Handle invalid promo codes
            if (invalidPromoCodeIds.length > 0) {
                throw new Error(`Invalid promo code IDs: ${invalidPromoCodeIds.join(', ')}`);
            }
            // Insert new associations using transaction
            yield tx.insert(schema_1.tourPromoCode).values(data.promoCodeIds.map((promoCodeId) => ({
                tourId,
                promoCodeId
            })));
        }
        // Generate schedules using transaction
        yield (0, generateSchedules_1.generateTourSchedulesInTransaction)(tx, {
            tourId,
            startDate: data.startDate,
            endDate: data.endDate,
            daysOfWeek: data.daysOfWeek,
            maxUsers: data.maxUsers,
            durationDays: data.durationDays,
            durationHours: data.durationHours,
        });
        // If we reach here, all operations succeeded
        console.log('All tour creation operations completed successfully');
    }));
    (0, response_1.SuccessResponse)(res, { message: "Tour Created Successfully" }, 201);
});
exports.createTour = createTour;
const addData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield db_1.db.select().from(schema_1.categories);
    const currency = yield db_1.db.select().from(schema_1.currencies);
    const extra = yield db_1.db.select().from(schema_1.extras);
    const city = yield db_1.db.select().from(schema_1.cites);
    const country = yield db_1.db.select().from(schema_1.countries);
    const PromoCode = yield db_1.db.select().from(schema_1.promoCode);
    (0, response_1.SuccessResponse)(res, {
        categories: category,
        currencies: currency,
        extras: extra,
        countries: country,
        cities: city,
        PromoCode: PromoCode
    }, 200);
});
exports.addData = addData;
const deleteTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    // Check if tour exists
    const [tour] = yield db_1.db.select().from(schema_1.tours).where((0, drizzle_orm_1.eq)(schema_1.tours.id, id));
    if (!tour)
        throw new Errors_1.NotFound("Tour Not Found");
    try {
        // Check for existing bookings through tour schedules
        const existingSchedules = yield db_1.db
            .select({ id: schema_1.tourSchedules.id })
            .from(schema_1.tourSchedules)
            .where((0, drizzle_orm_1.eq)(schema_1.tourSchedules.tourId, id));
        if (existingSchedules.length > 0) {
            const scheduleIds = existingSchedules.map(s => s.id);
            // Check for confirmed bookings
            const confirmedBookings = yield db_1.db
                .select()
                .from(schema_1.bookings)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(schema_1.bookings.tourId, scheduleIds), (0, drizzle_orm_1.eq)(schema_1.bookings.status, 'confirmed')));
            if (confirmedBookings.length > 0) {
                throw new Error("Cannot delete tour with confirmed bookings");
            }
            // Delete all bookings and related data for this tour
            for (const booking of yield db_1.db.select().from(schema_1.bookings).where((0, drizzle_orm_1.inArray)(schema_1.bookings.tourId, scheduleIds))) {
                yield db_1.db.delete(schema_1.bookingDetails).where((0, drizzle_orm_1.eq)(schema_1.bookingDetails.bookingId, booking.id));
                yield db_1.db.delete(schema_1.bookingExtras).where((0, drizzle_orm_1.eq)(schema_1.bookingExtras.bookingId, booking.id));
                yield db_1.db.delete(schema_1.payments).where((0, drizzle_orm_1.eq)(schema_1.payments.bookingId, booking.id));
                yield db_1.db.delete(schema_1.manualPaymentMethod).where((0, drizzle_orm_1.eq)(schema_1.manualPaymentMethod.paymentId, booking.id));
            }
            yield db_1.db.delete(schema_1.bookings).where((0, drizzle_orm_1.inArray)(schema_1.bookings.tourId, scheduleIds));
        }
        // Delete main tour image from server
        yield (0, deleteImage_1.deletePhotoFromServer)(new URL(tour.mainImage).pathname);
        // Get and delete tour images
        const tourImagesList = yield db_1.db
            .select()
            .from(schema_1.tourImages)
            .where((0, drizzle_orm_1.eq)(schema_1.tourImages.tourId, id));
        // Delete tour images from server
        yield Promise.all(tourImagesList.map((tourImage) => __awaiter(void 0, void 0, void 0, function* () {
            if (tourImage.imagePath) {
                yield (0, deleteImage_1.deletePhotoFromServer)(new URL(tourImage.imagePath).pathname);
            }
        })));
        // Get and delete tour itinerary images
        const tourItineraryList = yield db_1.db
            .select()
            .from(schema_1.tourItinerary)
            .where((0, drizzle_orm_1.eq)(schema_1.tourItinerary.tourId, id));
        // Delete tour itinerary images from server
        yield Promise.all(tourItineraryList.map((itinerary) => __awaiter(void 0, void 0, void 0, function* () {
            if (itinerary.imagePath) {
                yield (0, deleteImage_1.deletePhotoFromServer)(new URL(itinerary.imagePath).pathname);
            }
        })));
        // Delete all related records first (to avoid foreign key constraint errors)
        // Note: Some tables have cascade delete, but we'll delete explicitly for consistency
        yield db_1.db.delete(schema_1.tourImages).where((0, drizzle_orm_1.eq)(schema_1.tourImages.tourId, id));
        yield db_1.db.delete(schema_1.tourItinerary).where((0, drizzle_orm_1.eq)(schema_1.tourItinerary.tourId, id));
        yield db_1.db.delete(schema_1.tourPrice).where((0, drizzle_orm_1.eq)(schema_1.tourPrice.tourId, id));
        yield db_1.db.delete(schema_1.tourHighlight).where((0, drizzle_orm_1.eq)(schema_1.tourHighlight.tourId, id));
        yield db_1.db.delete(schema_1.tourIncludes).where((0, drizzle_orm_1.eq)(schema_1.tourIncludes.tourId, id));
        yield db_1.db.delete(schema_1.tourExcludes).where((0, drizzle_orm_1.eq)(schema_1.tourExcludes.tourId, id));
        yield db_1.db.delete(schema_1.tourFAQ).where((0, drizzle_orm_1.eq)(schema_1.tourFAQ.tourId, id));
        yield db_1.db.delete(schema_1.tourPromoCode).where((0, drizzle_orm_1.eq)(schema_1.tourPromoCode.tourId, id));
        yield db_1.db.delete(schema_1.tourExtras).where((0, drizzle_orm_1.eq)(schema_1.tourExtras.tourId, id));
        // These should cascade automatically but delete explicitly to be safe
        yield db_1.db.delete(schema_1.tourDiscounts).where((0, drizzle_orm_1.eq)(schema_1.tourDiscounts.tourId, id));
        yield db_1.db.delete(schema_1.tourDaysOfWeek).where((0, drizzle_orm_1.eq)(schema_1.tourDaysOfWeek.tourId, id));
        yield db_1.db.delete(schema_1.tourSchedules).where((0, drizzle_orm_1.eq)(schema_1.tourSchedules.tourId, id));
        // Finally delete the tour itself
        yield db_1.db.delete(schema_1.tours).where((0, drizzle_orm_1.eq)(schema_1.tours.id, id));
        (0, response_1.SuccessResponse)(res, { message: "Tour Deleted Successfully" }, 200);
    }
    catch (error) {
        console.error("Error deleting tour:", error);
        throw error; // Re-throw to be handled by your error middleware
    }
});
exports.deleteTour = deleteTour;
const updateTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tourId = Number(req.params.id);
    const data = req.body;
    // Start transaction - ALL operations must be inside this transaction
    yield db_1.db.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if tour exists
        const [existingTour] = yield tx.select().from(schema_1.tours).where((0, drizzle_orm_1.eq)(schema_1.tours.id, tourId));
        if (!existingTour)
            throw new Errors_1.NotFound("Tour not found");
        // Update main tour details
        const updateData = {};
        if (data.title)
            updateData.title = data.title;
        if (data.mainImage) {
            updateData.mainImage = yield (0, handleImages_1.saveBase64Image)(data.mainImage, (0, uuid_1.v4)(), req, "tours");
        }
        if (data.categoryId)
            updateData.categoryId = data.categoryId;
        if (data.description)
            updateData.describtion = data.description;
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.featured !== undefined)
            updateData.featured = data.featured;
        if (data.meetingPoint !== undefined)
            updateData.meetingPoint = data.meetingPoint;
        if (data.meetingPointLocation)
            updateData.meetingPointLocation = data.meetingPointLocation;
        if (data.meetingPointAddress)
            updateData.meetingPointAddress = data.meetingPointAddress;
        if (data.points !== undefined)
            updateData.points = data.points;
        if (data.startDate)
            updateData.startDate = new Date(data.startDate);
        if (data.endDate)
            updateData.endDate = new Date(data.endDate);
        if (data.durationDays)
            updateData.durationDays = data.durationDays;
        if (data.durationHours)
            updateData.durationHours = data.durationHours;
        if (data.country)
            updateData.country = data.country;
        if (data.city)
            updateData.city = data.city;
        if (data.maxUsers)
            updateData.maxUsers = data.maxUsers;
        // Update tour using transaction
        yield tx.update(schema_1.tours).set(updateData).where((0, drizzle_orm_1.eq)(schema_1.tours.id, tourId));
        // Update related content if provided (ALL using tx instead of db)
        if (data.prices !== undefined) {
            yield tx.delete(schema_1.tourPrice).where((0, drizzle_orm_1.eq)(schema_1.tourPrice.tourId, tourId));
            if (data.prices.length > 0) {
                yield tx.insert(schema_1.tourPrice).values(data.prices.map((price) => ({
                    adult: price.adult,
                    child: price.child,
                    infant: price.infant,
                    currencyId: price.currencyId,
                    tourId,
                })));
            }
        }
        if (data.discounts !== undefined) {
            yield tx.delete(schema_1.tourDiscounts).where((0, drizzle_orm_1.eq)(schema_1.tourDiscounts.tourId, tourId));
            if (data.discounts.length > 0) {
                yield tx.insert(schema_1.tourDiscounts).values(data.discounts.map((discount) => {
                    var _a;
                    return ({
                        tourId,
                        targetGroup: discount.targetGroup,
                        type: discount.type,
                        value: discount.value,
                        minPeople: (_a = discount.minPeople) !== null && _a !== void 0 ? _a : 0,
                        maxPeople: discount.maxPeople,
                        kindBy: discount.kindBy,
                    });
                }));
            }
        }
        // Handle images with transaction
        if (data.images !== undefined) {
            const { added = [], deleted = [] } = data.images;
            // Handle deleted images
            if (deleted.length > 0) {
                // Get the images to delete using transaction
                const imagesToDelete = yield tx
                    .select()
                    .from(schema_1.tourImages)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.tourImages.tourId, tourId), (0, drizzle_orm_1.inArray)(schema_1.tourImages.id, deleted)));
                // Delete physical files from server
                for (const img of imagesToDelete) {
                    yield (0, deleteImage_1.deletePhotoFromServer)(new URL(img.imagePath).pathname);
                }
                // Delete records from database using transaction
                yield tx.delete(schema_1.tourImages).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.tourImages.tourId, tourId), (0, drizzle_orm_1.inArray)(schema_1.tourImages.id, deleted)));
            }
            // Handle added images
            if (added.length > 0) {
                const imageRecords = yield Promise.all(added.map((imagePath) => __awaiter(void 0, void 0, void 0, function* () {
                    return ({
                        tourId,
                        imagePath: yield (0, handleImages_1.saveBase64Image)(imagePath, (0, uuid_1.v4)(), req, "tourImages"),
                    });
                })));
                yield tx.insert(schema_1.tourImages).values(imageRecords);
            }
        }
        if (data.highlights !== undefined) {
            yield tx.delete(schema_1.tourHighlight).where((0, drizzle_orm_1.eq)(schema_1.tourHighlight.tourId, tourId));
            if (data.highlights.length > 0) {
                yield tx
                    .insert(schema_1.tourHighlight)
                    .values(data.highlights.map((content) => ({ content, tourId })));
            }
        }
        if (data.includes !== undefined) {
            yield tx.delete(schema_1.tourIncludes).where((0, drizzle_orm_1.eq)(schema_1.tourIncludes.tourId, tourId));
            if (data.includes.length > 0) {
                yield tx
                    .insert(schema_1.tourIncludes)
                    .values(data.includes.map((content) => ({ content, tourId })));
            }
        }
        if (data.excludes !== undefined) {
            yield tx.delete(schema_1.tourExcludes).where((0, drizzle_orm_1.eq)(schema_1.tourExcludes.tourId, tourId));
            if (data.excludes.length > 0) {
                yield tx
                    .insert(schema_1.tourExcludes)
                    .values(data.excludes.map((content) => ({ content, tourId })));
            }
        }
        // Handle itinerary with transaction
        if (data.itinerary !== undefined) {
            const { added = [], deleted = [], updated = [] } = data.itinerary;
            // Handle deletions first
            if (deleted.length > 0) {
                // Get existing itinerary items to delete their images using transaction
                const itemsToDelete = yield tx
                    .select()
                    .from(schema_1.tourItinerary)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.tourItinerary.tourId, tourId), (0, drizzle_orm_1.inArray)(schema_1.tourItinerary.id, deleted)));
                // Delete physical image files
                for (const item of itemsToDelete) {
                    if (item.imagePath) {
                        try {
                            yield (0, deleteImage_1.deletePhotoFromServer)(new URL(item.imagePath).pathname);
                        }
                        catch (error) {
                            console.error(`Failed to delete image: ${item.imagePath}`, error);
                        }
                    }
                }
                // Delete from database using transaction
                yield tx.delete(schema_1.tourItinerary).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.tourItinerary.tourId, tourId), (0, drizzle_orm_1.inArray)(schema_1.tourItinerary.id, deleted)));
            }
            // Handle updates to existing items
            if (updated.length > 0) {
                yield Promise.all(updated.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    const updateData = {
                        title: item.title,
                        describtion: item.description
                    };
                    // Only update image if a new one is provided
                    if (item.imagePath) {
                        // Delete old image if it exists using transaction
                        const [existingItem] = yield tx.select()
                            .from(schema_1.tourItinerary)
                            .where((0, drizzle_orm_1.eq)(schema_1.tourItinerary.id, item.id));
                        if (existingItem === null || existingItem === void 0 ? void 0 : existingItem.imagePath) {
                            yield (0, deleteImage_1.deletePhotoFromServer)(new URL(existingItem.imagePath).pathname);
                        }
                        updateData.imagePath = yield (0, handleImages_1.saveBase64Image)(item.imagePath, (0, uuid_1.v4)(), req, "itineraryImages");
                    }
                    // Update using transaction
                    yield tx.update(schema_1.tourItinerary)
                        .set(updateData)
                        .where((0, drizzle_orm_1.eq)(schema_1.tourItinerary.id, item.id));
                })));
            }
            // Handle additions of new items
            if (added.length > 0) {
                const newItems = yield Promise.all(added.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    return ({
                        title: item.title,
                        describtion: item.description,
                        imagePath: item.imagePath ?
                            yield (0, handleImages_1.saveBase64Image)(item.imagePath, (0, uuid_1.v4)(), req, "itineraryImages") :
                            null,
                        tourId,
                    });
                })));
                yield tx.insert(schema_1.tourItinerary).values(newItems);
            }
        }
        // Handle promo codes with transaction
        if (data.promoCodeIds && data.promoCodeIds.length > 0) {
            // Validate that the promo codes exist using transaction
            const existingPromoCodes = yield tx
                .select({
                id: schema_1.promoCode.id
            })
                .from(schema_1.promoCode)
                .where((0, drizzle_orm_1.inArray)(schema_1.promoCode.id, data.promoCodeIds));
            const existingPromoCodeIds = existingPromoCodes.map(pc => pc.id);
            const invalidPromoCodeIds = data.promoCodeIds.filter((id) => !existingPromoCodeIds.includes(id));
            // Handle invalid promo codes
            if (invalidPromoCodeIds.length > 0) {
                throw new Error(`Invalid promo code IDs: ${invalidPromoCodeIds.join(', ')}`);
            }
            // Check which promo codes are already associated with this tour using transaction
            const existingAssociations = yield tx
                .select({ promoCodeId: schema_1.tourPromoCode.promoCodeId })
                .from(schema_1.tourPromoCode)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.tourPromoCode.tourId, tourId), (0, drizzle_orm_1.inArray)(schema_1.tourPromoCode.promoCodeId, data.promoCodeIds)));
            const alreadyAssociatedIds = existingAssociations.map(a => a.promoCodeId);
            const newAssociations = data.promoCodeIds.filter((id) => !alreadyAssociatedIds.includes(id));
            // Insert new associations only using transaction
            if (newAssociations.length > 0) {
                yield tx.insert(schema_1.tourPromoCode).values(newAssociations.map((promoCodeId) => ({
                    tourId,
                    promoCodeId
                })));
            }
        }
        if (data.faq !== undefined) {
            yield tx.delete(schema_1.tourFAQ).where((0, drizzle_orm_1.eq)(schema_1.tourFAQ.tourId, tourId));
            if (data.faq.length > 0) {
                yield tx.insert(schema_1.tourFAQ).values(data.faq.map((item) => ({
                    question: item.question,
                    answer: item.answer,
                    tourId,
                })));
            }
        }
        if (data.daysOfWeek !== undefined) {
            // Delete existing days
            yield tx.delete(schema_1.tourDaysOfWeek).where((0, drizzle_orm_1.eq)(schema_1.tourDaysOfWeek.tourId, tourId));
            // Insert new days if provided
            if (data.daysOfWeek.length > 0) {
                // Convert to lowercase to match enum values
                const formattedDays = data.daysOfWeek.map((day) => day.toLowerCase().trim());
                yield tx.insert(schema_1.tourDaysOfWeek).values(formattedDays.map((day) => ({
                    dayOfWeek: day,
                    tourId
                })));
            }
        }
        if (data.extras !== undefined) {
            yield tx.delete(schema_1.tourExtras).where((0, drizzle_orm_1.eq)(schema_1.tourExtras.tourId, tourId));
            if (data.extras.length > 0) {
                for (const extra of data.extras) {
                    // Use transaction for tour price insertion
                    const [extraPrice] = yield tx
                        .insert(schema_1.tourPrice)
                        .values({
                        adult: extra.price.adult,
                        child: extra.price.child,
                        infant: extra.price.infant,
                        currencyId: extra.price.currencyId,
                        tourId,
                    })
                        .$returningId();
                    // Use transaction for tour extras insertion
                    yield tx.insert(schema_1.tourExtras).values({
                        tourId,
                        extraId: extra.extraId,
                        priceId: extraPrice.id,
                    });
                }
            }
        }
        // Generate schedules if needed using transaction
        // In your updateTour function, before calling generateTourSchedules:
        if (data.startDate || data.endDate || data.daysOfWeek) {
            yield tx.delete(schema_1.tourSchedules).where((0, drizzle_orm_1.eq)(schema_1.tourSchedules.tourId, tourId));
            // Convert dates to proper SQL format
            const formatDateForSQL = (date) => {
                const d = new Date(date);
                return (0, date_fns_1.format)(d, 'yyyy-MM-dd HH:mm:ss'); // Use date-fns format
            };
            const startDateFormatted = data.startDate
                ? formatDateForSQL(data.startDate)
                : formatDateForSQL(existingTour.startDate);
            const endDateFormatted = data.endDate
                ? formatDateForSQL(data.endDate)
                : formatDateForSQL(existingTour.endDate);
            // Call the modified generateTourSchedules function with tx parameter
            yield (0, generateSchedules_1.generateTourSchedulesInTransaction)(tx, {
                tourId,
                startDate: startDateFormatted,
                endDate: endDateFormatted,
                daysOfWeek: data.daysOfWeek || [],
                maxUsers: data.maxUsers || existingTour.maxUsers,
                durationDays: data.durationDays || existingTour.durationDays,
                durationHours: data.durationHours || existingTour.durationHours,
            });
        }
        // If we reach here, all operations succeeded
        console.log('All tour update operations completed successfully');
    }));
    // Only send response if transaction succeeded
    (0, response_1.SuccessResponse)(res, { message: "Tour Updated Successfully" }, 200);
});
exports.updateTour = updateTour;
