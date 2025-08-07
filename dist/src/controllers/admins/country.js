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
exports.createCountry = exports.deleteCountry = exports.updateCountry = exports.getCountryById = exports.getAllCountries = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const deleteImage_1 = require("../../utils/deleteImage");
const handleImages_1 = require("../../utils/handleImages");
const uuid_1 = require("uuid");
const getAllCountries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.db.select().from(schema_1.countries);
    (0, response_1.SuccessResponse)(res, { countries: data }, 200);
});
exports.getAllCountries = getAllCountries;
const getCountryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [country] = yield db_1.db
        .select()
        .from(schema_1.countries)
        .where((0, drizzle_orm_1.eq)(schema_1.countries.id, id));
    if (!country)
        throw new Errors_1.NotFound("Country Not Found");
    const city = yield db_1.db.select().from(schema_1.cites).where((0, drizzle_orm_1.eq)(schema_1.cites.countryId, id));
    (0, response_1.SuccessResponse)(res, { country, cities: city }, 200);
});
exports.getCountryById = getCountryById;
const updateCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [country] = yield db_1.db
        .select()
        .from(schema_1.countries)
        .where((0, drizzle_orm_1.eq)(schema_1.countries.id, id));
    if (!country)
        throw new Errors_1.NotFound("Country Not Found");
    const data = req.body;
    if (data.imagePath) {
        yield (0, deleteImage_1.deletePhotoFromServer)(new URL(country.imagePath).pathname);
        data.imagePath = yield (0, handleImages_1.saveBase64Image)(data.imagePath, (0, uuid_1.v4)(), req, "countries");
    }
    yield db_1.db.update(schema_1.countries).set(data).where((0, drizzle_orm_1.eq)(schema_1.countries.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Country Updated Successfully" }, 200);
});
exports.updateCountry = updateCountry;
const deleteCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [country] = yield db_1.db
        .select()
        .from(schema_1.countries)
        .where((0, drizzle_orm_1.eq)(schema_1.countries.id, id));
    if (!country)
        throw new Errors_1.NotFound("Country Not Found");
    yield (0, deleteImage_1.deletePhotoFromServer)(new URL(country.imagePath).pathname);
    yield db_1.db.delete(schema_1.countries).where((0, drizzle_orm_1.eq)(schema_1.countries.id, id));
    (0, response_1.SuccessResponse)(res, { message: "Country Deleted Successfully" }, 200);
});
exports.deleteCountry = deleteCountry;
const createCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    data.imagePath = yield (0, handleImages_1.saveBase64Image)(data.imagePath, (0, uuid_1.v4)(), req, "countries");
    yield db_1.db.insert(schema_1.countries).values(data);
    (0, response_1.SuccessResponse)(res, { message: "Country Created Successfully" }, 201);
});
exports.createCountry = createCountry;
