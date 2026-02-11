import { ExperienceLevel, FitnessGoal, TrainingFrequency, TrainingStyle, UnitType } from "../../../libs/catalogs/register";
import { request } from "../customApi/request";

export type ChangeDetailsPayload = {
    weight: number;
    weightUnitType: UnitType;
    fitnessGoal: FitnessGoal;
    experienceLevel: ExperienceLevel;
    trainingStyle: TrainingStyle;
    trainingFrequency: TrainingFrequency;
};

export type ChangeDetailsApiSuccess = {
    message?: string;
};

export function changeDetailsApi(payload: ChangeDetailsPayload) {
    return request<ChangeDetailsApiSuccess>(
        {
            method: "PUT",
            url: "/settings/change-details",
            data: payload,
        },
        "Change details failed."
    );
}
