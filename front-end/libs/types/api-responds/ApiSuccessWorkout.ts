import { Badge } from "../badges/Badge";

export type ApiSuccessWorkout = {
    message?: string;
    workout: {
        id: number;
        startedAt: string;
        endedAt: string;
        durationSeconds: number;
    };
    newBadges: Badge[];
};
