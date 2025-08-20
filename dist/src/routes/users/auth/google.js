"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/auth/google.ts
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
require("../../../config/passport"); // load google strategy
const router = express_1.default.Router();
// بدء تسجيل الدخول مع جوجل
router.get("/", passport_1.default.authenticate("google", { scope: ["profile", "email"], session: false }));
// callback بعد تسجيل الدخول
router.get("/callback", passport_1.default.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login-error `
}), (req, res) => {
    const { user, token } = req.user;
    if (!user || !token) {
        // مجرد احتياط، لو فشل توليد التوكن
        return res.redirect(`${process.env.FRONTEND_URL}/login-error)`);
    }
    // تحويل المستخدم للـ Frontend مع التوكن
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
});
exports.default = router;
