import { Text, View } from "react-native";
import { styles } from "./styles";

type StatsProps = {
    label: string;
    value: number;
    good?: boolean;
    warn?: boolean
}

export default function Stats({ label, value, good, warn }: StatsProps) {
    const bg = good ? "#DCFCE7" : warn ? "#FEF3C7" : "#F3F4F6";
    const fg = good ? "#166534" : warn ? "#92400E" : "#111827";

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <Text style={[styles.label, { color: fg }]}>{label}</Text>
            <Text style={[styles.value, { color: fg }]}>{value}</Text>
        </View>
    );
}
