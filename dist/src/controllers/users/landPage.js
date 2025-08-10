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
exports.getTourById = exports.getToursByCategory = exports.getFeaturedTours = exports.getImages = void 0;
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
        country: schema_1.countries.name,
        city: schema_1.cites.name,
        maxUsers: schema_1.tours.maxUsers,
        category: schema_1.categories.id,
        price: {
            adult: schema_1.tourPrice.adult,
            child: schema_1.tourPrice.child,
            infant: schema_1.tourPrice.infant,
            currency: schema_1.currencies.name,
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
