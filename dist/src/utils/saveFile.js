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
exports.saveFile = saveFile;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
function saveFile(base64, medicalId, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const matches = base64.match(/^data:(.+?);base64,(.+)$/);
        if (!matches)
            throw new Error("Invalid base64 format");
        const mimeType = matches[1];
        const isImage = mimeType.startsWith('image/');
        const extension = isImage ? mimeType.split('/')[1] : 'pdf'; // Default to PDF for files
        const filename = `${medicalId}-${Date.now()}.${extension}`;
        const folder = path_1.default.join(__dirname, '../../uploads/medical');
        yield promises_1.default.mkdir(folder, { recursive: true });
        const filePath = path_1.default.join(folder, filename);
        yield promises_1.default.writeFile(filePath, Buffer.from(matches[2], 'base64'));
        return {
            url: `${req.protocol}://${req.get('host')}/medical-docs/${filename}`,
            type: isImage ? 'image' : 'file'
        };
    });
}
