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
exports.verifyGoogleToken = void 0;
const express_1 = __importDefault(require("express"));
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../models/db"); // ملف اتصال drizzle
const schema_1 = require("../models/schema"); // جدول users
const drizzle_orm_1 = require("drizzle-orm");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const verifyGoogleToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, // لازم يطابق الـ Client ID بتاعك
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json({ success: false, message: "Invalid Google payload" });
        }
        const email = payload.email;
        const name = payload.name || "Unknown User";
        const googleId = payload.sub; // الـ Google unique ID
        // 🔍 check if user exists
        let user = yield db_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.googleId, googleId))
            .limit(1)
            .then((rows) => rows[0]);
        // ➕ create if not exists
        if (!user) {
            yield db_1.db.insert(schema_1.users).values({
                googleId,
                email,
                name,
                isVerified: true,
            });
            user = yield db_1.db
                .select()
                .from(schema_1.users)
                .where((0, drizzle_orm_1.eq)(schema_1.users.googleId, googleId))
                .limit(1)
                .then((rows) => rows[0]);
        }
        // 🔑 Generate JWT
        const authToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return res.json({
            success: true,
            token: authToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Google login error:", error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
});
exports.verifyGoogleToken = verifyGoogleToken;
