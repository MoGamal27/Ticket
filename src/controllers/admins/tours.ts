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
  promoCode,
  promoCodeUsers,
  tourPromoCode,
  bookings,
  bookingDetails,
  bookingExtras,
  payments,
  manualPaymentMethod,

} from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import { eq, and, inArray } from "drizzle-orm";
import { NotFound } from "../../Errors";
import { generateTourSchedules, generateTourSchedulesInTransaction } from "../../utils/generateSchedules";
import { saveBase64Image } from "../../utils/handleImages";
import { v4 as uuid } from "uuid";
import { deletePhotoFromServer } from "../../utils/deleteImage";
import { format } from 'date-fns';

export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]; 
};

export const getAllTours = async (req: Request, res: Response) => {
  const toursData = await db
    .select({
      tours,
      startDate: tours.startDate,
      endDate: tours.endDate,
      countryName: countries.name, 
      cityName: cites.name, 
    })
    .from(tours)
    .leftJoin(countries, eq(tours.country, countries.id))
    .leftJoin(cites, eq(tours.city, cites.id));

  SuccessResponse(res, { 
   tours: toursData.map(tour => ({
    ...tour.tours,
    startDate: formatDate(tour.tours.startDate),
    endDate: formatDate(tour.tours.endDate),
   })),
  }, 200);
}

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
      country: countries.id,
      city: cites.id,
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
    promoCodes
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
          currency: tourPrice.currencyId,
          currencyName: currencies.name,
        },
      })
      .from(tourExtras)
      .leftJoin(extras, eq(tourExtras.extraId, extras.id))
      .leftJoin(tourPrice, eq(tourExtras.priceId, tourPrice.id))
      .leftJoin(currencies, eq(tourPrice.currencyId, currencies.id))
      .where(eq(tourExtras.tourId, tourId)),
    db
      .select({ 
        id: tourImages.id,
        imagePath: tourImages.imagePath 
      })
      .from(tourImages)
      .where(eq(tourImages.tourId, tourId)),
    db
      .select({ 
        id: promoCode.id,
        code: promoCode.code 
      })
      .from(tourPromoCode) 
      .leftJoin(promoCode, eq(tourPromoCode.promoCodeId, promoCode.id))
      .where(eq(tourPromoCode.tourId, tourId)),
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
        id: i.id,
        title: i.title,
        imagePath: i.imagePath,
        description: i.describtion,
      })),
      faq: faq.map((f) => ({ question: f.question, answer: f.answer })),
      promoCode: promoCodes.map((p) => ({
       id: p.id,
      code: p.code
})), // Use the query result variable
      discounts,
      daysOfWeek: daysOfWeek.map((d) => d.dayOfWeek),
      extras: extrasWithPrices,
      images: images.map((img) => ({
        id: img.id,
        url: img.imagePath
      })),
    },
    200
  );
};

export const createTour = async (req: Request, res: Response) => {
  const data = req.body;
  
  // Start transaction - ALL operations must be inside this transaction
  await db.transaction(async (tx) => {
    console.log("before add");
    
    // Insert main tour using transaction
    const [newTour] = await tx
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
      await tx.insert(tourPrice).values(
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
      await tx.insert(tourDiscounts).values(
        data.discounts.map((discount: any) => ({
          tourId,
          targetGroup: discount.targetGroup,
          type: discount.type,
          value: discount.value,
          minPeople: discount.minPeople ?? 0,
          maxPeople: discount.maxPeople,
          kindBy: discount.kindBy,
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
      await tx.insert(tourImages).values(imageRecords);
    }

    if (data.highlights?.length) {
      await tx
        .insert(tourHighlight)
        .values(data.highlights.map((content: string) => ({ content, tourId })));
    }

    if (data.includes?.length) {
      await tx
        .insert(tourIncludes)
        .values(data.includes.map((content: string) => ({ content, tourId })));
    }

    if (data.excludes?.length) {
      await tx
        .insert(tourExcludes)
        .values(data.excludes.map((content: string) => ({ content, tourId })));
    }

    if (data.itinerary?.length) {
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
      await tx.insert(tourItinerary).values(itineraryItems);
    }

    if (data.faq?.length) {
      await tx.insert(tourFAQ).values(
        data.faq.map((item: any) => ({
          question: item.question,
          answer: item.answer,
          tourId,
        }))
      );
    }

    if (data.daysOfWeek?.length) {
      await tx
        .insert(tourDaysOfWeek)
        .values(
          data.daysOfWeek.map((day: string) => ({ dayOfWeek: day, tourId }))
        );
    }

    if (data.extras?.length) {
      for (const extra of data.extras) {
        const [extraPrice] = await tx
          .insert(tourPrice)
          .values({
            adult: extra.price.adult,
            child: extra.price.child,
            infant: extra.price.infant,
            currencyId: extra.price.currencyId,
            tourId,
          })
          .$returningId();

        await tx.insert(tourExtras).values({
          tourId,
          extraId: extra.extraId,
          priceId: extraPrice.id,
        });
      }
    }

    if (data.promoCodeIds && data.promoCodeIds.length > 0) {
      // Validate that the promo codes exist using transaction
      const existingPromoCodes = await tx
        .select({ 
          id: promoCode.id
        })
        .from(promoCode)
        .where(inArray(promoCode.id, data.promoCodeIds));

      const existingPromoCodeIds = existingPromoCodes.map(pc => pc.id);
      const invalidPromoCodeIds = data.promoCodeIds.filter((id: number) => 
        !existingPromoCodeIds.includes(id)
      );

      // Handle invalid promo codes
      if (invalidPromoCodeIds.length > 0) {
        throw new Error(`Invalid promo code IDs: ${invalidPromoCodeIds.join(', ')}`);
      }

      // Insert new associations using transaction
      await tx.insert(tourPromoCode).values(
        data.promoCodeIds.map((promoCodeId: number) => ({
          tourId,
          promoCodeId
        }))
      );
    }

    // Generate schedules using transaction
    await generateTourSchedulesInTransaction(tx, {
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
  });

  SuccessResponse(res, { message: "Tour Created Successfully" }, 201);
};

export const addData = async (req: Request, res: Response) => {
  const category = await db.select().from(categories);
  const currency = await db.select().from(currencies);
  const extra = await db.select().from(extras);
  const city = await db.select().from(cites);
  const country = await db.select().from(countries);
  const PromoCode = await db.select().from(promoCode)
  SuccessResponse(
    res,
    {
      categories: category,
      currencies: currency,
      extras: extra,
      countries: country,
      cities: city,
      PromoCode: PromoCode
    },
    200
  );
};

export const deleteTour = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  
  // Check if tour exists
  const [tour] = await db.select().from(tours).where(eq(tours.id, id));
  if (!tour) throw new NotFound("Tour Not Found");
  
  try {
    // Check for existing bookings through tour schedules
    const existingSchedules = await db
      .select({ id: tourSchedules.id })
      .from(tourSchedules)
      .where(eq(tourSchedules.tourId, id));
    
    if (existingSchedules.length > 0) {
      const scheduleIds = existingSchedules.map(s => s.id);
      
      // Check for confirmed bookings
      const confirmedBookings = await db
        .select()
        .from(bookings)
        .where(
          and(
            inArray(bookings.tourId, scheduleIds),
            eq(bookings.status, 'confirmed')
          )
        );
      
      if (confirmedBookings.length > 0) {
        throw new Error("Cannot delete tour with confirmed bookings");
      }
      
      // Delete all bookings and related data for this tour
      for (const booking of await db.select().from(bookings).where(inArray(bookings.tourId, scheduleIds))) {
        await db.delete(bookingDetails).where(eq(bookingDetails.bookingId, booking.id));
        await db.delete(bookingExtras).where(eq(bookingExtras.bookingId, booking.id));
        await db.delete(payments).where(eq(payments.bookingId, booking.id));
        await db.delete(manualPaymentMethod).where(eq(manualPaymentMethod.paymentId, booking.id));
      }
      await db.delete(bookings).where(inArray(bookings.tourId, scheduleIds));
    }
    // Delete main tour image from server
    await deletePhotoFromServer(new URL(tour.mainImage).pathname);
    
    // Get and delete tour images
    const tourImagesList = await db
      .select()
      .from(tourImages)
      .where(eq(tourImages.tourId, id));
    
    // Delete tour images from server
    await Promise.all(
      tourImagesList.map(async (tourImage) => {
        if (tourImage.imagePath) {
          await deletePhotoFromServer(new URL(tourImage.imagePath).pathname);
        }
      })
    );
    
    // Get and delete tour itinerary images
    const tourItineraryList = await db
      .select()
      .from(tourItinerary)
      .where(eq(tourItinerary.tourId, id));
    
    // Delete tour itinerary images from server
    await Promise.all(
      tourItineraryList.map(async (itinerary) => {
        if (itinerary.imagePath) {
          await deletePhotoFromServer(new URL(itinerary.imagePath).pathname);
        }
      })
    );
    
    // Delete all related records first (to avoid foreign key constraint errors)
    // Note: Some tables have cascade delete, but we'll delete explicitly for consistency
    await db.delete(tourImages).where(eq(tourImages.tourId, id));
    await db.delete(tourItinerary).where(eq(tourItinerary.tourId, id));
    await db.delete(tourPrice).where(eq(tourPrice.tourId, id));
    await db.delete(tourHighlight).where(eq(tourHighlight.tourId, id));
    await db.delete(tourIncludes).where(eq(tourIncludes.tourId, id));
    await db.delete(tourExcludes).where(eq(tourExcludes.tourId, id));
    await db.delete(tourFAQ).where(eq(tourFAQ.tourId, id));
    await db.delete(tourPromoCode).where(eq(tourPromoCode.tourId, id));
    await db.delete(tourExtras).where(eq(tourExtras.tourId, id));
    
    // These should cascade automatically but delete explicitly to be safe
    await db.delete(tourDiscounts).where(eq(tourDiscounts.tourId, id));
    await db.delete(tourDaysOfWeek).where(eq(tourDaysOfWeek.tourId, id));
    await db.delete(tourSchedules).where(eq(tourSchedules.tourId, id));
    
    // Finally delete the tour itself
    await db.delete(tours).where(eq(tours.id, id));
    
    SuccessResponse(res, { message: "Tour Deleted Successfully" }, 200);
    
  } catch (error) {
    console.error("Error deleting tour:", error);
    throw error; // Re-throw to be handled by your error middleware
  }
};


export const updateTour = async (req: Request, res: Response) => {
  const tourId = Number(req.params.id);
  const data = req.body;

  // Start transaction - ALL operations must be inside this transaction
  await db.transaction(async (tx) => {
    // Check if tour exists
    const [existingTour] = await tx.select().from(tours).where(eq(tours.id, tourId));
    if (!existingTour) throw new NotFound("Tour not found");

    // Update main tour details
    const updateData: any = {};
    
    if (data.title) updateData.title = data.title;
    if (data.mainImage) {
      updateData.mainImage = await saveBase64Image(data.mainImage, uuid(), req, "tours");
    }
    if (data.categoryId) updateData.categoryId = data.categoryId;
    if (data.description) updateData.describtion = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.meetingPoint !== undefined) updateData.meetingPoint = data.meetingPoint;
    if (data.meetingPointLocation) updateData.meetingPointLocation = data.meetingPointLocation;
    if (data.meetingPointAddress) updateData.meetingPointAddress = data.meetingPointAddress;
    if (data.points !== undefined) updateData.points = data.points;
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (data.durationDays) updateData.durationDays = data.durationDays;
    if (data.durationHours) updateData.durationHours = data.durationHours;
    if (data.country) updateData.country = data.country;
    if (data.city) updateData.city = data.city;
    if (data.maxUsers) updateData.maxUsers = data.maxUsers;

    // Update tour using transaction
    await tx.update(tours).set(updateData).where(eq(tours.id, tourId));

    // Update related content if provided (ALL using tx instead of db)
    if (data.prices !== undefined) {
      await tx.delete(tourPrice).where(eq(tourPrice.tourId, tourId));
      if (data.prices.length > 0) {
        await tx.insert(tourPrice).values(
          data.prices.map((price: any) => ({
            adult: price.adult,
            child: price.child,
            infant: price.infant,
            currencyId: price.currencyId,
            tourId,
          }))
        );
      }
    }

    if (data.discounts !== undefined) {
      await tx.delete(tourDiscounts).where(eq(tourDiscounts.tourId, tourId));
      if (data.discounts.length > 0) {
        await tx.insert(tourDiscounts).values(
          data.discounts.map((discount: any) => ({
            tourId,
            targetGroup: discount.targetGroup,
            type: discount.type,
            value: discount.value,
            minPeople: discount.minPeople ?? 0,
            maxPeople: discount.maxPeople,
            kindBy: discount.kindBy,
          }))
        );
      }
    }

    // Handle images with transaction
    if (data.images !== undefined) {
      const { added = [], deleted = [] } = data.images;
      
      // Handle deleted images
      if (deleted.length > 0) {
        // Get the images to delete using transaction
        const imagesToDelete = await tx
          .select()
          .from(tourImages)
          .where(and(
            eq(tourImages.tourId, tourId),
            inArray(tourImages.id, deleted) 
          ));

        // Delete physical files from server
        for (const img of imagesToDelete) {
          await deletePhotoFromServer(new URL(img.imagePath!).pathname);
        }

        // Delete records from database using transaction
        await tx.delete(tourImages).where(
          and(
            eq(tourImages.tourId, tourId),
            inArray(tourImages.id, deleted)
          )
        );
      }

      // Handle added images
      if (added.length > 0) {
        const imageRecords = await Promise.all(
          added.map(async (imagePath: any) => ({
            tourId,
            imagePath: await saveBase64Image(imagePath, uuid(), req, "tourImages"),
          }))
        );
        await tx.insert(tourImages).values(imageRecords);
      }
    }

    if (data.highlights !== undefined) {
      await tx.delete(tourHighlight).where(eq(tourHighlight.tourId, tourId));
      if (data.highlights.length > 0) {
        await tx
          .insert(tourHighlight)
          .values(data.highlights.map((content: string) => ({ content, tourId })));
      }
    }

    if (data.includes !== undefined) {
      await tx.delete(tourIncludes).where(eq(tourIncludes.tourId, tourId));
      if (data.includes.length > 0) {
        await tx
          .insert(tourIncludes)
          .values(data.includes.map((content: string) => ({ content, tourId })));
      }
    }

    if (data.excludes !== undefined) {
      await tx.delete(tourExcludes).where(eq(tourExcludes.tourId, tourId));
      if (data.excludes.length > 0) {
        await tx
          .insert(tourExcludes)
          .values(data.excludes.map((content: string) => ({ content, tourId })));
      }
    }

    // Handle itinerary with transaction
    if (data.itinerary !== undefined) {
      const { added = [], deleted = [], updated = [] } = data.itinerary;
      
      // Handle deletions first
      if (deleted.length > 0) {
        // Get existing itinerary items to delete their images using transaction
        const itemsToDelete = await tx
          .select()
          .from(tourItinerary)
          .where(and(
            eq(tourItinerary.tourId, tourId),
            inArray(tourItinerary.id, deleted)
          ));

        // Delete physical image files
        for (const item of itemsToDelete) {
          if (item.imagePath) {
            try {
              await deletePhotoFromServer(new URL(item.imagePath).pathname);
            } catch (error) {
              console.error(`Failed to delete image: ${item.imagePath}`, error);
            }
          }
        }

        // Delete from database using transaction
        await tx.delete(tourItinerary).where(
          and(
            eq(tourItinerary.tourId, tourId),
            inArray(tourItinerary.id, deleted)
          )
        );
      }

      // Handle updates to existing items
      if (updated.length > 0) {
        await Promise.all(updated.map(async (item: any) => {
          const updateData: any = {
            title: item.title,
            describtion: item.description
          };
          
          // Only update image if a new one is provided
          if (item.imagePath) {
            // Delete old image if it exists using transaction
            const [existingItem] = await tx.select()
              .from(tourItinerary)
              .where(eq(tourItinerary.id, item.id));
            
            if (existingItem?.imagePath) {
              await deletePhotoFromServer(new URL(existingItem.imagePath).pathname);
            }
            
            updateData.imagePath = await saveBase64Image(
              item.imagePath, 
              uuid(), 
              req, 
              "itineraryImages"
            );
          }
          
          // Update using transaction
          await tx.update(tourItinerary)
            .set(updateData)
            .where(eq(tourItinerary.id, item.id));
        }));
      }

      // Handle additions of new items
      if (added.length > 0) {
        const newItems = await Promise.all(
          added.map(async (item: any) => ({
            title: item.title,
            describtion: item.description,
            imagePath: item.imagePath ? 
              await saveBase64Image(item.imagePath, uuid(), req, "itineraryImages") : 
              null,
            tourId,
          }))
        );
        
        await tx.insert(tourItinerary).values(newItems);
      }
    }

    // Handle promo codes with transaction
    if (data.promoCodeIds && data.promoCodeIds.length > 0) {
      // Validate that the promo codes exist using transaction
      const existingPromoCodes = await tx
        .select({ 
          id: promoCode.id
        })
        .from(promoCode)
        .where(inArray(promoCode.id, data.promoCodeIds));

      const existingPromoCodeIds = existingPromoCodes.map(pc => pc.id);
      const invalidPromoCodeIds = data.promoCodeIds.filter((id: number) => 
        !existingPromoCodeIds.includes(id)
      );

      // Handle invalid promo codes
      if (invalidPromoCodeIds.length > 0) {
        throw new Error(`Invalid promo code IDs: ${invalidPromoCodeIds.join(', ')}`);
      }

      // Check which promo codes are already associated with this tour using transaction
      const existingAssociations = await tx
        .select({ promoCodeId: tourPromoCode.promoCodeId })
        .from(tourPromoCode)
        .where(
          and(
            eq(tourPromoCode.tourId, tourId),
            inArray(tourPromoCode.promoCodeId, data.promoCodeIds)
          )
        );

      const alreadyAssociatedIds = existingAssociations.map(a => a.promoCodeId);
      const newAssociations = data.promoCodeIds.filter((id: number) => 
        !alreadyAssociatedIds.includes(id)
      );

      // Insert new associations only using transaction
      if (newAssociations.length > 0) {
        await tx.insert(tourPromoCode).values(
          newAssociations.map((promoCodeId: number) => ({
            tourId,
            promoCodeId
          }))
        );
      }
    }

    if (data.faq !== undefined) {
      await tx.delete(tourFAQ).where(eq(tourFAQ.tourId, tourId));
      if (data.faq.length > 0) {
        await tx.insert(tourFAQ).values(
          data.faq.map((item: any) => ({
            question: item.question,
            answer: item.answer,
            tourId,
          }))
        );
      }
    }

    if (data.daysOfWeek !== undefined) {
      // Delete existing days
      await tx.delete(tourDaysOfWeek).where(eq(tourDaysOfWeek.tourId, tourId));
      
      // Insert new days if provided
      if (data.daysOfWeek.length > 0) {
        // Convert to lowercase to match enum values
        const formattedDays = data.daysOfWeek.map((day: string) => 
          day.toLowerCase().trim()
        );
        
        await tx.insert(tourDaysOfWeek).values(
          formattedDays.map((day: string) => ({ 
            dayOfWeek: day, 
            tourId 
          }))
        );
      }
    }

    if (data.extras !== undefined) {
      await tx.delete(tourExtras).where(eq(tourExtras.tourId, tourId));
      if (data.extras.length > 0) {
        for (const extra of data.extras) {
          // Use transaction for tour price insertion
          const [extraPrice] = await tx
            .insert(tourPrice)
            .values({
              adult: extra.price.adult,
              child: extra.price.child,
              infant: extra.price.infant,
              currencyId: extra.price.currencyId,
              tourId,
            })
            .$returningId();

          // Use transaction for tour extras insertion
          await tx.insert(tourExtras).values({
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
  await tx.delete(tourSchedules).where(eq(tourSchedules.tourId, tourId));
  
  // Convert dates to proper SQL format
  const formatDateForSQL = (date: Date | string) => {
    const d = new Date(date);
    return format(d, 'yyyy-MM-dd HH:mm:ss'); // Use date-fns format
  };

  const startDateFormatted = data.startDate 
    ? formatDateForSQL(data.startDate)
    : formatDateForSQL(existingTour.startDate);
  
  const endDateFormatted = data.endDate 
    ? formatDateForSQL(data.endDate)
    : formatDateForSQL(existingTour.endDate);

  // Call the modified generateTourSchedules function with tx parameter
  await generateTourSchedulesInTransaction(tx, {
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
  });

  

  // Only send response if transaction succeeded
  SuccessResponse(res, { message: "Tour Updated Successfully" }, 200);
};



