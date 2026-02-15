import type { Request, Response } from "express";
import { workoutHistorySchema } from "../../schemas/workouts/workout-history";
import { workoutHistoryService } from "../../services/workouts/workout-history";

export async function workoutHistoryController(req: Request, res: Response) {
    const user = (req as any).user;

    const parsed = workoutHistorySchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        });
    }

    const page = parsed.data.page ?? 1;
    const limit = parsed.data.limit ?? 10;
    const sort = parsed.data.sort ?? "latest";

    const result = await workoutHistoryService(user.id, {
        page,
        limit,
        from: parsed.data.from,
        to: parsed.data.to,
        sort,
    });

    return res.status(200).json(result);
}
