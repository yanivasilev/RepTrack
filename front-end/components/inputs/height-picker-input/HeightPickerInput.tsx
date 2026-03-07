import React, { useEffect, useMemo, useRef, useState } from "react";
import { DeviceEventEmitter, Keyboard, Platform, Pressable, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./styles";
import { cmToFt } from "../../../libs/helpers/height-picker-input/cmToFt";
import { formatHeight } from "../../../libs/helpers/height-picker-input/formatHeight";
import { ftToCm } from "../../../libs/helpers/height-picker-input/ftToCm";
import { UnitType } from "../../../libs/types/common/UnitType";

type Props = {
    label: string;
    value: number | null;
    onChange: (cm: number) => void;
    unit: UnitType | null;
    onUnitChange: (u: UnitType) => void;
    error?: string;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const CLOSE_INPUT_PICKERS_EVENT = "close_input_pickers";

export default function HeightPickerInput({ label, value, onChange, unit, onUnitChange, error }: Props) {
    const [show, setShow] = useState(false);
    const pickerId = useRef(`height_${Math.random().toString(36).slice(2)}`);

    const MIN_CM = 99;
    const MAX_CM = 240;

    const safeUnit: UnitType = unit ?? "METRIC";

    // DEFAULT VALUE OR MIN_CM
    const cm = value ?? MIN_CM;

    const { ft, inch } = useMemo(() => cmToFt(cm), [cm]);

    const color = error ? "red" : "green";
    const borderColor = error ? "red" : "green";

    const is1 = safeUnit === "METRIC";
    const is2 = safeUnit === "IMPERIAL";

    const cmOptions = useMemo(
        () => Array.from({ length: MAX_CM - MIN_CM + 1 }, (_, i) => MIN_CM + i),
        [MIN_CM, MAX_CM]
    );

    const minTotalIn = Math.ceil(MIN_CM / 2.54);
    const maxTotalIn = Math.floor(MAX_CM / 2.54);

    const minFt = Math.floor(minTotalIn / 12);
    const minIn = minTotalIn % 12;

    const maxFt = Math.floor(maxTotalIn / 12);
    const maxIn = maxTotalIn % 12;

    const ftOptions = useMemo(
        () => Array.from({ length: maxFt - minFt + 1 }, (_, i) => minFt + i),
        [minFt, maxFt]
    );

    const inOptions = useMemo(() => {
        if (ft === minFt) {
            return Array.from({ length: 12 - minIn }, (_, i) => minIn + i);
        }

        if (ft === maxFt) {
            return Array.from({ length: maxIn + 1 }, (_, i) => i);
        }

        return Array.from({ length: 12 }, (_, i) => i);
    }, [ft, minFt, minIn, maxFt, maxIn]);

    const handleUnitPress = (nextUnit: UnitType) => {
        onUnitChange(nextUnit);
    };

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
        <View style={{ marginBottom: 10 }}>
            {/* LABEL */}
            <Text style={[styles.label, error && { color: "red" }]}>{label}</Text>

            {/* INPUT BOX/WRAPPER */}
            <View style={styles.inputWrapper}>
                <Pressable
                    onPress={() => {
                        Keyboard.dismiss();
                        DeviceEventEmitter.emit(CLOSE_INPUT_PICKERS_EVENT, pickerId.current);
                        setShow(true);
                    }}
                    style={[
                        styles.input,
                        { borderColor },
                        { paddingRight: 80 },
                    ]}
                >
                    <Text style={{ color: "gray" }}>{formatHeight(cm, safeUnit)}</Text>
                </Pressable>

                {/* UNIT SELECTION TOGGLE (CM / FT IN) */}
                {!show && (
                    <View style={styles.unitContainer}>
                        <Pressable
                            style={[
                                styles.unitButton,
                                { borderColor },
                                is1 && styles.unitActive,
                                is1 && error && { backgroundColor: "red" },
                            ]}
                            onPress={() => handleUnitPress("METRIC")}
                        >
                            <Text style={[styles.unitText, { color }, is1 && styles.unitTextActive]}>
                                CM
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.unitButton,
                                { borderColor },
                                is2 && styles.unitActive,
                                is2 && error && { backgroundColor: "red" },
                            ]}
                            onPress={() => handleUnitPress("IMPERIAL")}
                        >
                            <Text style={[styles.unitText, { color }, is2 && styles.unitTextActive]}>
                                FT
                            </Text>
                        </Pressable>
                    </View>
                )}

                {/* DONE BUTTON (iOS only) */}
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
                            <Text style={styles.doneText}>DONE</Text>
                        </Pressable>
                    </View>
                )}
            </View>

            {/* ERROR MESSAGE */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* HEIGHT PICKER */}
            {show && (
                <View style={styles.pickerBox}>

                    {/* METRIC PICKER (METERS) */}
                    {safeUnit === "METRIC" ? (
                        <Picker
                            selectedValue={cm}
                            onValueChange={(nextCm) => {
                                onChange(nextCm);
                                if (Platform.OS === "android") setShow(false);
                            }}
                        >
                            {cmOptions.map((v) => (
                                <Picker.Item key={v} label={`${v} cm`} value={v} />
                            ))}
                        </Picker>
                    ) : (
                        <View style={styles.pickerRow}>
                            {/* FT PICKER */}
                            <Picker
                                style={styles.picker}
                                selectedValue={ft}
                                onValueChange={(nextFt) => {
                                    const nextCm = clamp(ftToCm(nextFt, inch), MIN_CM, MAX_CM);
                                    onChange(nextCm);
                                    if (Platform.OS === "android") setShow(false);
                                }}
                            >
                                {ftOptions.map((v) => (
                                    <Picker.Item key={v} label={`${v} ft`} value={v} />
                                ))}
                            </Picker>

                            {/* INCHES PICKER */}
                            <Picker
                                style={styles.picker}
                                selectedValue={inch}
                                onValueChange={(nextIn) => {
                                    const nextCm = clamp(ftToCm(ft, nextIn), MIN_CM, MAX_CM);
                                    onChange(nextCm);
                                    if (Platform.OS === "android") setShow(false);
                                }}
                            >
                                {inOptions.map((v) => (
                                    <Picker.Item key={v} label={`${v} in`} value={v} />
                                ))}
                            </Picker>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}
