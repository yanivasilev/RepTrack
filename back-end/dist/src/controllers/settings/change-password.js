"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordController = changePasswordController;
const change_password_1 = require("../../schemas/settings/change-password");
const change_password_2 = require("../../services/settings/change-password");
async function changePasswordController(req, res) {
    const parsed = change_password_1.changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }
    const user = req.user;
    const result = await (0, change_password_2.changePasswordService)(user.email, parsed.data);
    if (result.status === "user_not_found")
        return res.status(401).json({ message: "User not found." });
    if (result.status === "bad_current")
        return res.status(404).json({ message: "Current password is invalid." });
    if (result.status === "mismatch")
        return res.status(400).json({ message: "New password and new confirm password must match." });
    if (result.status === "same")
        return res.status(400).json({ message: "New password must be different from current password." });
    return res.status(200).json({ message: "Password updated successfully." });
}
