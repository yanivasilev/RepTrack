import crypto from "crypto";

export function generateForgotPasswordToken(token: string) {
    const tokenHash = crypto.createHash("sha256").update(`${token}:${process.env.FP_TOKEN_SECRET}`).digest("hex");

    return tokenHash;
}