"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../middlewares/validation");
const homeFAQ_1 = require("../../controllers/admins/homeFAQ");
const homeFAQ_2 = require("../../validators/admins/homeFAQ");
const users_1 = require("../../validators/admins/users");
const authenticated_1 = require("../../middlewares/authenticated");
const hasPrivilege_1 = require("../../middlewares/hasPrivilege");
const router = (0, express_1.Router)();
router.use(authenticated_1.authenticated);
router
    .route("/")
    .get((0, hasPrivilege_1.hasPrivilege)("Home Page Faq", "View"), (0, catchAsync_1.catchAsync)(homeFAQ_1.getAllFaq))
    .post((0, hasPrivilege_1.hasPrivilege)("Home Page Faq", "Add"), (0, validation_1.validate)(homeFAQ_2.createFAQSchema), (0, catchAsync_1.catchAsync)(homeFAQ_1.createFaq));
router
    .route("/:id")
    .get((0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(homeFAQ_1.getFaqById))
    .put((0, hasPrivilege_1.hasPrivilege)("Home Page Faq", "Edit"), (0, validation_1.validate)(homeFAQ_2.updateFAQSchema), (0, catchAsync_1.catchAsync)(homeFAQ_1.updateFaq))
    .delete((0, hasPrivilege_1.hasPrivilege)("Home Page Faq", "Delete"), (0, validation_1.validate)(users_1.idParams), (0, catchAsync_1.catchAsync)(homeFAQ_1.deleteFaq));
exports.default = router;
