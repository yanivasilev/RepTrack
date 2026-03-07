"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileController = getProfileController;
const avatarUrlFromFileName_1 = require("../../utils/avatarUrlFromFileName");
const get_profile_1 = require("../../services/profiles/get-profile");
async function getProfileController(req, res) {
    const user = req.user;
    const result = await (0, get_profile_1.getProfileService)(user.id);
    if (result.status === "not_found")
        return res.status(404).json({ message: "User not found." });
    const { avatarFileName, ...safe } = result;
    return res.status(200).json({
        ...safe,
        avatarUrl: (0, avatarUrlFromFileName_1.avatarUrlFromFileName)(req, result.avatarFileName),
    });
}
