"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cities_1 = require("../../controllers/admins/cities");
const cities_2 = require("../../validators/admins/cities");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const users_1 = require("../../validators/admins/users");
const router = (0, express_1.Router)();
router
    .route("/")
    .get((0, catchAsync_1.catchAsync)(cities_1.getAllCities))
    .post((0, validation_1.validate)(cities_2.createCitySchema), (0, catchAsync_1.catchAsync)(cities_1.createCity));
router
    .route("/:id")
    .get((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(cities_1.getCityById))
    .put((0, validation_1.validate)(cities_2.updateCitySchema), (0, catchAsync_1.catchAsync)(cities_1.updateCity))
    .delete((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(cities_1.deleteCity));
exports.default = router;
