import type { Request, Response } from "express";
import { createThreadSchema } from "../../schemas/threads/create-thread";
import { createThreadService } from "../../services/threads/create-thread";

export async function createThreadController(req: Request, res: Response) {
    const user = (req as any).user;

    const parsed = createThreadSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const thread = await createThreadService(user, parsed.data);

    return res.status(201).json({ message: "Thread created successfully.", thread });
}
