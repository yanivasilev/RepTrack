import { prisma } from "../../db";

export async function createThreadService(user: { id: number; }, data: { title: string, body: string }) {
    const thread = await prisma.thread.create({
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
