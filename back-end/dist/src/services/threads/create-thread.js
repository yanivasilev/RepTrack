"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createThreadService = createThreadService;
const db_1 = require("../../db");
async function createThreadService(user, data) {
    const thread = await db_1.prisma.thread.create({
        data: {
            title: data.title,
            body: data.body,
            authorId: user.id,
        },
        select: {
            id: true,
            title: true,
            body: true,
            createdAt: true,
        },
    });
    return thread;
}
