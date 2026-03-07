import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { MinusCircleIcon, PencilSquareIcon } from "react-native-heroicons/outline";
import Input from "../../../../inputs/Input";
import { WorkoutSetType } from "../../../../../libs/types/workouts/WorkoutSetType";
import { ExerciseType } from "../../../../../libs/types/common/exercises/ExerciseType";
import { formatDigitsToTime } from "../../../../../libs/helpers/time/formatDigitsToTime";
import { digitsToSeconds } from "../../../../../libs/helpers/time/digitsToSeconds";
import { secondsToDigits } from "../../../../../libs/helpers/time/secondsToDigits";
import { UnitType } from "../../../../../libs/types/common/UnitType";
import { convertWeight } from "../../../../../libs/helpers/convertWeight";
import { styles } from "./styles";

type SetRowErrors = {
    reps?: string;
    durationSeconds?: string;
    weight?: string;
}

type SetRowProps = {
    item: WorkoutSetType;
    index: number;
    isActive: boolean;
    drag?: () => void;
    exerciseType: ExerciseType;
    weightUnitType: UnitType;
    rawDigits: string;
    setRawDigits: (next: string) => void;
    canDelete: boolean;
    onDelete: () => void;
    onUpdate: (next: WorkoutSetType) => void;
    onEditNotes: () => void;
    errors?: SetRowErrors;
};

function formatDisplayWeight(weightKg: number | undefined, weightUnitType: UnitType): string {
    if (weightKg == null) return "";
    const display = weightUnitType === "IMPERIAL"
        ? convertWeight(weightKg, "METRIC", "IMPERIAL")
        : weightKg;

    return Number(display.toFixed(2)).toString();
}

export function SetRow({ item, index, isActive, drag, exerciseType, weightUnitType, rawDigits, setRawDigits, canDelete, onDelete, onUpdate, onEditNotes, errors }: SetRowProps) {
    const [weightText, setWeightText] = useState(formatDisplayWeight(item.weight, weightUnitType));

    useEffect(() => {
        setWeightText(formatDisplayWeight(item.weight, weightUnitType));
    }, [item.weight, weightUnitType]);

    return (
        <Pressable onLongPress={drag} disabled={isActive} style={[styles.card, isActive && styles.cardActive]}>
            <View style={styles.cardTop}>
                {/* SETS INDEX */}
                <Text style={styles.setIndexText}>{`SET ${index + 1}`}</Text>

                <View style={styles.cardButtons}>
                    {/* EDIT BUTTON */}
                    <Pressable onPress={onEditNotes}>
                        {({ pressed }) => (
                            <PencilSquareIcon size={24} color={pressed ? "darkblue" : "blue"} strokeWidth={3} />
                        )}
                    </Pressable>

                    {/* DELETE SET BUTTON */}
                    {canDelete && (
                        <Pressable onPress={onDelete}>
                            {({ pressed }) => (
                                <MinusCircleIcon size={24} color={pressed ? "darkred" : "red"} strokeWidth={3} />
                            )}
                        </Pressable>
                    )}
                </View>
            </View>

            {/* SET */}
            <View style={styles.setContent}>
                {exerciseType === "REPS" ? (
                    <View style={{ flex: 1 }}>

                        {/* REPS */}
                        <Input
                            label="Reps"
                            placeholder="reps"
                            keyboardType="number-pad"
                            value={item.reps?.toString() ?? ""}
                            onChangeText={(t) => {
                                const reps = t === "" ? undefined : Number(t);
                                onUpdate({ ...item, reps });
                            }}
                            error={errors?.reps}
                        />
                    </View>
                ) : (
                    <View style={{ flex: 1 }}>

                        {/* DURATION */}
                        <Input
                            label="Duration"
                            placeholder="hh:mm:ss"
                            keyboardType="number-pad"
                            value={formatDigitsToTime(rawDigits)}
                            onChangeText={(t) => {
                                const nextDigits = t.replace(/\D/g, "").slice(0, 6);
                                if (nextDigits === rawDigits) return;
                                setRawDigits(nextDigits);
                            }}
                            onBlur={() => {
                                const durationSeconds = digitsToSeconds(rawDigits);
                                const normalisedDigits = secondsToDigits(durationSeconds);
                                setRawDigits(normalisedDigits);
                                onUpdate({ ...item, durationSeconds });
                            }}
                            error={errors?.durationSeconds}
                        />
                    </View>
                )}

                <View style={{ flex: 1 }}>

                    {/* WEIGHT */}
                    <Input
                        label={`Weight (${weightUnitType === "IMPERIAL" ? "LB" : "KG"})`}
                        placeholder="weight"
                        keyboardType="decimal-pad"
                        value={weightText}
                        onChangeText={(t) => {
                            const regex = /^\d*\.?\d{0,2}$/;
                            if (regex.test(t)) setWeightText(t);
                        }}
                        onBlur={() => {
                            const trimmed = weightText.trim();

                            if (trimmed === "" || trimmed === ".") {
                                onUpdate({ ...item, weight: undefined });
                                setWeightText("");
                                return;
                            }

                            const parsed = parseFloat(trimmed);
                            if (Number.isFinite(parsed)) {
                                const nextWeightKg =
                                    weightUnitType === "IMPERIAL"
                                        ? convertWeight(parsed, "IMPERIAL", "METRIC")
                                        : parsed;

                                onUpdate({ ...item, weight: nextWeightKg });
                                setWeightText(formatDisplayWeight(nextWeightKg, weightUnitType));
                            }
                        }}
                        error={errors?.weight}
                    />
                </View>
            </View>
        </Pressable>
    );
}
