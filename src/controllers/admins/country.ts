import { Request, Response } from "express";
import { db } from "../../models/db";
import { cites, countries } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";
import { deletePhotoFromServer } from "../../utils/deleteImage";
import { saveBase64Image } from "../../utils/handleImages";
import { v4 } from "uuid";

export const getAllCountries = async (req: Request, res: Response) => {
  const data = await db.select().from(countries);
  SuccessResponse(res, { countries: data }, 200);
};

export const getCountryById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [country] = await db
    .select()
    .from(countries)
    .where(eq(countries.id, id));
  if (!country) throw new NotFound("Country Not Found");
  const city = await db.select().from(cites).where(eq(cites.countryId, id));
  SuccessResponse(res, { country, cities: city }, 200);
};

export const updateCountry = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [country] = await db
    .select()
    .from(countries)
    .where(eq(countries.id, id));
  if (!country) throw new NotFound("Country Not Found");
  const data = req.body;
  if (data.imagePath) {
    await deletePhotoFromServer(new URL(country.imagePath!).pathname);
    data.imagePath = await saveBase64Image(
      data.imagePath,
      v4(),
      req,
      "countries"
    );
  }
  await db.update(countries).set(data).where(eq(countries.id, id));
  SuccessResponse(res, { message: "Country Updated Successfully" }, 200);
};

export const deleteCountry = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [country] = await db
    .select()
    .from(countries)
    .where(eq(countries.id, id));
  if (!country) throw new NotFound("Country Not Found");
  await deletePhotoFromServer(new URL(country.imagePath!).pathname);
  await db.delete(countries).where(eq(countries.id, id));
  SuccessResponse(res, { message: "Country Deleted Successfully" }, 200);
};

export const createCountry = async (req: Request, res: Response) => {
  const data = req.body;
  data.imagePath = await saveBase64Image(
    data.imagePath,
    v4(),
    req,
    "countries"
  );
  await db.insert(countries).values(data);
  SuccessResponse(res, { message: "Country Created Successfully" }, 201);
};
