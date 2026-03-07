import type { Request, Response } from "express";
import { workoutStatsService } from "../../services/workouts/workout-stats";

export async function workoutStatsController(req: Request, res: Response) {
    const user = (req as any).user;

    const result = await workoutStatsService(user.id);

    return res.status(200).json(result);
}
