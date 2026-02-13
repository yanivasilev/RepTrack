import { submitForm } from "../../forms/submitForm";
import { validateEnum } from "../../forms/validations/validateEnum";
import { validateWeight } from "../../forms/validations/validateWeight";
import { EXPERIENCE_LEVEL, ExperienceLevel, FITNESS_GOALS, FitnessGoal, TRAINING_FREQUENCY, TRAINING_STYLE, TrainingFrequency, TrainingStyle, UNIT_TYPE, UnitType } from "../../libs/catalogs/register";
import { changeDetailsApi, ChangeDetailsPayload } from "../../services/api/settings/changeDetailsApi";


export type ChangeDetailsFormData = {
    weight: string;
    weightUnitType: UnitType;
    fitnessGoal: FitnessGoal | null;
    experienceLevel: ExperienceLevel | null;
    trainingStyle: TrainingStyle | null;
    trainingFrequency: TrainingFrequency | null;
};

type Fields = keyof ChangeDetailsFormData;

export async function SubmitChangeDetails({ data }: { data: ChangeDetailsFormData }) {
    return submitForm<ChangeDetailsFormData, Fields, { message?: string }>({
        data,
        validate: (d) => {
            const errors: Partial<Record<Fields, string>> = {};

            const weightToNumber = Number(d.weight);
            const weightError = validateWeight(weightToNumber, d.weightUnitType);
            if (weightError) errors.weight = weightError;

            const weightUnitTypeError = validateEnum(d.weightUnitType, UNIT_TYPE, "Weight unit");
            if (weightUnitTypeError) errors.weightUnitType = weightUnitTypeError;

            const fitnessGoalError = validateEnum(d.fitnessGoal, FITNESS_GOALS, "Fitness goal");
            if (fitnessGoalError) errors.fitnessGoal = fitnessGoalError;

            const experienceLevelError = validateEnum(d.experienceLevel, EXPERIENCE_LEVEL, "Experience level");
            if (experienceLevelError) errors.experienceLevel = experienceLevelError;

            const trainingStyleError = validateEnum(d.trainingStyle, TRAINING_STYLE, "Training style");
            if (trainingStyleError) errors.trainingStyle = trainingStyleError;

            const trainingFrequencyError = validateEnum(d.trainingFrequency, TRAINING_FREQUENCY, "Training frequency");
            if (trainingFrequencyError) errors.trainingFrequency = trainingFrequencyError;

            return Object.keys(errors).length ? errors : null;
        },
        apiCall: async (d) => {
            const payload: ChangeDetailsPayload = {
                weight: Number(d.weight),
                weightUnitType: d.weightUnitType,
                fitnessGoal: d.fitnessGoal!, // safe because validateEnum required it
                experienceLevel: d.experienceLevel!,
                trainingStyle: d.trainingStyle!,
                trainingFrequency: d.trainingFrequency!,
            };

            return changeDetailsApi(payload);
        },
        successMessage: (res) => res?.message ?? "Details changed successfully.",
        fallbackErrorMessage: "Change details failed.",
    });
}
