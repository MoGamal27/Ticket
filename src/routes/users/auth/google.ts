import express from "express";
import passport from "passport";
import "../../../config/passport";
import { verifyGoogleToken } from "../../../config/passport";

const router = express.Router();

router.post( "/" , verifyGoogleToken)


export default router;