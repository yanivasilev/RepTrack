import crypto from "crypto";

export function verifyFPtoken(inputToken: string, storedTokenHash: string) {
    const inputHash = crypto.createHash("sha256")
        .update(`${inputToken}:${process.env.FP_TOKEN_SECRET}`)
        .digest("hex");

    const bufferInputToken = Buffer.from(inputHash, 'hex');
    const bufferStoredToken = Buffer.from(storedTokenHash, 'hex');

    if (bufferInputToken.length !== bufferStoredToken.length) {
        return false;
    }

    return crypto.timingSafeEqual(bufferInputToken, bufferStoredToken);
}