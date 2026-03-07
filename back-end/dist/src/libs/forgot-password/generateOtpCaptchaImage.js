"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtpCaptchaImage = generateOtpCaptchaImage;
const captcha_canvas_1 = require("captcha-canvas");
const crypto_1 = require("crypto");
async function generateOtpCaptchaImage(otp) {
    const captcha = new captcha_canvas_1.Captcha(300, 100);
    captcha.async = false;
    captcha.addDecoy({
        color: "#6b7280",
        font: "Arial",
        size: (0, crypto_1.randomInt)(18, 30),
        opacity: 0.18,
        total: (0, crypto_1.randomInt)(30, 70),
    });
    const traceCount = (0, crypto_1.randomInt)(1, 3);
    for (let i = 0; i < traceCount; i++) {
        captcha.drawTrace({
            color: i === 0 ? "#111827" : "#dc2626",
            size: (0, crypto_1.randomInt)(1, 3),
            opacity: 0.35,
        });
    }
    captcha.drawCaptcha({ text: otp });
    const png = await captcha.png;
    return png;
}
