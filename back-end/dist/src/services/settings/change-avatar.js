"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeAvatarService = changeAvatarService;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const db_1 = require("../../db");
const AVATAR_DIR = path_1.default.join(process.cwd(), "public", "uploads", "avatars");
async function changeAvatarService(user, newFilename) {
    const oldFilename = user.avatarFileName ?? null;
    // UPDATE AVATAR IN DB
    await db_1.prisma.user.update({
        where: { email: user.email },
        data: { avatarFileName: newFilename },
    });
    // DELETE OLD AVATAR FILE
    if (oldFilename && oldFilename !== newFilename) {
        await promises_1.default.unlink(path_1.default.join(AVATAR_DIR, oldFilename)).catch(() => { });
    }
    return { oldFilename };
}
