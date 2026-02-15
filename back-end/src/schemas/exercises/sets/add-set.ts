import { z } from "zod";

export const addSetSchema = z.object({
    setNumber: z.number().int().positive().optional(),
    reps: z.number().int().min(0).max(500).optional(),
    weight: z.number().min(0).max(2000).optional(),
    durationSeconds: z.number().int().min(0).max(86400).optional(),
    distanceMeters: z.number().min(0).max(1_000_000).optional(),
    rpe: z.number().int().min(1).max(10).optional(),
    isWarmup: z.boolean().optional(),
    isFailure: z.boolean().optional()
})

    .superRefine((v, ctx) => {
        const hasStrength = v.reps !== undefined || v.weight !== undefined;
        const hasCardio = v.durationSeconds !== undefined || v.distanceMeters !== undefined;

        // CHECK IF THERE IS A SET METRIC
        if (!hasStrength && !hasCardio) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Provide either reps/weight (strength) or duration/distance (cardio).",
                path: ["_"], // could also be ["_"]
            });
            return;
        }

        // CHECK IF STRENGTH AND CARDIO ARE MIXED
        if (hasStrength && hasCardio) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Do not mix strength (reps/weight) with cardio (duration/distance) in the same set.",
                path: ["_"],
            });
            return;
        }

        // STRENGTH RULES
        if (hasStrength) {
            // REPS REQUIRED (WEIGHT ONLY SET INVALID)
            if (v.reps === undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Reps are required for a strength set.",
                    path: ["_"],
                });
            }

            // PREVENT CARDIO FIELDS FOR STRENGTH
            if (v.durationSeconds !== undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "durationSeconds is not allowed for a strength set.",
                    path: ["_"],
                });
            }
            if (v.distanceMeters !== undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "distanceMeters is not allowed for a strength set.",
                    path: ["_"],
                });
            }
        }

        // CARDIO RULES
        if (hasCardio) {
            // MUST HAVE AT LEAST DURATION/DISTANCE
            if (v.durationSeconds === undefined && v.distanceMeters === undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Provide durationSeconds and/or distanceMeters for a cardio set.",
                    path: ["_"],
                });
            }

            // PREVENT STRENGTH FIELDS FOR CARDIO
            if (v.reps !== undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "reps is not allowed for a cardio set.",
                    path: ["_"],
                });
            }
            if (v.weight !== undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "weight is not allowed for a cardio set.",
                    path: ["_"],
                });
            }

            // FAILURE CANNOT BE FOR A CARDIO SET
            if (v.isFailure === true) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "isFailure can only be used for strength sets.",
                    path: ["_"],
                });
            }
        }
    });