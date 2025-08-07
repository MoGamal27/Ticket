"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const schema_1 = require("../models/schema");
const db_1 = require("../models/db");
const drizzle_orm_1 = require("drizzle-orm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: "13659139511-ufbmiruhec9ihmctnd1e041mpfjvbhal.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://tickethub-tours.com/api/user/auth/google/callback",
}, (_accessToken, _refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    let [user] = yield db_1.db
        .select()
        .from(schema_1.users)
        .where((0, drizzle_orm_1.eq)(schema_1.users.email, ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || " "));
    if (user)
        return done(null, user);
    const newUserd = {
        email: (_e = (_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : "",
        name: (_g = (_f = profile.name) === null || _f === void 0 ? void 0 : _f.givenName) !== null && _g !== void 0 ? _g : "",
        password: null,
        phoneNumber: null,
    };
    const [nUser] = yield db_1.db.insert(schema_1.users).values(newUserd).$returningId();
    const [newUser] = yield db_1.db
        .select()
        .from(schema_1.users)
        .where((0, drizzle_orm_1.eq)(schema_1.users.id, nUser.id));
    return done(null, newUser);
})));
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID!,
//       clientSecret: process.env.FACEBOOK_APP_SECRET!,
//       callbackURL: "/auth/facebook/callback",
//       profileFields: ["id", "emails", "name"],
//     },
//     async (_accessToken, _refreshToken, profile, done) => {
//       // TODO: find or create user in your DB here
//       return done(null, profile);
//     }
//   )
// );
exports.default = passport_1.default;
