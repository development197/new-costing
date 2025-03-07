"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
exports.uploadFiles = upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'portfolio', maxCount: 1 },
]);
//# sourceMappingURL=fileUploadService.js.map