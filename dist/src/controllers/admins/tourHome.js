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
exports.getAllTourHome = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const getAllTourHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const toursData = yield db_1.db
        .select({
        tours: schema_1.tours,
        startDate: schema_1.tours.startDate,
        endDate: schema_1.tours.endDate,
        countryName: schema_1.countries.name,
        cityName: schema_1.cites.name,
    })
        .from(schema_1.tours)
        .leftJoin(schema_1.countries, (0, drizzle_orm_1.eq)(schema_1.tours.country, schema_1.countries.id))
        .leftJoin(schema_1.cites, (0, drizzle_orm_1.eq)(schema_1.tours.city, schema_1.cites.id));
    (0, response_1.SuccessResponse)(res, {
        tours: toursData.map(tour => (Object.assign(Object.assign({}, tour.tours), { startDate: tour.tours.startDate, endDate: tour.tours.endDate }))),
    }, 200);
});
exports.getAllTourHome = getAllTourHome;
