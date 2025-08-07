"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const timeZone_1 = require("./utils/timeZone");
const errorHandler_1 = require("./middlewares/errorHandler");
const Errors_1 = require("./Errors");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "20mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "20mb" }));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use((0, compression_1.default)());
app.use(passport_1.default.initialize());
app.get("/api/test", (req, res, next) => {
    res.json({ message: "API is working! new2" });
});
app.use("/api", routes_1.default);
app.use((req, res, next) => {
    throw new Errors_1.NotFound("route not found");
});
app.use(errorHandler_1.errorHandler);
// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT} [${(0, timeZone_1.getCurrentEgyptTime)()}]`);
});
