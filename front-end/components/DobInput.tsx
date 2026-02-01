import React, { useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

type DobInputProps = {
    label: string;
    value?: Date;
    onChange?: (date: Date) => void;
};

export default function DobInput({ label, value, onChange, }: DobInputProps) {
    const [internalDob, setInternalDob] = useState<Date>(value ?? new Date(2000, 0, 1));
    const [show, setShow] = useState<boolean>(false);

    const dob = value ?? internalDob;

    const minDate = new Date(1900, 0, 1);
    const maxDate = new Date();

    const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === "android") setShow(false);

        if (event.type === "dismissed") return;

        if (selectedDate) {
            if (!value) setInternalDob(selectedDate);
            onChange?.(selectedDate);
        }
    };

    return (
        <View>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>{label}</Text>

                <Pressable
                    onPress={() => setShow(true)}
                    style={styles.input}
                >
                    <Text style={{ color: "gray" }}>{dob.toLocaleDateString()}</Text>
                </Pressable>

                {show && Platform.OS === "ios" && (
                    <View style={styles.doneContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.doneButton,
                                pressed && styles.pressed,
                            ]}
                            onPress={() => setShow(false)}
                        >
                            <Text style={[styles.doneText]}>
                                DONE
                            </Text>
                        </Pressable>
                    </View>
                )}
            </View>

            {show && (
                <DateTimePicker
                    value={dob}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleChange}
                    minimumDate={minDate}
                    maximumDate={maxDate}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 5,
        color: "green",
        fontWeight: "bold",
    },
    inputWrapper: {
        position: "relative",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "green",
        borderRadius: 8,
        padding: 12,
        paddingRight: 80,
    },
    doneContainer: {
        position: "absolute",
        right: 8,
        top: "50%",
        flexDirection: "row",
        transform: [{ translateY: -5 }],
    },
    doneButton: {
        width: 40,
        height: 32,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "green",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "green",
    },
    doneText: {
        fontSize: 12,
        fontWeight: "700",
        color: "white",
    },
    pressed: {
        backgroundColor: "darkgreen"
    }
});