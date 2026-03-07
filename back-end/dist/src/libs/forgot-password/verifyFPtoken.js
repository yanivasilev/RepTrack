"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyFPtoken = verifyFPtoken;
const crypto_1 = __importDefault(require("crypto"));
function verifyFPtoken(inputToken, storedTokenHash) {
    const inputHash = crypto_1.default.createHash("sha256")
        .update(`${inputToken}:${process.env.FP_TOKEN_SECRET}`)
        .digest("hex");
    const bufferInputToken = Buffer.from(inputHash, 'hex');
    const bufferStoredToken = Buffer.from(storedTokenHash, 'hex');
    if (bufferInputToken.length !== bufferStoredToken.length) {
        return false;
    }
    return crypto_1.default.timingSafeEqual(bufferInputToken, bufferStoredToken);
}
