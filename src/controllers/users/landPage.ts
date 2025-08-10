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
} from "../../models/schema";
import { eq } from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";
import { NotFound } from "../../Errors";

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
      price: {
        adult: tourPrice.adult,
        child: tourPrice.child,
        infant: tourPrice.infant,
        currency: currencies.name,
      },
    })
    .from(tours)
    .leftJoin(categories, eq(tours.categoryId, categories.id))
    .leftJoin(tourPrice, eq(tours.id, tourPrice.tourId))
    .leftJoin(currencies, eq(tourPrice.currencyId, currencies.id))
    .leftJoin(cites, eq(cites.id, tours.city))
    .leftJoin(countries, eq(countries.id, tours.country))
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
    db
      .select({
        id: extras.id,
        name: extras.name,
        price: {
          adult: tourPrice.adult,
          child: tourPrice.child,
          infant: tourPrice.infant,
        },
      })
      .from(tourExtras)
      .leftJoin(extras, eq(tourExtras.extraId, extras.id))
      .leftJoin(tourPrice, eq(tourExtras.priceId, tourPrice.id))
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
