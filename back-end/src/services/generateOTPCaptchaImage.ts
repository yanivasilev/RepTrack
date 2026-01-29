import { Captcha } from "captcha-canvas";
import { randomInt } from "crypto";

export async function generateOTPCaptchaImage(otp: string): Promise<Buffer> {
    const captcha = new Captcha(220, 90);

    captcha.async = false;
    captcha.addDecoy({
        color: "#6b7280",
        font: "Arial",
        size: randomInt(18, 30),
        opacity: 0.18,
        total: randomInt(30, 70),
    });

    const traceCount = randomInt(1, 3);
    for (let i = 0; i < traceCount; i++) {
        captcha.drawTrace({
            color: i === 0 ? "#111827" : "#dc2626",
            size: randomInt(1, 3),
            opacity: 0.35,
        });
    }

    captcha.drawCaptcha({ text: otp });

    const png = await captcha.png;
    return png;
}