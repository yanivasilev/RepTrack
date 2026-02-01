import crypto from "crypto";

export function verifyOTP(inputOtp: string, storedOtpHash: string) {
    const inputHash = crypto.createHash("sha256")
        .update(`${inputOtp}:${process.env.OTP_SECRET}`)
        .digest("hex");

    const bufferInputOtp = Buffer.from(inputHash, 'hex');
    const bufferStoredOtp = Buffer.from(storedOtpHash, 'hex');

    return crypto.timingSafeEqual(bufferInputOtp, bufferStoredOtp);
}