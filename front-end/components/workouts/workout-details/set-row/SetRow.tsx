import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";
import { WorkoutDetailsSetType } from "../../../../libs/types/workouts/workout-details/WorkoutDetailsSetType";
import { PencilSquareIcon } from "react-native-heroicons/outline";
import Input from "../../../inputs/Input";
import { secondsToDigits } from "../../../../libs/helpers/time/secondsToDigits";
import { formatDigitsToTime } from "../../../../libs/helpers/time/formatDigitsToTime";
import { UnitType } from "../../../../libs/types/common/UnitType";
import { convertWeight } from "../../../../libs/helpers/convertWeight";

type SetRowProps = {
    set: WorkoutDetailsSetType;
    weightUnitType: UnitType;
    onOpenNotes: (title: string, notes?: string | null) => void;
};

function formatDisplayWeight(weightKg: number | undefined, weightUnitType: UnitType): string {
    if (weightKg == null) return "";
    const display = weightUnitType === "IMPERIAL"
        ? convertWeight(weightKg, "METRIC", "IMPERIAL")
        : weightKg;

    return Number(display.toFixed(2)).toString();
}

export function SetRow({ set, weightUnitType, onOpenNotes }: SetRowProps) {

    return (
        <View style={styles.card}>
            <View style={styles.cardTop}>
                {/* SETS INDEX */}
                <Text style={styles.setIndexText}>{`SET ${set.setNumber}`}</Text>

                <View style={styles.cardButtons}>
                    {/* EDIT BUTTON */}
                    {set.notes != null && (
                        <Pressable onPress={() => onOpenNotes(`SET ${set.setNumber} NOTES`, set.notes)}   >
                            <PencilSquareIcon size={24} color="blue" strokeWidth={3} />
                        </Pressable>
                    )}
                </View>
            </View>

            {/* SET */}
            <View style={styles.setContent}>
                {!set.durationSeconds ? (
                    <View style={{ flex: 1 }}>

                        {/* REPS */}
                        <Input
                            label="Reps"
                            placeholder="reps"
                            editable={false}
                            value={set?.reps?.toString()}
                        />
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>

                        {/* DURATION */}
                        <Input
                            label="Duration"
                            placeholder="hh:mm:ss"
                            editable={false}
                            value={formatDigitsToTime(secondsToDigits(set.durationSeconds))}
                        />
                    </View>
                )}

                <View style={{ flex: 1 }}>

                    {/* WEIGHT */}
                    <Input
                        label={`Weight (${weightUnitType === "IMPERIAL" ? "LB" : "KG"})`}
                        placeholder="weight"
                        editable={false}
                        value={formatDisplayWeight(set.weight, weightUnitType)}
                    />
                </View>
            </View>
        </View>
    );
}
