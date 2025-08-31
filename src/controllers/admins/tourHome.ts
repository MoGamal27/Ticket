import { Request, Response } from "express";
import { db } from "../../models/db";

import {
  categories,
  cites,
  countries,
  tours
} from "../../models/schema";

import { SuccessResponse } from "../../utils/response";

import { eq } from "drizzle-orm";


export const getAllTourHome = async (req: Request, res: Response) => {
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
    startDate: tour.tours.startDate,
    endDate: tour.tours.endDate  
  })),
  }, 200);
}