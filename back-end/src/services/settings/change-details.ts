import { UnitType } from "../../../generated/prisma/enums";
import { prisma } from "../../db";

export async function changeDetailsService(
    user: { email: string; weight: number; fitnessGoal: any; experienceLevel: any; trainingStyle: any; trainingFrequency: any, weightUnitType: UnitType },
    data: { weight: number; fitnessGoal: any; experienceLevel: any; trainingStyle: any; trainingFrequency: any, weightUnitType: UnitType }
) {
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
        where: { email: user.email },
        data: changes,
    });

    return { status: "updated" as const };
}
