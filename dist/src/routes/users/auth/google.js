"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
require("../../../config/passport");
const auth_1 = require("../../../utils/auth");
const Errors_1 = require("../../../Errors");
const router = express_1.default.Router();
router.get("/", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/callback", (req, res, next) => {
    passport_1.default.authenticate("google", { session: false }, (err, user, info) => {
        if (err || !user) {
            throw new Errors_1.UnauthorizedError("Authentication failed");
        }
        const token = (0, auth_1.generateToken)({ id: user.id, roles: ["user"] });
        return res.json({ token });
    })(req, res, next);
});
exports.default = router;
