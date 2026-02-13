import { UnitType } from "../../../generated/prisma/enums";
import { prisma } from "../../db";

export async function changeDetailsService(email: string, data: {
    weight: number; weightUnitType: UnitType; fitnessGoal: any; experienceLevel: any;
    trainingStyle: any; trainingFrequency: any;
}) {
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            email: true,
            weight: true,
            weightUnitType: true,
            fitnessGoal: true,
            experienceLevel: true,
            trainingStyle: true,
            trainingFrequency: true,
        },
    });
    if (!user) return { status: "user_not_found" as const };

    const changes: Record<string, any> = {};

    if (data.weight !== user.weight) changes.weight = data.weight;
    if (data.fitnessGoal !== user.fitnessGoal) changes.fitnessGoal = data.fitnessGoal;
    if (data.experienceLevel !== user.experienceLevel) changes.experienceLevel = data.experienceLevel;
    if (data.trainingStyle !== user.trainingStyle) changes.trainingStyle = data.trainingStyle;
    if (data.trainingFrequency !== user.trainingFrequency) changes.trainingFrequency = data.trainingFrequency;
    if (data.weightUnitType !== user.weightUnitType) changes.weightUnitType = data.weightUnitType;

    if (Object.keys(changes).length === 0) {
        return { status: "no_changes" as const };
    }

    await prisma.user.update({
        where: { email },
        data: changes,
    });

    return { status: "updated" as const };
}