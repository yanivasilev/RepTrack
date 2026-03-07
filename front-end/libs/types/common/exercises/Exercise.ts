import { ExerciseType } from "./ExerciseType";
import { ExperienceLevel } from "../ExperienceLevel";

export type Exercise = {
    id: number;
    name: string;
    category: string;
    muscleGroup: string;
    equipment: string;
    isBodyweight: boolean;
    exerciseType: ExerciseType;
    experienceLevel: ExperienceLevel;
};