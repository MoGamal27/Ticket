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
exports.requireEmail = exports.verifyEmail = exports.signup = exports.resetPassword = exports.verifyCode = exports.forgetPassword = void 0;
exports.login = login;
const db_1 = require("../../models/db");
const schema_1 = require("../../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../../utils/auth");
const Errors_1 = require("../../Errors");
const response_1 = require("../../utils/response");
const sendEmails_1 = require("../../utils/sendEmails");
const BadRequest_1 = require("../../Errors/BadRequest");
const crypto_1 = require("crypto");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        const [user] = yield db_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, data.email));
        if (!user) {
            throw new Errors_1.UnauthorizedError("Invalid email or password");
        }
        if (!user.password) {
            throw new Errors_1.UnauthorizedError("Invalid email or password");
        }
        if (!user.isVerified) {
            throw new Errors_1.UnauthorizedError("Please Verify Email First");
        }
        const match = yield bcrypt_1.default.compare(data.password, user.password);
        if (!match) {
            throw new Errors_1.UnauthorizedError("Invalid email or password");
        }
        const token = (0, auth_1.generateToken)({
            id: user.id,
            roles: ["user"],
        });
        (0, response_1.SuccessResponse)(res, { message: "login Successful", token: token, user: {
                name: user.name,
                email: user.email,
                id: user.id,
            } }, 200);
    });
}
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const [user] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
    if (!user)
        throw new Errors_1.NotFound("User Not Found");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    yield db_1.db
        .delete(schema_1.emailVerifications)
        .where((0, drizzle_orm_1.eq)(schema_1.emailVerifications.userId, user.id));
    yield db_1.db.insert(schema_1.emailVerifications).values({ code, userId: user.id });
    yield (0, sendEmails_1.sendEmail)(email, "Password Reset Code", `Your reset code is: ${code}\nIt will expire in 2 hours.`);
    (0, response_1.SuccessResponse)(res, { message: "code sent succefully" }, 200);
});
exports.forgetPassword = forgetPassword;
const verifyCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code } = req.body;
    const [user] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
    if (!user)
        throw new Errors_1.NotFound("User not found");
    const [rowCode] = yield db_1.db
        .select()
        .from(schema_1.emailVerifications)
        .where((0, drizzle_orm_1.eq)(schema_1.emailVerifications.userId, user.id));
    if (!rowCode || rowCode.code !== code)
        throw new BadRequest_1.BadRequest("Invalid email or reset code");
    yield db_1.db
        .delete(schema_1.emailVerifications)
        .where((0, drizzle_orm_1.eq)(schema_1.emailVerifications.userId, user.id));
    (0, response_1.SuccessResponse)(res, { message: "Code verified successfully" }, 200);
});
exports.verifyCode = verifyCode;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    password = yield bcrypt_1.default.hash(password, 10);
    yield db_1.db.update(schema_1.users).set({ password }).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
    (0, response_1.SuccessResponse)(res, { message: "Password Updated Successfully" });
});
exports.resetPassword = resetPassword;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const [exsitUser] = yield db_1.db
        .select()
        .from(schema_1.users)
        .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.users.email, data.email), (0, drizzle_orm_1.eq)(schema_1.users.phoneNumber, data.phoneNumber)));
    if (exsitUser) {
        if (exsitUser.email === data.email)
            throw new Errors_1.ConflictError("Email is Aleardy Used");
        if (exsitUser.phoneNumber === data.phoneNumber)
            throw new Errors_1.ConflictError("Phone Number is Aleardy Used");
    }
    data.password = yield bcrypt_1.default.hash(data.password, 10);
    const [result] = yield db_1.db.insert(schema_1.users).values(data).$returningId();
    const code = (0, crypto_1.randomInt)(100000, 999999).toString();
    yield db_1.db.insert(schema_1.emailVerifications).values({
        userId: result.id,
        code,
    });
    yield (0, sendEmails_1.sendEmail)(data.email, "Email Verification", `Your verification code is ${code}`);
    (0, response_1.SuccessResponse)(res, { message: "User Signup Successfully Go Verify Email", userId: result.id }, 201);
});
exports.signup = signup;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, code } = req.body;
    const user = yield db_1.db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, userId),
    });
    if (!user)
        throw new Errors_1.NotFound("User not found");
    const record = yield db_1.db.query.emailVerifications.findFirst({
        where: (ev, { eq }) => eq(ev.userId, user.id),
    });
    if (!record || record.code !== code)
        throw new BadRequest_1.BadRequest("Invalid verification code");
    yield db_1.db.update(schema_1.users).set({ isVerified: true }).where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id));
    yield db_1.db
        .delete(schema_1.emailVerifications)
        .where((0, drizzle_orm_1.eq)(schema_1.emailVerifications.userId, user.id));
    res.json({ message: "Email verified successfully" });
});
exports.verifyEmail = verifyEmail;
const requireEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const [user] = yield db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
    if (!user || user.isVerified)
        throw new Errors_1.NotFound("User Not Found");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    yield db_1.db
        .delete(schema_1.emailVerifications)
        .where((0, drizzle_orm_1.eq)(schema_1.emailVerifications.userId, user.id));
    yield db_1.db.insert(schema_1.emailVerifications).values({ code, userId: user.id });
    yield (0, sendEmails_1.sendEmail)(email, "Password Reset Code", `Your reset code is: ${code}\nIt will expire in 2 hours.`);
    (0, response_1.SuccessResponse)(res, { message: "code sent succefully" }, 200);
});
exports.requireEmail = requireEmail;
