"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
require("../../../config/passport");
const auth_1 = require("../../../utils/auth");
const router = express_1.default.Router();
router.get("/", passport_1.default.authenticate("facebook", { scope: ["email"] }));
router.get("/callback", passport_1.default.authenticate("facebook", { session: false }), (req, res) => {
    const user = req.user;
    const token = (0, auth_1.generateToken)({ id: user === null || user === void 0 ? void 0 : user.id, roles: ["user"] });
    res.json({ token });
});
exports.default = router;
