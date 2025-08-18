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
exports.upload = void 0;
exports.saveFile = saveFile;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const multer_1 = __importDefault(require("multer"));
// Configure multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const folder = path_1.default.join(__dirname, '../../uploads/medical');
        promises_1.default.mkdir(folder, { recursive: true }).then(() => {
            cb(null, folder);
        }).catch(err => {
            cb(err, folder);
        });
    },
    filename: (req, file, cb) => {
        const medicalId = req.body.medicalId || req.params.medicalId;
        const extension = file.mimetype.startsWith('image/')
            ? file.mimetype.split('/')[1]
            : 'pdf';
        const filename = `${medicalId}-${Date.now()}.${extension}`;
        cb(null, filename);
    }
});
exports.upload = (0, multer_1.default)({ storage });
function saveFile(file, medicalId, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const isImage = file.mimetype.startsWith('image/');
        return {
            url: `${req.protocol}://${req.get('host')}/uploads/medical/${file.filename}`,
            type: isImage ? 'image' : 'file'
        };
    });
}
