import { ExperienceLevel, FitnessGoal, TrainingFrequency, TrainingStyle, UnitType } from "../../../libs/catalogs/register";
import { request } from "../customApi/request";

export type RegisterPayload = {
    email: string;
    confirmPassword: string;
    password: string;
    username: string;
    dob: Date | undefined
    sex: "MALE" | "FEMALE" | null
    height: number | null;
    weight: number | null;
    fitnessGoal: FitnessGoal | null;
    experienceLevel: ExperienceLevel | null;
    trainingStyle: TrainingStyle | null;
    trainingFrequency: TrainingFrequency | null;
    heightUnitType: UnitType | null;
    weightUnitType: UnitType | null;
};

export type RegisterApiSuccess = {
    message?: string;
};

export function RegisterApi(payload: RegisterPayload) {
    return request<RegisterApiSuccess>(
        {
            method: "POST",
            url: "/auth/register",
            data: payload,
        },
        "Register failed."
    );
}
