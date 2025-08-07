"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const country_1 = require("../../controllers/admins/country");
const country_2 = require("../../validators/admins/country");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const users_1 = require("../../validators/admins/users");
const router = (0, express_1.Router)();
router
    .route("/")
    .get((0, catchAsync_1.catchAsync)(country_1.getAllCountries))
    .post((0, validation_1.validate)(country_2.createCountrySchema), (0, catchAsync_1.catchAsync)(country_1.createCountry));
router
    .route("/:id")
    .get((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(country_1.getCountryById))
    .put((0, validation_1.validate)(country_2.updateCountrySchema), (0, catchAsync_1.catchAsync)(country_1.updateCountry))
    .delete((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(country_1.deleteCountry));
exports.default = router;
