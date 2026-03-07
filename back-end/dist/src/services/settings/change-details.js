"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeDetailsService = changeDetailsService;
const db_1 = require("../../db");
async function changeDetailsService(email, data) {
    const user = await db_1.prisma.user.findUnique({
        where: { email },
        select: {
            email: true,
            weight: true,
            weightUnitType: true,
            heightUnitType: true,
            fitnessGoal: true,
            experienceLevel: true,
            trainingStyle: true,
            trainingFrequency: true,
        },
    });
    if (!user)
        return { status: "user_not_found" };
    const changes = {};
    if (data.weight !== user.weight)
        changes.weight = data.weight;
    if (data.fitnessGoal !== user.fitnessGoal)
        changes.fitnessGoal = data.fitnessGoal;
    if (data.experienceLevel !== user.experienceLevel)
        changes.experienceLevel = data.experienceLevel;
    if (data.trainingStyle !== user.trainingStyle)
        changes.trainingStyle = data.trainingStyle;
    if (data.trainingFrequency !== user.trainingFrequency)
        changes.trainingFrequency = data.trainingFrequency;
    if (data.weightUnitType !== user.weightUnitType)
        changes.weightUnitType = data.weightUnitType;
    if (data.heightUnitType !== user.heightUnitType)
        changes.heightUnitType = data.heightUnitType;
    if (Object.keys(changes).length === 0) {
        return { status: "no_changes" };
    }
    await db_1.prisma.user.update({
        where: { email },
        data: changes,
    });
    return { status: "updated" };
}
