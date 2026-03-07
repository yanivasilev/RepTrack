"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
const node_crypto_1 = require("node:crypto");
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
function generateOtp(length = 6) {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += CHARS[(0, node_crypto_1.randomInt)(0, CHARS.length)];
    }
    return otp;
}
