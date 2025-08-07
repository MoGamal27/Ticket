"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const google_1 = __importDefault(require("./google"));
const facebook_1 = __importDefault(require("./facebook"));
const apple_1 = __importDefault(require("./apple"));
const local_1 = __importDefault(require("./local"));
const router = (0, express_1.Router)();
router.use("/apple", apple_1.default);
router.use("/google", google_1.default);
router.use("/facebook", facebook_1.default);
router.use("/local", local_1.default);
exports.default = router;
