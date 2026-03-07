import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearWorkoutSession, loadWorkout, saveWorkout } from "../libs/storage/workoutSession";
import { WorkoutSessionType } from "../libs/types/workouts/WorkoutSessionType";
import { WorkoutSetType } from "../libs/types/workouts/WorkoutSetType";
import { addSet } from "../libs/utils/start-workout/addSet";
import { addExercise } from "../libs/utils/start-workout/addExercise";
import { WorkoutExerciseType } from "../libs/types/workouts/WorkoutExerciseType";
import { ExerciseType } from "../libs/types/common/exercises/ExerciseType";

export type WorkoutState = {
    session: WorkoutSessionType | null;
    start: () => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    reset: () => Promise<void>;
    getFinalMs: () => number | null;
    addExercise: (exerciseId: string, name: string, exerciseType: ExerciseType) => Promise<void>;
    removeExercise: (exerciseId: string) => Promise<void>;
    addSet: (workoutExerciseId: string) => Promise<void>;
    removeSet: (workoutExerciseId: string, setId: string) => Promise<void>;
    updateSet: (workoutExerciseId: string, setId: string, patch: { reps?: number; weight?: number }) => Promise<void>;
    reorderExercises: (nextExercises: WorkoutExerciseType[]) => Promise<void>;
    reorderSets: (workoutExerciseId: string, nextSets: WorkoutSetType[]) => Promise<void>;
    updateSessionNotes: (notes: string) => Promise<void>;
    updateExerciseNotes: (workoutExerciseId: string, notes: string) => Promise<void>;
    updateSetNotes: (workoutExerciseId: string, setId: string, notes: string) => Promise<void>;
};

const WorkoutContext = createContext<WorkoutState | null>(null);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<WorkoutSessionType | null>(null);

    useEffect(() => {
        loadWorkout().then(setSession);
    }, []);

    const workoutStates = useMemo<WorkoutState>(() => ({
        session,

        start: async () => {
            if (session?.status === "running") return;

            const fresh: WorkoutSessionType = {
                status: "running",
                workoutStartedAtMs: Date.now(),
                runningSinceMs: Date.now(),
                accumulatedMs: 0,
                exercises: []
            };

            setSession(fresh);
            await saveWorkout(fresh);
        },

        pause: async () => {
            if (!session || session.status !== "running") return;

            const now = Date.now();
            const paused: WorkoutSessionType = {
                ...session,
                status: "paused",
                accumulatedMs: session.accumulatedMs + (now - session.runningSinceMs),
            };

            setSession(paused);
            await saveWorkout(paused);
        },

        resume: async () => {
            if (!session || session.status !== "paused") return;

            const resumed: WorkoutSessionType = {
                ...session,
                status: "running",
                runningSinceMs: Date.now(),
            };

            setSession(resumed);
            await saveWorkout(resumed);
        },

        reset: async () => {
            setSession(null);
            await clearWorkoutSession();
        },

        getFinalMs: () => {
            if (!session) return null;

            const now = Date.now();
            const finalMs =
                session.status === "running"
                    ? session.accumulatedMs + (now - session.runningSinceMs)
                    : session.accumulatedMs;

            return finalMs;
        },

        addExercise: async (exerciseId, name, exerciseType) => {
            if (!session) return;

            const updated: WorkoutSessionType = {
                ...session,
                exercises: [...session.exercises, addExercise(exerciseId, name, exerciseType)],
            };

            setSession(updated);
            await saveWorkout(updated);
        },

        removeExercise: async (exerciseId) => {
            if (!session) return;

            const updated: WorkoutSessionType = {
                ...session,
                exercises: session.exercises.filter(
                    (ex) => ex.id !== exerciseId
                ),
            };

            setSession(updated);
            await saveWorkout(updated);
        },

        addSet: async (workoutExerciseId) => {
            if (!session) return;

            const updated: WorkoutSessionType = {
                ...session,
                exercises: session.exercises.map((ex) =>
                    ex.id === workoutExerciseId ? { ...ex, sets: [...ex.sets, addSet(ex.exerciseType)] } : ex
                ),
            };

            setSession(updated);
            await saveWorkout(updated);
        },

        removeSet: async (workoutExerciseId, setId) => {
            if (!session) return;

            const updated: WorkoutSessionType = {
                ...session,
                exercises: session.exercises.map((ex) =>
                    ex.id === workoutExerciseId
                        ? {
                            ...ex,
                            sets: ex.sets.filter((set) => set.id !== setId),
                        }
                        : ex
                ),
            };

            setSession(updated);
            await saveWorkout(updated);
        },

        updateSet: async (workoutExerciseId, setId, patch) => {
            if (!session) return;

            const updated: WorkoutSessionType = {
                ...session,
                exercises: session.exercises.map((ex) =>
                    ex.id !== workoutExerciseId
                        ? ex
                        : {
                            ...ex,
                            sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)),
                        }
                ),
            };

            setSession(updated);
            await saveWorkout(updated);
        },

        reorderExercises: async (nextExercises) => {
            if (!session) return;

            const updated: WorkoutSessionType = {
                ...session,
                exercises: nextExercises,
            };

            setSession(updated);
            await saveWorkout(updated);
        },

        reorderSets: async (workoutExerciseId, nextSets) => {
            if (!session) return;

            const updated: WorkoutSessionType = {
                ...session,
                exercises: session.exercises.map((ex) =>
                    ex.id === workoutExerciseId ? { ...ex, sets: nextSets } : ex
                ),
            };

            setSession(updated);
            await saveWorkout(updated);
        },

        updateSessionNotes: async (notes: string) => {
            if (!session) return;

            const updated: WorkoutSessionType = {
                ...session,
                notes: notes.trim() || undefined,
            };

            setSession(updated);
            await saveWorkout(updated);
        },

        updateExerciseNotes: async (workoutExerciseId: string, notes: string) => {
            if (!session) return;

            const trimmed = notes.trim();
            const nextNotes = trimmed.length ? trimmed : undefined;

            const updated: WorkoutSessionType = {
                ...session,
                exercises: session.exercises.map((ex) =>
                    String(ex.id) === String(workoutExerciseId) ? { ...ex, notes: nextNotes } : ex
                ),
            };

            setSession(updated);
            await saveWorkout(updated);
        },

        updateSetNotes: async (workoutExerciseId: string, setId: string, notes: string) => {
            if (!session) return;

            const trimmed = notes.trim();
            const nextNotes = trimmed.length ? trimmed : undefined;

            const updated: WorkoutSessionType = {
                ...session,
                exercises: session.exercises.map((ex) => {
                    if (String(ex.id) !== String(workoutExerciseId)) return ex;

                    return {
                        ...ex,
                        sets: ex.sets.map((s) =>
                            String(s.id) === String(setId) ? { ...s, notes: nextNotes } : s
                        ),
                    };
                }),
            };

            setSession(updated);
            await saveWorkout(updated);
        },

    }), [session]);

    return <WorkoutContext.Provider value={workoutStates}>{children}</WorkoutContext.Provider>;
}

export function useWorkout() {
    const v = useContext(WorkoutContext);
    if (!v) throw new Error("The app must be wrapped in <WorkoutProvider/>");
    return v;
}
