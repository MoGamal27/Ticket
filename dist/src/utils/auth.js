"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const Errors_1 = require("../Errors");
dotenv_1.default.config();
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return {
            id: decoded.id,
            roles: decoded.roles,
        };
    }
    catch (error) {
        throw new Errors_1.UnauthorizedError("Invalid token");
    }
};
exports.verifyToken = verifyToken;
