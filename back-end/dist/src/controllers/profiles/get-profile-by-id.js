"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileByIdController = getProfileByIdController;
const avatarUrlFromFileName_1 = require("../../utils/avatarUrlFromFileName");
const get_profile_by_id_1 = require("../../services/profiles/get-profile-by-id");
async function getProfileByIdController(req, res) {
    const user = req.user;
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId) || userId <= 0)
        return res.status(400).json({ message: "User ID is invalid." });
    const result = await (0, get_profile_by_id_1.getProfileByIdService)(user.id, userId);
    if (result.status === "not_found")
        return res.status(404).json({ message: "User not found." });
    const { avatarFileName, ...safe } = result;
    return res.status(200).json({
        ...safe,
        avatarUrl: (0, avatarUrlFromFileName_1.avatarUrlFromFileName)(req, result.avatarFileName),
    });
}
