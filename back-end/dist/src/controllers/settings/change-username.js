"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUsernameController = changeUsernameController;
const change_username_1 = require("../../schemas/settings/change-username");
const change_username_2 = require("../../services/settings/change-username");
async function changeUsernameController(req, res) {
    const parsed = change_username_1.changeUsernameSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }
    const user = req.user;
    const result = await (0, change_username_2.changeUsernameService)(user.email, parsed.data);
    if (result.status === "cooldown")
        return res.status(403).json({ message: result.message });
    if (result.status === "bad_current")
        return res.status(400).json({ message: "New username must be different from your current one." });
    if (result.status === "taken")
        return res.status(409).json({ message: "Username is already taken." });
    return res.status(200).json({ message: "Username updated successfully." });
}
