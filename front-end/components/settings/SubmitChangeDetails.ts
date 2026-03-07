import { submitForm } from "../../forms/submitForm";
import { validateEnum } from "../../forms/validations/validateEnum";
import { validateWeight } from "../../forms/validations/validateWeight";
import { EXPERIENCE_LEVEL } from "../../libs/types/common/ExperienceLevel";
import { FITNESS_GOALS } from "../../libs/types/common/FitnessGoals";
import { ChangeDetailsType } from "../../libs/types/settings/ChangeDetailsType";
import { TRAINING_FREQUENCY } from "../../libs/types/common/TrainingFrequency";
import { TRAINING_STYLE } from "../../libs/types/common/TrainingStyle";
import { UNIT_TYPE } from "../../libs/types/common/UnitType";
import { changeDetailsApi } from "../../services/api/settings/changeDetailsApi";
import { convertWeight } from "../../libs/helpers/convertWeight";

type Fields = keyof ChangeDetailsType;

export async function SubmitChangeDetails({ data }: { data: ChangeDetailsType }) {
    return submitForm<ChangeDetailsType, Fields, { message?: string }>({
        data,
        validate: (d) => {
            const errors: Partial<Record<Fields, string>> = {};

            const weightError = validateWeight(d.weight, d.weightUnitType);
            if (weightError) errors.weight = weightError;

            const weightUnitTypeError = validateEnum(d.weightUnitType, UNIT_TYPE, "Weight unit");
            if (weightUnitTypeError) errors.weightUnitType = weightUnitTypeError;

            const heightUnitTypeError = validateEnum(d.heightUnitType, UNIT_TYPE, "Height unit");
            if (heightUnitTypeError) errors.heightUnitType = heightUnitTypeError;

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
            const normalizedWeight = Math.round(
                convertWeight(
                    d.weight,
                    d.weightUnitType === "IMPERIAL" ? "IMPERIAL" : "METRIC",
                    "METRIC"
                )
            );

            return changeDetailsApi({
                ...d,
                weight: normalizedWeight,
            });
        },
        successMessage: (res) => res?.message ?? "Details changed successfully.",
        fallbackErrorMessage: "Change details failed.",
    });
}
