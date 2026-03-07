"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = loginController;
const login_1 = require("../../schemas/auth/login");
const login_2 = require("../../services/auth/login");
async function loginController(req, res) {
    const parsed = login_1.loginSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }
    const result = await (0, login_2.loginService)(parsed.data);
    if (result.status === "invalid") {
        return res.status(401).json({ message: "Email or password is invalid." });
    }
    if (result.status === "email_not_verified") {
        return res.status(403).json({
            message: "You need to verify your email before logging in.",
            code: "EMAIL_NOT_VERIFIED",
        });
    }
    if (result.status === "server_error") {
        return res.status(500).json({ message: "Access token was not generated." });
    }
    return res.json({ accessToken: result.accessToken });
}
