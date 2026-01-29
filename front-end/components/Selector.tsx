import { View, Pressable, Text, StyleSheet } from "react-native";

type SelectorProps<Type extends readonly string[]> = {
    label: string;
    options: Type;
    value: Type[number] | null;
    onSelect: (option: Type[number]) => void;
    layout?: "one-row" | "two-rows";
};

export default function Selector<Type extends readonly string[]>({ label, options, value, onSelect, layout = "one-row" }: SelectorProps<Type>) {

    const topRow = layout === "one-row" ? options : options.slice(0, 3);
    const bottomRow = options.slice(3);

    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.grid}>

                {/* TOP ROW */}
                <View style={styles.row}>
                    {topRow.map((option) => (
                        <Pressable
                            key={option}
                            onPress={() => onSelect(option)}
                            style={[
                                styles.button,
                                value === option && styles.activeButton,
                                styles.threeOptionsWidth,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.text,
                                    value === option && styles.activeText,
                                ]}
                            >
                                {option}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {layout === "two-rows" && (
                    <View style={[styles.row, { justifyContent: "center", columnGap: 12 }]}>
                        {bottomRow.map((option) => (
                            <Pressable
                                key={option}
                                onPress={() => onSelect(option)}
                                style={[
                                    styles.button,
                                    value === option && styles.activeButton,
                                    styles.twoOptionsWidth,
                                ]}
                            >
                                <Text style={[styles.text, value === option && styles.activeText]}>
                                    {option}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}

            </View>
        </View >
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
