"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.avatarUrlFromFileName = avatarUrlFromFileName;
function avatarUrlFromFileName(req, avatarFileName) {
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/avatars`;
    return avatarFileName
        ? `${baseUrl}/${avatarFileName}`
        : `${baseUrl}/default-avatar.webp`;
}
