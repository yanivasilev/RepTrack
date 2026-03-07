import bcrypt from "bcrypt";
import { prisma } from "../../db";
import { ExperienceLevel, FitnessGoal, Sex, TrainingFrequency, TrainingStyle, UnitType } from "../../../generated/prisma/enums";
import { emailVerificationService } from "./email-verification/email-verification";

export async function registerService(data: {
    email: string; username: string; password: string; confirmPassword: string; dob: Date; sex: Sex; height: number; weight: number; fitnessGoal: FitnessGoal; experienceLevel: ExperienceLevel;
    trainingStyle: TrainingStyle; trainingFrequency: TrainingFrequency; heightUnitType: UnitType; weightUnitType: UnitType;
}) {
    // CHECKS IF EMAIL IS TAKEN
    const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingEmail) return { status: "email_taken" as const };

    // CHECKS IF PASSWORDS MATCH
    if (data.password !== data.confirmPassword) return { status: "password_mismatch" as const };

    // CHECKS IF USERNAME IS TAKEN
    const existingUsername = await prisma.user.findUnique({ where: { username: data.username } });
    if (existingUsername) return { status: "username_taken" as const };

    // HASHES PASSWORD
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // CREATES USER IN THE DB
    await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            username: data.username,
            dob: data.dob,
            sex: data.sex,
            height: data.height,
            weight: data.weight,
            fitnessGoal: data.fitnessGoal,
            experienceLevel: data.experienceLevel,
            trainingStyle: data.trainingStyle,
            trainingFrequency: data.trainingFrequency,
            heightUnitType: data.heightUnitType,
            weightUnitType: data.weightUnitType
        },
    });

    // SENDS EMAIL VERIFICATION
    try {
        await emailVerificationService(data.email);
    } catch (error) {
        console.error("Failed to send verification email after register:", error);
    }

    return { status: "ok" as const };
}
