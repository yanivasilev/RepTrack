import React, { useMemo, useRef, useState } from "react";
import { View, TextInput, Pressable, Text, Button } from "react-native";

type Props = {
    label: string;
    length?: number;
    value?: string;
    onChange?: (code: string) => void;
    onComplete?: (code: string) => void;
    autoFocus?: boolean;
    error?: string;
    onClear?: () => void;
};

export default function OtpInput({ label, length = 6, value, onChange, onComplete, error, onClear }: Props) {
    const [internal, setInternal] = useState<string>("".padEnd(length, ""));
    const code = value ?? internal;

    const inputsRef = useRef<Array<TextInput | null>>([]);

    const chars = useMemo(() => {
        const arr = code.split("").slice(0, length);
        while (arr.length < length) arr.push("");

        return arr;
    }, [code, length]);

    const setCode = (next: string) => {
        const cleaned = next.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        const trimmed = cleaned.slice(0, length);
        const padded = trimmed.padEnd(length, "");

        if (value === undefined) setInternal(padded);
        onChange?.(trimmed);

        if (trimmed.length === length) onComplete?.(trimmed);
    };

    const focusIndex = (i: number) => {
        inputsRef.current[i]?.focus();
    };

    const handleChangeAt = (i: number, text: string) => {
        const incoming = text.replace(/[^a-zA-Z0-9]/g, "");

        if (incoming.length === 0) {
            // CLEAR CURRENT
            const next = chars.map((c, idx) => (idx === i ? "" : c)).join("");
            setCode(next);

            return;
        }

        const nextChars = [...chars];

        // FILL FROM CURRENT INDEX FORWARD
        for (let k = 0; k < incoming.length && i + k < length; k++) {
            nextChars[i + k] = incoming[k];
        }

        const next = nextChars.join("");
        setCode(next);

        const nextFocus = Math.min(i + incoming.length, length - 1);
        // IF FILLED, BLUE LAST INPUT
        if (next.replace(/\s/g, "").length >= length) {
            inputsRef.current[length - 1]?.blur();
        } else {
            focusIndex(nextFocus);
        }
    };

    const handleKeyPress = (i: number, key: string) => {
        if (key === "Backspace") {
            if (chars[i]) {
                // DELETE CONTENT
                const next = chars.map((c, idx) => (idx === i ? "" : c)).join("");

                setCode(next);
            } else if (i > 0) {
                // MOVE BACK AND DELETE PREVIOUS BOX
                focusIndex(i - 1);

                const next = chars.map((c, idx) => (idx === i - 1 ? "" : c)).join("");

                setCode(next);
            }
        }
    };

    const BOX = 48;
    const GAP = 13;
    const rowWidth = length * BOX + (length - 1) * GAP;
    const color = error ? "red" : "green"
    const borderColor = error ? "red" : "green"

    return (
        <View style={{ alignItems: "center" }}>
            <View style={{ width: rowWidth }}>
                <Text
                    style={{
                        marginBottom: 5,
                        color,
                        fontWeight: "bold",
                        textAlign: "left",
                    }}
                >
                    {label}
                </Text>
            </View>

            <View>
                <Pressable onPress={() => focusIndex(Math.max(0, chars.findIndex(c => c === "")))}>
                    <View style={{
                        flexDirection: "row",
                        gap: 13,
                        justifyContent: "center",
                    }}>
                        {Array.from({ length }).map((_, i) => (
                            <TextInput
                                key={i}
                                ref={(r) => { inputsRef.current[i] = r; }}
                                value={chars[i]}
                                onChangeText={(t) => handleChangeAt(i, t)}
                                onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
                                autoCapitalize="characters"
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor,
                                    textAlign: "center",
                                    fontSize: 20,
                                    fontWeight: "600",
                                    color: "gray"
                                }}
                                caretHidden
                            />
                        ))}
                    </View>
                </Pressable>

                {code.length > 0 && (
                    <Pressable
                        onPress={() => {
                            setCode("");
                            onClear?.();
                        }}
                        style={({ pressed }) => ({
                            marginTop: 10,
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            borderRadius: 8,
                            backgroundColor: pressed ? "#fdd" : "#fee",
                            alignSelf: "center",
                        })}
                    >
                        <Text style={{ color: "red", fontWeight: "600" }}>
                            Clear
                        </Text>
                    </Pressable>
                )}
            </View>

            {error && (
                <View style={{ width: rowWidth }}>
                    <Text style={{ color: "red", fontSize: 12, marginTop: 4, textAlign: "left", }}>
                        {error}
                    </Text>
                </View>
            )}
        </View>
    );
}