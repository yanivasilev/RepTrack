import { prisma } from "../../db";

export async function createThreadService(userId: number, data: { title: string, body: string }) {
    // CREATES THREAD IN THE DB
    const thread = await prisma.thread.create({
        data: {
            title: data.title,
            body: data.body,
            authorId: userId,
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
