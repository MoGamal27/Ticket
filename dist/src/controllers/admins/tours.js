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
exports.updateTour = exports.deleteTour = exports.addData = exports.createTour = exports.getTourById = exports.getAllTours = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const generateSchedules_1 = require("../../utils/generateSchedules");
const handleImages_1 = require("../../utils/handleImages");
const uuid_1 = require("uuid");
const deleteImage_1 = require("../../utils/deleteImage");
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const toursData = yield db_1.db
        .select({
        tours: schema_1.tours,
        countryName: schema_1.countries.name, // Just the name from countries
        cityName: schema_1.cites.name, // Just the name from cities
    })
        .from(schema_1.tours)
        .leftJoin(schema_1.countries, (0, drizzle_orm_1.eq)(schema_1.tours.country, schema_1.countries.id))
        .leftJoin(schema_1.cites, (0, drizzle_orm_1.eq)(schema_1.tours.city, schema_1.cites.id));
    (0, response_1.SuccessResponse)(res, { tours: toursData }, 200);
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
        db_1.db
            .select({
            id: schema_1.extras.id,
            name: schema_1.extras.name,
            price: {
                adult: schema_1.tourPrice.adult,
                child: schema_1.tourPrice.child,
                infant: schema_1.tourPrice.infant,
                currency: schema_1.tourPrice.currencyId,
            },
        })
            .from(schema_1.tourExtras)
            .leftJoin(schema_1.extras, (0, drizzle_orm_1.eq)(schema_1.tourExtras.extraId, schema_1.extras.id))
            .leftJoin(schema_1.tourPrice, (0, drizzle_orm_1.eq)(schema_1.tourExtras.priceId, schema_1.tourPrice.id))
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
const createTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const data = req.body;
    console.log("before add");
    const [newTour] = yield db_1.db
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
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        durationDays: data.durationDays,
        durationHours: data.durationHours,
        country: data.country,
        city: data.city,
        maxUsers: data.maxUsers,
        //highlight: data.highlights,
    })
        .$returningId();
    console.log("tour added success");
    const tourId = newTour.id;
    // Insert related content if provided
    if (data.prices && data.prices.length > 0) {
        yield db_1.db.insert(schema_1.tourPrice).values(data.prices.map((price) => ({
            adult: price.adult,
            child: price.child,
            infant: price.infant,
            currencyId: price.currencyId,
            tourId,
        })));
    }
    if (data.discounts && data.discounts.length > 0) {
        yield db_1.db.insert(schema_1.tourDiscounts).values(data.discounts.map((discount) => {
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
        yield db_1.db.insert(schema_1.tourImages).values(imageRecords);
    }
    if ((_d = data.highlights) === null || _d === void 0 ? void 0 : _d.length) {
        yield db_1.db
            .insert(schema_1.tourHighlight)
            .values(data.highlights.map((content) => ({ content, tourId })));
    }
    if ((_e = data.includes) === null || _e === void 0 ? void 0 : _e.length) {
        yield db_1.db
            .insert(schema_1.tourIncludes)
            .values(data.includes.map((content) => ({ content, tourId })));
    }
    if ((_f = data.excludes) === null || _f === void 0 ? void 0 : _f.length) {
        yield db_1.db
            .insert(schema_1.tourExcludes)
            .values(data.excludes.map((content) => ({ content, tourId })));
    }
    if ((_g = data.itinerary) === null || _g === void 0 ? void 0 : _g.length) {
        // First process all async operations in parallel
        const itineraryItems = yield Promise.all(data.itinerary.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                title: item.title,
                imagePath: yield (0, handleImages_1.saveBase64Image)(item.imagePath, (0, uuid_1.v4)(), req, "itineraryImages"),
                describtion: item.description,
                tourId,
            });
        })));
        // Then insert all processed items
        yield db_1.db.insert(schema_1.tourItinerary).values(itineraryItems);
    }
    if ((_h = data.faq) === null || _h === void 0 ? void 0 : _h.length) {
        yield db_1.db.insert(schema_1.tourFAQ).values(data.faq.map((item) => ({
            question: item.question,
            answer: item.answer,
            tourId,
        })));
    }
    if ((_j = data.daysOfWeek) === null || _j === void 0 ? void 0 : _j.length) {
        yield db_1.db
            .insert(schema_1.tourDaysOfWeek)
            .values(data.daysOfWeek.map((day) => ({ dayOfWeek: day, tourId })));
    }
    if ((_k = data.extras) === null || _k === void 0 ? void 0 : _k.length) {
        for (const extra of data.extras) {
            const [extraPrice] = yield db_1.db
                .insert(schema_1.tourPrice)
                .values({
                adult: extra.price.adult,
                child: extra.price.child,
                infant: extra.price.infant,
                currencyId: extra.price.currencyId,
                tourId,
            })
                .$returningId();
            yield db_1.db.insert(schema_1.tourExtras).values({
                tourId,
                extraId: extra.extraId,
                priceId: extraPrice.id,
            });
        }
    }
    yield (0, generateSchedules_1.generateTourSchedules)({
        tourId,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        daysOfWeek: data.daysOfWeek,
        maxUsers: data.maxUsers,
        durationDays: data.durationDays,
        durationHours: data.durationHours,
    });
    (0, response_1.SuccessResponse)(res, { message: "Tour Created Successfully" }, 201);
});
exports.createTour = createTour;
const addData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield db_1.db.select().from(schema_1.categories);
    const currency = yield db_1.db.select().from(schema_1.currencies);
    const extra = yield db_1.db.select().from(schema_1.extras);
    const city = yield db_1.db.select().from(schema_1.cites);
    const country = yield db_1.db.select().from(schema_1.countries);
    (0, response_1.SuccessResponse)(res, {
        categories: category,
        currencies: currency,
        extras: extra,
        countries: country,
        cities: city,
    }, 200);
});
exports.addData = addData;
const deleteTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [tour] = yield db_1.db.select().from(schema_1.tours).where((0, drizzle_orm_1.eq)(schema_1.tours.id, id));
    if (!tour)
        throw new Errors_1.NotFound("Tour Not Found");
    yield (0, deleteImage_1.deletePhotoFromServer)(new URL(tour.mainImage).pathname);
    const tourImagesList = yield db_1.db
        .select()
        .from(schema_1.tourImages)
        .where((0, drizzle_orm_1.eq)(schema_1.tourImages.tourId, id));
    tourImagesList.forEach((tourIamge) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deleteImage_1.deletePhotoFromServer)(new URL(tourIamge.imagePath).pathname);
    }));
    const tourItineraryImages = yield db_1.db
        .select()
        .from(schema_1.tourItinerary)
        .where((0, drizzle_orm_1.eq)(schema_1.tourItinerary.tourId, id));
    tourItineraryImages.forEach((tourIamge) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deleteImage_1.deletePhotoFromServer)(new URL(tourIamge.imagePath).pathname);
    }));
    yield db_1.db.delete(schema_1.tours).where((0, drizzle_orm_1.eq)(schema_1.tours.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Tour Deleted Successfully" }, 200);
});
exports.deleteTour = deleteTour;
const updateTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const tourId = Number(req.params.id);
    const data = req.body;
    const [existingTour] = yield db_1.db.select().from(schema_1.tours).where((0, drizzle_orm_1.eq)(schema_1.tours.id, tourId));
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
    yield db_1.db.update(schema_1.tours).set(updateData).where((0, drizzle_orm_1.eq)(schema_1.tours.id, tourId));
    // Update related content if provided
    if (data.prices && data.prices.length > 0) {
        yield db_1.db.delete(schema_1.tourPrice).where((0, drizzle_orm_1.eq)(schema_1.tourPrice.tourId, tourId));
        yield db_1.db.insert(schema_1.tourPrice).values(data.prices.map((price) => ({
            adult: price.adult,
            child: price.child,
            infant: price.infant,
            currencyId: price.currencyId,
            tourId,
        })));
    }
    if (data.discounts && data.discounts.length > 0) {
        yield db_1.db.delete(schema_1.tourDiscounts).where((0, drizzle_orm_1.eq)(schema_1.tourDiscounts.tourId, tourId));
        yield db_1.db.insert(schema_1.tourDiscounts).values(data.discounts.map((discount) => {
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
    else {
        yield db_1.db.delete(schema_1.tourDiscounts).where((0, drizzle_orm_1.eq)(schema_1.tourDiscounts.tourId, tourId));
    }
    if (data.images && data.images.length > 0) {
        const existingImages = yield db_1.db
            .select()
            .from(schema_1.tourImages)
            .where((0, drizzle_orm_1.eq)(schema_1.tourImages.tourId, tourId));
        // Delete old images from server
        for (const img of existingImages) {
            yield (0, deleteImage_1.deletePhotoFromServer)(new URL(img.imagePath).pathname);
        }
        // Delete old image records from database
        yield db_1.db.delete(schema_1.tourImages).where((0, drizzle_orm_1.eq)(schema_1.tourImages.tourId, tourId));
        // Insert new images
        const imageRecords = yield Promise.all(data.images.map((imagePath) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                tourId,
                imagePath: yield (0, handleImages_1.saveBase64Image)(imagePath, (0, uuid_1.v4)(), req, "tourImages"),
            });
        })));
        yield db_1.db.insert(schema_1.tourImages).values(imageRecords);
    }
    if ((_a = data.highlights) === null || _a === void 0 ? void 0 : _a.length) {
        yield db_1.db.delete(schema_1.tourHighlight).where((0, drizzle_orm_1.eq)(schema_1.tourHighlight.tourId, tourId));
        yield db_1.db
            .insert(schema_1.tourHighlight)
            .values(data.highlights.map((content) => ({ content, tourId })));
    }
    else {
        yield db_1.db.delete(schema_1.tourHighlight).where((0, drizzle_orm_1.eq)(schema_1.tourHighlight.tourId, tourId));
    }
    if ((_b = data.includes) === null || _b === void 0 ? void 0 : _b.length) {
        yield db_1.db.delete(schema_1.tourIncludes).where((0, drizzle_orm_1.eq)(schema_1.tourIncludes.tourId, tourId));
        yield db_1.db
            .insert(schema_1.tourIncludes)
            .values(data.includes.map((content) => ({ content, tourId })));
    }
    else {
        yield db_1.db.delete(schema_1.tourIncludes).where((0, drizzle_orm_1.eq)(schema_1.tourIncludes.tourId, tourId));
    }
    if ((_c = data.excludes) === null || _c === void 0 ? void 0 : _c.length) {
        yield db_1.db.delete(schema_1.tourExcludes).where((0, drizzle_orm_1.eq)(schema_1.tourExcludes.tourId, tourId));
        yield db_1.db
            .insert(schema_1.tourExcludes)
            .values(data.excludes.map((content) => ({ content, tourId })));
    }
    else {
        yield db_1.db.delete(schema_1.tourExcludes).where((0, drizzle_orm_1.eq)(schema_1.tourExcludes.tourId, tourId));
    }
    if ((_d = data.schedules) === null || _d === void 0 ? void 0 : _d.length) {
        yield db_1.db.delete(schema_1.tourSchedules).where((0, drizzle_orm_1.eq)(schema_1.tourSchedules.tourId, tourId));
        yield (0, generateSchedules_1.generateTourSchedules)({
            tourId,
            startDate: new Date(data.startDate).toISOString(),
            endDate: new Date(data.endDate).toISOString(),
            daysOfWeek: data.daysOfWeek,
            maxUsers: data.maxUsers,
            durationDays: data.durationDays,
            durationHours: data.durationHours,
        });
    }
    if ((_e = data.itinerary) === null || _e === void 0 ? void 0 : _e.length) {
        yield db_1.db.delete(schema_1.tourItinerary).where((0, drizzle_orm_1.eq)(schema_1.tourItinerary.tourId, tourId));
        // First process all async operations in parallel
        const itineraryItems = yield Promise.all(data.itinerary.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                title: item.title,
                imagePath: yield (0, handleImages_1.saveBase64Image)(item.imagePath, (0, uuid_1.v4)(), req, "itineraryImages"),
                describtion: item.description, // Keep as 'describtion' to match DB schema
                tourId,
            });
        })));
        // Then insert all processed items
        yield db_1.db.insert(schema_1.tourItinerary).values(itineraryItems);
    }
    else {
        yield db_1.db.delete(schema_1.tourItinerary).where((0, drizzle_orm_1.eq)(schema_1.tourItinerary.tourId, tourId));
    }
    if ((_f = data.faq) === null || _f === void 0 ? void 0 : _f.length) {
        yield db_1.db.delete(schema_1.tourFAQ).where((0, drizzle_orm_1.eq)(schema_1.tourFAQ.tourId, tourId));
        yield db_1.db.insert(schema_1.tourFAQ).values(data.faq.map((item) => ({
            question: item.question,
            answer: item.answer,
            tourId,
        })));
    }
    else {
        yield db_1.db.delete(schema_1.tourFAQ).where((0, drizzle_orm_1.eq)(schema_1.tourFAQ.tourId, tourId));
    }
    if ((_g = data.daysOfWeek) === null || _g === void 0 ? void 0 : _g.length) {
        yield db_1.db.delete(schema_1.tourDaysOfWeek).where((0, drizzle_orm_1.eq)(schema_1.tourDaysOfWeek.tourId, tourId));
        yield db_1.db
            .insert(schema_1.tourDaysOfWeek)
            .values(data.daysOfWeek.map((day) => ({ dayOfWeek: day, tourId })));
    }
    else {
        yield db_1.db.delete(schema_1.tourDaysOfWeek).where((0, drizzle_orm_1.eq)(schema_1.tourDaysOfWeek.tourId, tourId));
    }
    if ((_h = data.extras) === null || _h === void 0 ? void 0 : _h.length) {
        yield db_1.db.delete(schema_1.tourExtras).where((0, drizzle_orm_1.eq)(schema_1.tourExtras.tourId, tourId));
        for (const extra of data.extras) {
            const [extraPrice] = yield db_1.db
                .insert(schema_1.tourPrice)
                .values({
                adult: extra.price.adult,
                child: extra.price.child,
                infant: extra.price.infant,
                currencyId: extra.price.currencyId,
                tourId,
            })
                .$returningId();
            yield db_1.db.insert(schema_1.tourExtras).values({
                tourId,
                extraId: extra.extraId,
                priceId: extraPrice.id,
            });
        }
    }
    else {
        yield db_1.db.delete(schema_1.tourExtras).where((0, drizzle_orm_1.eq)(schema_1.tourExtras.tourId, tourId));
    }
    (0, response_1.SuccessResponse)(res, { message: "Tour Updated Successfully" }, 200);
});
exports.updateTour = updateTour;
