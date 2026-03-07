import { BadgeType } from "./BadgeType";

export type Badge = {
    type: BadgeType;
    name: string;
    icon: string;
    weight?: number;
};
