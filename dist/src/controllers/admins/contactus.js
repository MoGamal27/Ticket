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
exports.getContactMessageById = exports.getAllContactMessages = void 0;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
const drizzle_orm_1 = require("drizzle-orm");
const Errors_1 = require("../../Errors");
const getAllContactMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield db_1.db.select()
        .from(schema_1.contactus);
    (0, response_1.SuccessResponse)(res, { messages }, 200);
});
exports.getAllContactMessages = getAllContactMessages;
const getContactMessageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messageId = Number(req.params.id);
    if (isNaN(messageId)) {
        throw new Errors_1.NotFound("Invalid message ID");
    }
    const [message] = yield db_1.db.select()
        .from(schema_1.contactus)
        .where((0, drizzle_orm_1.eq)(schema_1.contactus.id, messageId));
    (0, response_1.SuccessResponse)(res, message, 200);
});
exports.getContactMessageById = getContactMessageById;
