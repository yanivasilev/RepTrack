import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

type SortSelectorProps = {
    value?: string;
    onChange: (value: string) => void;
};

const options = [
    { label: "Latest", value: "latest" },
    { label: "Oldest", value: "oldest" },
];

export default function SortSelector({ value, onChange }: SortSelectorProps) {
    return (
        <View>
            <Text style={styles.label}>Sort By</Text>

            <View style={styles.container}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => onChange(option.value)}
                        style={[styles.button, value === option.value && styles.buttonActive]}
                    >

                        <Text style={[styles.buttonText, value === option.value && styles.buttonTextActive]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
