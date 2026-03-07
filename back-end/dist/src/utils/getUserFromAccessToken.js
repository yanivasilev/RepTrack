"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromAccessToken = getUserFromAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getUserFromAccessToken(token) {
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof payload.sub !== "string")
            return null;
        if (typeof payload.email !== "string")
            return null;
        return { id: Number(payload.sub), email: payload.email };
    }
    catch {
        return null;
    }
}
