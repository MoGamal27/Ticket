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
exports.deleteFaq = exports.updateFaq = exports.createFaq = exports.getFaqById = exports.getAllFaq = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const getAllFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const faqs = yield db_1.db.select().from(schema_1.homePageFAQ);
    (0, response_1.SuccessResponse)(res, { faqs }, 200);
});
exports.getAllFaq = getAllFaq;
const getFaqById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [faq] = yield db_1.db
        .select()
        .from(schema_1.homePageFAQ)
        .where((0, drizzle_orm_1.eq)(schema_1.homePageFAQ.id, id));
    if (!faq)
        throw new Errors_1.NotFound("FAQ Not Found");
    (0, response_1.SuccessResponse)(res, { faq }, 200);
});
exports.getFaqById = getFaqById;
const createFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    yield db_1.db.insert(schema_1.homePageFAQ).values(data);
    (0, response_1.SuccessResponse)(res, { message: "FAQ Created Successfully" });
});
exports.createFaq = createFaq;
const updateFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [faq] = yield db_1.db
        .select()
        .from(schema_1.homePageFAQ)
        .where((0, drizzle_orm_1.eq)(schema_1.homePageFAQ.id, id));
    if (!faq)
        throw new Errors_1.NotFound("FAQ Not Found");
    const data = req.body;
    yield db_1.db.update(schema_1.homePageFAQ).set(data).where((0, drizzle_orm_1.eq)(schema_1.homePageFAQ.id, id));
    (0, response_1.SuccessResponse)(res, { message: "FAQ Updated Successfully" });
});
exports.updateFaq = updateFaq;
const deleteFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const [faq] = yield db_1.db
        .select()
        .from(schema_1.homePageFAQ)
        .where((0, drizzle_orm_1.eq)(schema_1.homePageFAQ.id, id));
    if (!faq)
        throw new Errors_1.NotFound("FAQ Not Found");
    yield db_1.db.delete(schema_1.homePageFAQ).where((0, drizzle_orm_1.eq)(schema_1.homePageFAQ.id, id));
    (0, response_1.SuccessResponse)(res, { message: "FAQ Deleted Successfully" });
});
exports.deleteFaq = deleteFaq;
