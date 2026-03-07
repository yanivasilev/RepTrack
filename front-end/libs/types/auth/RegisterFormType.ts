import { UnitType } from '../common/UnitType';
import { FitnessGoal } from '../common/FitnessGoals';
import { ExperienceLevel } from '../common/ExperienceLevel';
import { TrainingStyle } from '../common/TrainingStyle';
import { TrainingFrequency } from '../common/TrainingFrequency';
import { Sex } from '../common/Sex';

export type RegisterFormType = {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    dob: Date | undefined;
    sex: Sex | null;
    height: number | null;
    heightUnitType: UnitType | null;
    weight: number | null;
    weightUnitType: UnitType | null;
    fitnessGoal: FitnessGoal | null;
    experienceLevel: ExperienceLevel | null;
    trainingStyle: TrainingStyle | null;
    trainingFrequency: TrainingFrequency | null;
};