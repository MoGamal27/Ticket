"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/auth/google.ts
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
require("../../../config/passport");
const router = express_1.default.Router();
router.get("/", passport_1.default.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get("/callback", passport_1.default.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login-error`
}), (req, res) => {
    const { user, token } = req.user;
    if (!user || !token) {
        return res.redirect(`${process.env.FRONTEND_URL}/login-error`);
    }
    const email = encodeURIComponent(user.email);
    const name = encodeURIComponent(user.name);
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}&email=${email}&name=${name}`);
});
exports.default = router;
