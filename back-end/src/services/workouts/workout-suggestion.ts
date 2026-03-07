import { ExerciseType } from "../../../generated/prisma/enums";
import { prisma } from "../../db";
import { buildHistory } from "../../utils/workout-suggestion/buildHistory";
import { buildSuggestion } from "../../utils/workout-suggestion/buildSuggestion";
import { HistoryItem } from "../../utils/workout-suggestion/types/HistoryItem";
import { Suggestion } from "../../utils/workout-suggestion/types/Suggestion";

const LOOKBACK_EXERCISE_SESSIONS = 3;

function toOneDecimal(value: number) {
    return Math.round(value * 10) / 10;
}

export async function workoutSuggestionService(userId: number, opts: { exerciseId: number }) {
    const exercise = await prisma.exercise.findUnique({
        where: { id: opts.exerciseId },
        select: {
            id: true,
            name: true,
            exerciseType: true,
        },
    });

    // CHECKS IF EXERCISE EXISTS
    if (!exercise) return { status: "exercise_not_found" as const };

    // GETS EXERCISES SETS
    const rows = await prisma.workoutSession.findMany({
        where: {
            userId,
            exercises: {
                some: { exerciseId: opts.exerciseId },
            },
        },
        orderBy: [{ startedAt: "desc" }, { id: "desc" }],
        take: LOOKBACK_EXERCISE_SESSIONS,
        select: {
            exercises: {
                where: { exerciseId: opts.exerciseId },
                select: {
                    sets: {
                        select: {
                            reps: true,
                            weight: true,
                            durationSeconds: true,
                        },
                    },
                },
            },
        },
    });

    const history: HistoryItem[] = buildHistory(rows, toOneDecimal);

    // IF NONE RETURN NOTHING
    if (history.length === 0) return { status: "ok" as const, suggestion: null };

    // IF SOMETHING FOUND GENERATE A SUGGESTION
    const suggestion: Suggestion | null = buildSuggestion(exercise.exerciseType as ExerciseType, history, toOneDecimal);

    return { status: "ok" as const, suggestion };
}
