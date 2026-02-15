import { z } from "zod";

export const updateSetSchema = z
    .object({
        setNumber: z.number().int().positive().optional(),
        reps: z.number().int().min(0).max(500).optional(),
        weight: z.number().min(0).max(2000).optional(),
        durationSeconds: z.number().int().min(0).max(86400).optional(),
        distanceMeters: z.number().min(0).max(1_000_000).optional(),
        rpe: z.number().int().min(1).max(10).optional(),
        isWarmup: z.boolean().optional(),
        isFailure: z.boolean().optional(),

    })

    .refine(
        (v) =>
            v.setNumber !== undefined ||
            v.reps !== undefined ||
            v.weight !== undefined ||
            v.durationSeconds !== undefined ||
            v.distanceMeters !== undefined ||
            v.rpe !== undefined ||
            v.isWarmup !== undefined ||
            v.isFailure !== undefined,
        { message: "No changes detected.", path: ["_"] }
    )

    .superRefine((v, ctx) => {
        // ONLY VALIDATE STRENGTH AND CARDIO MIX IF METRICS ARE TRIED TO BE EDITED
        const touchingStrength = v.reps !== undefined || v.weight !== undefined;
        const touchingCardio = v.durationSeconds !== undefined || v.distanceMeters !== undefined;

        if (touchingStrength && touchingCardio) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Do not mix strength (reps/weight) with cardio (duration/distance) in the same set.",
                path: ["_"],
            });
        }

        // IF THEY SET WEIGHT IN UPDATE, REQUIRE REPS IN SAME UPDARE OR ALREADY EXISTS (SERVICE WILL ENFORCE)
        if (v.weight !== undefined && v.reps === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "If you update weight, make sure reps stays set too (strength set).",
                path: ["_"],
            });
        }

        // IF THEY SET FAILURE WHILE ALSO CARDIO STOP IT
        if (v.isFailure === true && touchingCardio) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "isFailure can only be used for strength sets.",
                path: ["_"],
            });
        }
    });
