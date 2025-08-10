import { Request, Response } from "express";
import { db } from "../../models/db";
import {
  categories,
  cites,
  countries,
  currencies,
  extras,
  tourDaysOfWeek,
  tourDiscounts,
  tourExcludes,
  tourExtras,
  tourFAQ,
  tourHighlight,
  tourImages,
  tourIncludes,
  tourItinerary,
  tourPrice,
  tours,
  tourSchedules,
} from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";
import { generateTourSchedules } from "../../utils/generateSchedules";
import { saveBase64Image } from "../../utils/handleImages";
import { v4 as uuid } from "uuid";
import { deletePhotoFromServer } from "../../utils/deleteImage";

export const getAllTours = async (req: Request, res: Response) => {
  const toursData = await db
    .select({
      tours,
      countryName: countries.name, // Just the name from countries
      cityName: cites.name, // Just the name from cities
    })
    .from(tours)
    .leftJoin(countries, eq(tours.country, countries.id))
    .leftJoin(cites, eq(tours.city, cites.id));

  SuccessResponse(res, { tours: toursData }, 200);
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
      meetingPoint: tours.meetingPoint,
      meetingPointLocation: tours.meetingPointLocation,
      meetingPointAddress: tours.meetingPointAddress,
      points: tours.points,
      status: tours.status,
      startDate: tours.startDate,
      endDate: tours.endDate,
      durationDays: tours.durationDays,
      durationHours: tours.durationHours,
      country: countries.name,
      city: cites.name,
      maxUsers: tours.maxUsers,
      category: categories.id,
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

export const createTour = async (req: Request, res: Response) => {
  const data = req.body;
  console.log("before add");
  const [newTour] = await db
    .insert(tours)
    .values({
      title: data.title,
      mainImage: await saveBase64Image(data.mainImage, uuid(), req, "tours"),
      categoryId: data.categoryId,
      describtion: data.description,
      status: true,
      featured: data.featured ?? false,
      meetingPoint: data.meetingPoint ?? false,
      meetingPointLocation: data.meetingPoint
        ? data.meetingPointLocation
        : null,
      meetingPointAddress: data.meetingPoint ? data.meetingPointAddress : null,
      points: data.points ?? 0,
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
    await db.insert(tourPrice).values(
      data.prices.map((price: any) => ({
        adult: price.adult,
        child: price.child,
        infant: price.infant,
        currencyId: price.currencyId,
        tourId,
      }))
    );
  }

  if (data.discounts && data.discounts.length > 0) {
    await db.insert(tourDiscounts).values(
      data.discounts.map((discount: any) => ({
        tourId,
        targetGroup: discount.targetGroup,
        type: discount.type,
        value: discount.value,
        minPeople: discount.minPeople ?? 0,
        maxPeople: discount.maxPeople,
      }))
    );
  }

  if (data.images && data.images.length > 0) {
  const imageRecords = await Promise.all(
    data.images.map(async (imagePath: any) => ({
      tourId,
      imagePath: await saveBase64Image(imagePath, uuid(), req, "tourImages"),
    }))
  );
  await db.insert(tourImages).values(imageRecords);
}

  if (data.highlights?.length) {
    await db
      .insert(tourHighlight)
      .values(data.highlights.map((content: string) => ({ content, tourId })));
  }

  if (data.includes?.length) {
    await db
      .insert(tourIncludes)
      .values(data.includes.map((content: string) => ({ content, tourId })));
  }

  if (data.excludes?.length) {
    await db
      .insert(tourExcludes)
      .values(data.excludes.map((content: string) => ({ content, tourId })));
  }

 if (data.itinerary?.length) {
  // First process all async operations in parallel
  const itineraryItems = await Promise.all(
    data.itinerary.map(async (item: any) => ({
      title: item.title,
      imagePath: await saveBase64Image(
        item.imagePath,
        uuid(),
        req,
        "itineraryImages"
      ),
      describtion: item.description,
      tourId,
    }))
  );
  
  // Then insert all processed items
  await db.insert(tourItinerary).values(itineraryItems);
}

  if (data.faq?.length) {
    await db.insert(tourFAQ).values(
      data.faq.map((item: any) => ({
        question: item.question,
        answer: item.answer,
        tourId,
      }))
    );
  }

  if (data.daysOfWeek?.length) {
    await db
      .insert(tourDaysOfWeek)
      .values(
        data.daysOfWeek.map((day: string) => ({ dayOfWeek: day, tourId }))
      );
  }

  if (data.extras?.length) {
    for (const extra of data.extras) {
      const [extraPrice] = await db
        .insert(tourPrice)
        .values({
          adult: extra.price.adult,
          child: extra.price.child,
          infant: extra.price.infant,
          currencyId: extra.price.currencyId,
          tourId,
        })
        .$returningId();

      await db.insert(tourExtras).values({
        tourId,
        extraId: extra.extraId,
        priceId: extraPrice.id,
      });
    }
  }
  await generateTourSchedules({
    tourId,
    startDate: new Date(data.startDate).toISOString(),
    endDate: new Date(data.endDate).toISOString(),
    daysOfWeek: data.daysOfWeek,
    maxUsers: data.maxUsers,
    durationDays: data.durationDays,
    durationHours: data.durationHours,
  });

  SuccessResponse(res, { message: "Tour Created Successfully" }, 201);
};

export const addData = async (req: Request, res: Response) => {
  const category = await db.select().from(categories);
  const currency = await db.select().from(currencies);
  const extra = await db.select().from(extras);
  const city = await db.select().from(cites);
  const country = await db.select().from(countries);
  SuccessResponse(
    res,
    {
      categories: category,
      currencies: currency,
      extras: extra,
      countries: country,
      cities: city,
    },
    200
  );
};

export const deleteTour = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [tour] = await db.select().from(tours).where(eq(tours.id, id));
  if (!tour) throw new NotFound("Tour Not Found");
  await deletePhotoFromServer(new URL(tour.mainImage).pathname);
  const tourImagesList = await db
    .select()
    .from(tourImages)
    .where(eq(tourImages.tourId, id));
  tourImagesList.forEach(async (tourIamge) => {
    await deletePhotoFromServer(new URL(tourIamge.imagePath!).pathname);
  });
  const tourItineraryImages = await db
    .select()
    .from(tourItinerary)
    .where(eq(tourItinerary.tourId, id));
  tourItineraryImages.forEach(async (tourIamge) => {
    await deletePhotoFromServer(new URL(tourIamge.imagePath!).pathname);
  });
  await db.delete(tours).where(eq(tours.id, id));
  SuccessResponse(res, { message: "Tour Deleted Successfully" }, 200);
};
