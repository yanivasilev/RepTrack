import { ExperienceLevel } from "../common/ExperienceLevel";
import { FitnessGoal } from "../common/FitnessGoals";
import { TrainingFrequency } from "../common/TrainingFrequency";
import { TrainingStyle } from "../common/TrainingStyle";
import { UnitType } from "../common/UnitType";
import { UserBadge } from "../badges/UserBadge";

export type ProfileDetailsType = {
    id: number;
    username: string;
    fitnessGoal: FitnessGoal;
    weight: number;
    age: number;
    heightUnitType: UnitType;
    weightUnitType: UnitType;
    experienceLevel: ExperienceLevel;
    trainingStyle: TrainingStyle;
    trainingFrequency: TrainingFrequency;
    avatarFileName: string;
    badges: UserBadge[];
};
