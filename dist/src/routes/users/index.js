"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const landPage_1 = __importDefault(require("./landPage"));
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use("/landPage", landPage_1.default);
exports.default = router;
