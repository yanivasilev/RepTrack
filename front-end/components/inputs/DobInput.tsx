import React, { useEffect, useRef, useState } from "react";
import { DeviceEventEmitter, Keyboard, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

type DobInputProps = {
    label: string;
    value?: Date;
    onChange?: (date: Date) => void;
    error?: string;
};
const CLOSE_INPUT_PICKERS_EVENT = "close_input_pickers";

export default function DobInput({ label, value, onChange, error }: DobInputProps) {
    const [internalDob, setInternalDob] = useState<Date>(value ?? new Date(2000, 0, 1));
    const [show, setShow] = useState<boolean>(false);
    const pickerId = useRef(`dob_${Math.random().toString(36).slice(2)}`);

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

    const color = error ? "red" : "green";
    const borderColor = error ? "red" : "green";

    useEffect(() => {
        const closeFromKeyboard = Keyboard.addListener("keyboardDidShow", () => {
            setShow(false);
        });

        const closeFromEvent = DeviceEventEmitter.addListener(
            CLOSE_INPUT_PICKERS_EVENT,
            (openedById?: string) => {
                if (openedById !== pickerId.current) setShow(false);
            }
        );

        return () => {
            closeFromKeyboard.remove();
            closeFromEvent.remove();
        };
    }, []);

    return (
        <View>
            <View style={styles.inputWrapper}>
                <Text style={{
                    marginBottom: 5,
                    color,
                    fontWeight: "bold",
                }}>
                    {label}
                </Text>

                <Pressable
                    onPress={() => {
                        Keyboard.dismiss();
                        DeviceEventEmitter.emit(CLOSE_INPUT_PICKERS_EVENT, pickerId.current);
                        setShow(true);
                    }}
                    style={{
                        width: "100%",
                        borderWidth: 1,
                        borderColor,
                        borderRadius: 8,
                        padding: 12,
                        paddingRight: 80,
                    }}
                >
                    <Text style={{ color: "gray" }}>{dob.toLocaleDateString()}</Text>
                </Pressable>

                {error && (
                    <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                        {error}
                    </Text>
                )}

                {/* DONE BUTTON (IOS ONLY) */}
                {show && Platform.OS === "ios" && (
                    <View style={styles.doneContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.doneButton,
                                error && styles.doneButtonError,
                                pressed && styles.pressed,
                            ]}
                            onPress={() => setShow(false)}
                        >
                            <Text style={styles.doneText}>
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
    inputWrapper: {
        position: "relative"
    },
    doneContainer: {
        position: "absolute",
        right: 8,
        top: 28,
        flexDirection: "row"
    },
    doneButton: {
        width: 40,
        height: 32,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "green",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "green"
    },
    doneButtonError: {
        borderColor: "red",
        backgroundColor: "red"
    },
    doneText: {
        fontSize: 12,
        fontWeight: "700",
        color: "white"
    },
    pressed: {
        backgroundColor: "darkgreen"
    }
});
