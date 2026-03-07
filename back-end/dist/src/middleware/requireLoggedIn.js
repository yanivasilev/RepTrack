"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireLoggedIn = requireLoggedIn;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireLoggedIn(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
        return res.status(401).json({ message: "You must be logged in." });
    const accessToken = header.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ message: "Server misconfiguration." });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(accessToken, secret);
        req.user = {
            id: Number(payload.sub),
            email: String(payload.email),
        };
        return next();
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired access token." });
    }
}
