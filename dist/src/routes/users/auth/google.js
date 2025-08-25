"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("../../../config/passport");
const passport_1 = require("../../../config/passport");
const router = express_1.default.Router();
router.post("/", passport_1.verifyGoogleToken);
exports.default = router;
