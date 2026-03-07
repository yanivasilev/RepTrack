"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideo = void 0;
const multer_1 = __importDefault(require("multer"));
exports.uploadVideo = (0, multer_1.default)({
    dest: "uploads/",
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});
