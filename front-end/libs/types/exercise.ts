import { ReactNode } from "react";

export type Exercise = {
    id: string;
    name: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    icon: ReactNode;
    cta?: string;
};