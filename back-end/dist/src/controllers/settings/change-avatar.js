"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeAvatarController = changeAvatarController;
const change_avatar_1 = require("../../schemas/settings/change-avatar");
const change_avatar_2 = require("../../services/settings/change-avatar");
async function changeAvatarController(req, res) {
    const user = req.user;
    if (!req.file) {
        return res.status(400).json({ message: "Missing file." });
    }
    const parsed = change_avatar_1.changeAvatarSchema.safeParse(req.file);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }
    const newFilename = req.file.filename;
    await (0, change_avatar_2.changeAvatarService)(user, newFilename);
    return res.status(200).json({ message: "Avatar updated successfully." });
}
