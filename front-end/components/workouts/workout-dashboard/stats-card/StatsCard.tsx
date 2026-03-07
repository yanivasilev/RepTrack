import { View, Text } from "react-native";
import { styles } from "./styles";

type StatsCardProps = {
    label: string;
    value: string;
}

export default function StatsCard({ label, value }: StatsCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}