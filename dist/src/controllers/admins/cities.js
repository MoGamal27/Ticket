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
exports.createCity = exports.deleteCity = exports.updateCity = exports.getCityById = exports.getAllCities = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const getAllCities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.db
        .select({
        cityId: schema_1.cites.id,
        cityName: schema_1.cites.name,
        countryId: schema_1.countries.id,
        countryName: schema_1.countries.name,
    })
        .from(schema_1.cites)
        .leftJoin(schema_1.countries, (0, drizzle_orm_1.eq)(schema_1.cites.countryId, schema_1.countries.id));
    const country = yield db_1.db.select().from(schema_1.countries);
    (0, response_1.SuccessResponse)(res, { cities: data, countries: country }, 200);
});
exports.getAllCities = getAllCities;
const getCityById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [city] = yield db_1.db.select().from(schema_1.cites).where((0, drizzle_orm_1.eq)(schema_1.cites.id, id));
    if (!city)
        throw new Errors_1.NotFound("City Not Found");
    const [country] = yield db_1.db
        .select()
        .from(schema_1.countries)
        .where((0, drizzle_orm_1.eq)(schema_1.countries.id, city.countryId));
    (0, response_1.SuccessResponse)(res, {
        cityName: city.name,
        countryId: city.countryId,
        countryName: country.name,
    }, 200);
});
exports.getCityById = getCityById;
const updateCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [city] = yield db_1.db.select().from(schema_1.cites).where((0, drizzle_orm_1.eq)(schema_1.cites.id, id));
    if (!city)
        throw new Errors_1.NotFound("City Not Found");
    const data = req.body;
    yield db_1.db.update(schema_1.cites).set(data).where((0, drizzle_orm_1.eq)(schema_1.cites.id, id));
    (0, response_1.SuccessResponse)(res, { message: "City updated Successfully" }, 200);
});
exports.updateCity = updateCity;
const deleteCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [city] = yield db_1.db.select().from(schema_1.cites).where((0, drizzle_orm_1.eq)(schema_1.cites.id, id));
    if (!city)
        throw new Errors_1.NotFound("City Not Found");
    yield db_1.db.delete(schema_1.cites).where((0, drizzle_orm_1.eq)(schema_1.cites.id, id));
    (0, response_1.SuccessResponse)(res, { message: "City Deleted Successfully" }, 200);
});
exports.deleteCity = deleteCity;
const createCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    yield db_1.db.insert(schema_1.cites).values(data);
    (0, response_1.SuccessResponse)(res, { message: "City Created Successfully" }, 200);
});
exports.createCity = createCity;
