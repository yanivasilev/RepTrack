"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const ipLimiter = (message) => (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 HOUR
    limit: 10, // MAX 10 REQUESTS PER IP PER HOUR
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_reqm, res) => {
        console.log("IP limit reached!");
        res.json(message);
    }
});
exports.ipLimiter = ipLimiter;
