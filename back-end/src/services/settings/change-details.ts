import { ExperienceLevel, FitnessGoal, TrainingFrequency, TrainingStyle, UnitType } from "../../../generated/prisma/enums";
import { prisma } from "../../db";

export async function changeDetailsService(userId: number, data: { weight: number; weightUnitType: UnitType; heightUnitType: UnitType; fitnessGoal: FitnessGoal; experienceLevel: ExperienceLevel; trainingStyle: TrainingStyle; trainingFrequency: TrainingFrequency }) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            weight: true,
            weightUnitType: true,
            heightUnitType: true,
            fitnessGoal: true,
            experienceLevel: true,
            trainingStyle: true,
            trainingFrequency: true,
        },
    });

    // CHECKS IF USER EXISTS
    if (!user) return { status: "user_not_found" as const };

    const changes: Record<string, any> = {};

    if (data.weight !== user.weight) changes.weight = data.weight;
    if (data.fitnessGoal !== user.fitnessGoal) changes.fitnessGoal = data.fitnessGoal;
    if (data.experienceLevel !== user.experienceLevel) changes.experienceLevel = data.experienceLevel;
    if (data.trainingStyle !== user.trainingStyle) changes.trainingStyle = data.trainingStyle;
    if (data.trainingFrequency !== user.trainingFrequency) changes.trainingFrequency = data.trainingFrequency;
    if (data.weightUnitType !== user.weightUnitType) changes.weightUnitType = data.weightUnitType;
    if (data.heightUnitType !== user.heightUnitType) changes.heightUnitType = data.heightUnitType;

    // CHECKS IF THERE WERE ANY CHANGES
    if (Object.keys(changes).length === 0) return { status: "no_changes" as const };

    // UPDATES THE DB
    await prisma.user.update({
        where: { id: userId },
        data: changes,
    });

    return { status: "updated" as const };
}