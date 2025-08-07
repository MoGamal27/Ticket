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
exports.saveBase64Image = saveBase64Image;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
function saveBase64Image(base64, userId, req, folder // new param
) {
    return __awaiter(this, void 0, void 0, function* () {
        const matches = base64.match(/^data:(.+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error("Invalid base64 format");
        }
        const ext = matches[1].split("/")[1];
        const buffer = Buffer.from(matches[2], "base64");
        const fileName = `${userId}.${ext}`;
        const uploadsDir = path_1.default.join(__dirname, "../..", "uploads", folder);
        // Create folder if it doesn't exist
        try {
            yield promises_1.default.mkdir(uploadsDir, { recursive: true });
        }
        catch (err) {
            console.error("Failed to create directory:", err);
            throw err;
        }
        const filePath = path_1.default.join(uploadsDir, fileName);
        try {
            yield promises_1.default.writeFile(filePath, buffer);
        }
        catch (err) {
            console.error("Failed to write image file:", err);
            throw err;
        }
        // Return full URL
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${folder}/${fileName}`;
        return imageUrl;
    });
}
