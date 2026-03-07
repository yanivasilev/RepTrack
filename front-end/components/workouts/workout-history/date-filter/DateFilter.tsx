import { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, Text, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "./styles";

type DateFilterProps = {
    label: string;
    value?: Date;
    onChange: (date: Date) => void;
    onClear?: () => void;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    maximumDate?: Date;
    minimumDate?: Date;
};

export default function DateFilter({ label, value, onChange, onClear, isOpen, onOpen, onClose, maximumDate, minimumDate }: DateFilterProps) {
    const [draftDate, setDraftDate] = useState<Date>(value ?? new Date());

    const safeMax = useMemo(() => {
        if (!maximumDate) return undefined;

        const d = new Date(maximumDate);
        d.setHours(23, 59, 59, 999);

        return d;
    }, [maximumDate]);

    useEffect(() => {
        setDraftDate(value ?? new Date());
    }, [value, isOpen]);

    const handleChange = (_: any, selectedDate?: Date) => {
        if (!selectedDate) return;

        if (Platform.OS === "android") {
            onChange(selectedDate);
            onClose();
            return;
        }

        setDraftDate(selectedDate);
    };

    const handleDone = () => {
        onChange(draftDate);
        onClose();
    };

    return (
        <View>
            {/*LABEL */}
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity onPress={onOpen} style={styles.inputWrapper}>
                <Text style={styles.inputText}>
                    {value ? value.toDateString() : "Select date"}
                </Text>

                {/* DONE BUTTON (IOS ONLY) */}
                {isOpen && Platform.OS === "ios" && (
                    <View style={styles.doneContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.doneButton,
                                pressed && styles.pressed,
                            ]}
                            onPress={handleDone}
                        >
                            <Text style={styles.doneText}>
                                DONE
                            </Text>
                        </Pressable>
                    </View>
                )}
            </TouchableOpacity>

            {isOpen && (
                <DateTimePicker
                    value={draftDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleChange}
                    maximumDate={safeMax}
                    minimumDate={minimumDate}
                />
            )}

            {value && onClear && (
                <Pressable
                    onPress={onClear}
                    style={({ pressed }) => [styles.clearButton, pressed && styles.clearButtonPressed]}
                >
                    <Text style={styles.clearText}>CLEAR</Text>
                </Pressable>
            )}
        </View>
    );
}
