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
        try {
            let finalUser = user;
            if (!user) {
                const email = (_c = (_b = (_a = info === null || info === void 0 ? void 0 : info.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : "";
                const name = (_e = (_d = info === null || info === void 0 ? void 0 : info.name) === null || _d === void 0 ? void 0 : _d.givenName) !== null && _e !== void 0 ? _e : "";
                // اتأكد ان مفيش duplicate
                const [existingUser] = yield db_1.db
                    .select()
                    .from(schema_1.users)
                    .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
                if (existingUser) {
                    finalUser = existingUser;
                }
                else {
                    const [newUserId] = yield db_1.db.insert(schema_1.users).values({
                        email,
                        name,
                        password: null,
                        phoneNumber: null,
                    }).$returningId();
                    const [newUser] = yield db_1.db
                        .select()
                        .from(schema_1.users)
                        .where((0, drizzle_orm_1.eq)(schema_1.users.id, newUserId.id));
                    finalUser = newUser;
                }
            }
            const token = (0, auth_1.generateToken)({ id: finalUser.id, roles: ["user"] });
            return res.json({ token, user: { id: finalUser.id, email: finalUser.email, name: finalUser.name } });
        }
        catch (e) {
            console.error("Error processing user:", e);
            return res.status(500).json({ message: "Processing failed" });
        }
    }))(req, res, next);
});
exports.default = router;
