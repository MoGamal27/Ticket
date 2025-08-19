"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
require("../../../config/passport"); // passport config
const router = express_1.default.Router();
router.get("/", passport_1.default.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get("/callback", passport_1.default.authenticate("google", { session: false }), (req, res) => {
    const { user, token } = req.user;
    if (!user || !token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    return res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name },
    });
});
exports.default = router;
