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
// خطوة 1: توجيه المستخدم لتسجيل الدخول بجوجل
router.get("/", passport_1.default.authenticate("google", { scope: ["profile", "email"], session: false }));
// خطوة 2: callback بعد تسجيل الدخول
router.get("/callback", passport_1.default.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login-error`
}), (req, res) => {
    // تحويل النوع لأن Passport لا يعرف نوع req.user
    const userData = req.user;
    if (!userData || !userData.user || !userData.token) {
        return res.redirect(`${process.env.FRONTEND_URL}/login-error`);
    }
    const { user, token } = userData;
    const email = encodeURIComponent(user.email);
    const name = encodeURIComponent(user.name);
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}&email=${email}&name=${name}`);
});
exports.default = router;
