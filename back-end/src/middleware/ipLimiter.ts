import rateLimit from "express-rate-limit";

export const ipLimiter = (message: string) => rateLimit({
    windowMs: 60 * 60 * 1000, // 1 HOUR
    limit: 10, // MAX 10 REQUESTS PER IP PER HOUR
    standardHeaders: true,
    legacyHeaders: false,

    handler: (_reqm, res) => {
        console.log("IP limit reached!");
        res.json(message);
    }
})