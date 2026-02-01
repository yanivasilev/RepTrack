import { randomInt } from "node:crypto";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";

export function generateOTP(length = 6): string {
    let otp = "";

    for (let i = 0; i < length; i++) {
        otp += CHARS[randomInt(0, CHARS.length)];
    }

    return otp;
}