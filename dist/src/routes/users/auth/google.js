"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
require("../../config/passport"); // load google strategy
const router = express_1.default.Router();
router.get("/", passport_1.default.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get("/callback", passport_1.default.authenticate("google", { session: false }), (req, res) => {
    const { user, token } = req.user;
    if (!user || !token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const redirectUrl = $, { process, env, FRONTEND_URL };
    /?token=${token};
    return res.redirect(redirectUrl);
});
exports.default = router;
