import { ExperienceLevel, FITNESS_GOALS, FitnessGoal, TrainingFrequency, TrainingStyle, UnitType } from "../../libs/catalogs/register";
import { request } from "./customApi/request";

export type ProfileDetailsApiResponse = {
    id: string;
    username: string;
    fitnessGoal: FitnessGoal;
    weight: number;
    age: number;
    heightUnitType: UnitType;
    weightUnitType: UnitType;
    experienceLevel: ExperienceLevel;
    trainingStyle: TrainingStyle;
    trainingFrequency: TrainingFrequency;
    avatarUrl: string;
};

export function profileDetailsApi() {
    return request<ProfileDetailsApiResponse>(
        {
            method: "GET",
            url: "/me",
        },
        "User details failed."
    );
}
