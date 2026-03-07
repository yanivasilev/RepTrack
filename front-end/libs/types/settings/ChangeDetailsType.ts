import { UnitType } from "../common/UnitType";
import { FitnessGoal } from "../common/FitnessGoals";
import { ExperienceLevel } from "../common/ExperienceLevel";
import { TrainingStyle } from "../common/TrainingStyle";
import { TrainingFrequency } from "../common/TrainingFrequency";

export type ChangeDetailsType = {
    weight: number;
    weightUnitType: UnitType;
    heightUnitType: UnitType;
    fitnessGoal: FitnessGoal | null;
    experienceLevel: ExperienceLevel | null;
    trainingStyle: TrainingStyle | null;
    trainingFrequency: TrainingFrequency | null;
};