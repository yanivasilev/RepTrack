import { Exercise } from "../types/exercise"
import PushupIcon from "../../assets/icons/pushup.svg";
import PlankIcon from "../../assets/icons/plank.svg";
import SquatIcon from "../../assets/icons/squat.svg";

export const EXERCISES: Exercise[] = [
    {
        id: "pushup",
        name: "Push-up",
        level: "Beginner",
        icon: <PushupIcon width={36} height={36} />,
        cta: "Select"
    },
    {
        id: "squat",
        name: "Squat",
        level: "Intermediate",
        icon: <SquatIcon width={36} height={36} />,
        cta: "Select"
    },
    {
        id: "plank",
        name: "Plank",
        level: "Advanced",
        icon: <PlankIcon width={36} height={36} />,
        cta: "Select"
    }
];