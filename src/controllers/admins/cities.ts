import { Request, Response } from "express";
import { db } from "../../models/db";
import { cites, countries } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";

export const getAllCities = async (req: Request, res: Response) => {
  const data = await db
    .select({
      cityId: cites.id,
      cityName: cites.name,
      countryId: countries.id,
      countryName: countries.name,
    })
    .from(cites)
    .leftJoin(countries, eq(cites.countryId, countries.id));
  const country = await db.select().from(countries);

  SuccessResponse(res, { cities: data, countries: country }, 200);
};

export const getCityById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [city] = await db.select().from(cites).where(eq(cites.id, id));
  if (!city) throw new NotFound("City Not Found");
  const [country] = await db
    .select()
    .from(countries)
    .where(eq(countries.id, city.countryId!));
  SuccessResponse(
    res,
    {
      cityName: city.name,
      countryId: city.countryId,
      countryName: country.name,
    },
    200
  );
};

export const updateCity = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [city] = await db.select().from(cites).where(eq(cites.id, id));
  if (!city) throw new NotFound("City Not Found");
  const data = req.body;
  await db.update(cites).set(data).where(eq(cites.id, id));
  SuccessResponse(res, { message: "City updated Successfully" }, 200);
};

export const deleteCity = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [city] = await db.select().from(cites).where(eq(cites.id, id));
  if (!city) throw new NotFound("City Not Found");
  await db.delete(cites).where(eq(cites.id, id));
  SuccessResponse(res, { message: "City Deleted Successfully" }, 200);
};

export const createCity = async (req: Request, res: Response) => {
  const data = req.body;
  await db.insert(cites).values(data);
  SuccessResponse(res, { message: "City Created Successfully" }, 200);
};
