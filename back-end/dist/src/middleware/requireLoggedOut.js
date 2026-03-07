"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireLoggedOut = requireLoggedOut;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireLoggedOut(req, res, next) {
    const header = req.headers.authorization;
    // Check if there is a token
    if (!header?.startsWith("Bearer "))
        return next();
    const accessToken = header.slice("Bearer ".length);
    try {
        // Check if token is valid
        jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        return res.status(403).json("You are already logged in.");
    }
    catch {
        // Token invalid or expired
        return next();
    }
}
