import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkoutSessionType } from "../types/workouts/WorkoutSessionType";

const KEY = "workoutSession";

export async function loadWorkout(): Promise<WorkoutSessionType | null> {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as any;
    const legacyStartedAt =
        typeof parsed?.startedAt === "number"
            ? parsed.startedAt
            : Date.now();

    const session: WorkoutSessionType = {
        ...parsed,
        workoutStartedAtMs:
            typeof parsed?.workoutStartedAtMs === "number"
                ? parsed.workoutStartedAtMs
                : legacyStartedAt,
        runningSinceMs:
            typeof parsed?.runningSinceMs === "number"
                ? parsed.runningSinceMs
                : legacyStartedAt,
    };

    return session;
}

export async function saveWorkout(session: WorkoutSessionType | null) {
    if (!session) {
        await AsyncStorage.removeItem(KEY);
        return;
    }

    await AsyncStorage.setItem(KEY, JSON.stringify(session));
}

export function getElapsedMs(session: WorkoutSessionType, now = Date.now()) {
    return session.status === "running"
        ? session.accumulatedMs + (now - session.runningSinceMs)
        : session.accumulatedMs;
}

export async function clearWorkoutSession() {
    await AsyncStorage.removeItem(KEY);
}
