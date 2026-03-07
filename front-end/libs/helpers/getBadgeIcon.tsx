import ClockBadge from "../../components/badges/ClockBadge";
import DumbellBadge from "../../components/badges/DumbellBadge";
import FireBadge from "../../components/badges/FireBadge";
import TrophyBadge from "../../components/badges/TrophyBadge";

export function getBadgeIcon(icon: string, label: string, size: number) {
    const iconLowercase = icon.toLowerCase();

    if (iconLowercase.includes("clock")) return <ClockBadge label={label} size={size} />;
    if (iconLowercase.includes("fire")) return <FireBadge label={label} size={size} />;
    if (iconLowercase.includes("bolt") || iconLowercase.includes("dumb")) return <DumbellBadge label={label} size={size} />;

    return <TrophyBadge label={label} size={size} />;
}