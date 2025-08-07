import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getCurrentEgyptTime } from "./utils/timeZone";
import { errorHandler } from "./middlewares/errorHandler";
import { NotFound } from "./Errors";
import helmet from "helmet";
import compression from "compression";
import passport from "passport";
import cookieParser from "cookie-parser";
import AppRoute from "./routes";
import path from "path";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(
  cors({
    origin: "*",
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(compression());
app.use(passport.initialize());
app.get("/api/test", (req, res, next) => {
  res.json({ message: "API is working! new2" });
});
app.use("/api", AppRoute);
app.use((req, res, next) => {
  throw new NotFound("route not found");
});
app.use(errorHandler);
// Start server
app.listen(PORT, () => {
  console.log(
    `✅ Server running on http://localhost:${PORT} [${getCurrentEgyptTime()}]`
  );
});
