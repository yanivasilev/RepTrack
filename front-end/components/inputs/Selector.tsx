import { View, Pressable, Text, StyleSheet } from "react-native";

type Option = { label: string; value: string };

type SelectorProps<T extends readonly Option[]> = {
    label: string;
    options: T;
    value: T[number]["value"] | null;
    onSelect: (option: T[number]["value"]) => void;
    layout?: "one-row" | "two-rows";
    error?: string;
};

export default function Selector<T extends readonly Option[]>({
    label,
    options,
    value,
    onSelect,
    layout = "one-row",
    error,
}: SelectorProps<T>) {
    const topRow = layout === "one-row" ? options : options.slice(0, 3);
    const bottomRow = options.slice(3);

    return (
        <View>
            <Text style={[styles.label, error && { color: "red" }]}>{label}</Text>

            <View style={styles.grid}>
                {/* TOP ROW */}
                <View style={styles.row}>
                    {topRow.map((option) => {
                        const selected = value === option.value;

                        return (
                            <Pressable
                                key={option.value}
                                onPress={() => onSelect(option.value)}
                                style={[
                                    styles.button,
                                    selected && styles.activeButton,
                                    error && { borderColor: "red" },
                                    styles.threeOptionsWidth,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.text,
                                        selected && styles.activeText,
                                        error && { color: "red" },
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {layout === "two-rows" && (
                    <View style={[styles.row, { justifyContent: "center", columnGap: 12 }]}>
                        {bottomRow.map((option) => {
                            const selected = value === option.value;

                            return (
                                <Pressable
                                    key={option.value}
                                    onPress={() => onSelect(option.value)}
                                    style={[
                                        styles.button,
                                        selected && styles.activeButton,
                                        error && { borderColor: "red" },
                                        styles.twoOptionsWidth,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.text,
                                            selected && styles.activeText,
                                            error && { color: "red" },
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                )}
            </View>

            {error && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
                    {error}
                </Text>
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
    grid: {
        rowGap: 12,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    threeOptionsWidth: {
        width: "32%",
    },
    twoOptionsWidth: {
        width: "40%",
    },
    button: {
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "green",
        alignItems: "center",
    },
    activeButton: {
        backgroundColor: "green",
        borderColor: "green",
    },
    text: {
        color: "green",
        fontWeight: "bold",
        textAlign: "center",
    },
    activeText: {
        color: "white",
    },
});
